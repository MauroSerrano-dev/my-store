import { DEFAULT_LANGUAGE } from "@/consts";
import { isTokenValid } from "@/utils/auth";
import axios from 'axios'

const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { authorization } = req.headers

  if (!authorization)
    return res.status(401).json({ error: "Invalid authentication." })

  if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
    return res.status(401).json({ error: "Invalid authentication." })

  if (req.method === 'POST') {
    const {
      customer,
      cartItems,
      shippingValue,
      currency,
      shippingCountry,
      cart_id,
      success_url,
      cancel_url,
      user_language,
    } = req.body

    let outOfStock = []

    const asyncRequests = cartItems.map(async item => {
      const base_url_print = `https://api.printify.com/v1/catalog/blueprints/${item.blueprint_ids[item.provider_id]}/print_providers/${item.provider_id}/variants.json?show-out-of-stock=0`
      const headers_print = { Authorization: process.env.PRINTIFY_ACCESS_TOKEN }
      const print_res = await axios.get(base_url_print, { headers: headers_print })
      if (print_res.data.variants.every(vari => vari.id !== item.variant_id_printify))
        outOfStock.push({ id: item.id, title: item.title, variant: item.variant })
    })

    await Promise.all(asyncRequests)

    if (outOfStock.length !== 0) {
      return res.status(200).json({ outOfStock: outOfStock })
    }

    let stripeCustomer

    if (customer) {
      // Check if the email already exists in Stripe
      const existingCustomer = await stripe.customers.list({
        email: customer.email,
        limit: 1,
      })
      // The customer doesn't exist, create a new one
      if (existingCustomer.data.length === 0) {
        stripeCustomer = await stripe.customers.create({
          name: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          preferred_locales: [user_language, DEFAULT_LANGUAGE]
        })
      }
      // Customer exist, update preferred_locales
      else {
        const customerId = existingCustomer.data[0].id
        stripeCustomer = await stripe.customers.update(customerId, {
          preferred_locales: [user_language, DEFAULT_LANGUAGE]
        })
      }
    }

    const line_items = cartItems.map(item => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.title,
            images: [item.image.src],
            description: item.description,
            metadata: {
              id: item.id,
              variant_id: item.variant.id,
              quantity: item.quantity
            },
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
    })

    const cartMetadata = {}

    cartItems.forEach((item, i) => {
      cartMetadata[i] = JSON.stringify(
        {
          id: item.id,
          id_printify: item.id_printify,
          variant_id: item.variant.id,
          variant_id_printify: item.variant_id_printify,
          quantity: item.quantity,
          price: item.price,
        }
      )
    })

    const session = await stripe.checkout.sessions.create({
      metadata: {
        cart_id: cart_id || '',
        user_id: customer?.id || '',
        user_language: user_language,
        ...cartMetadata
      },
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: [shippingCountry],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingValue,
              currency: currency,
            },
            display_name: "Standart",
            /* delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            }, */
          },
        },
      ],
      /* phone_number_collection: {
        enabled: true,
      }, */
      line_items: line_items,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: success_url,
      cancel_url: cancel_url,
      customer: stripeCustomer?.id || undefined,
      /* customer_email: (stripeCustomer || customer)?.email */
      locale: user_language,
      payment_intent_data: {
        metadata: {
          cart_id: cart_id || '',
          user_id: customer?.id || '',
          user_language: user_language,
          ...cartMetadata
        },
      }
    })

    // res.redirect(303, session.url)
    return res.send({ url: session.url })
  }
}