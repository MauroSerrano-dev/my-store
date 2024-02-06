import { DEFAULT_LANGUAGE, LIMITS, PRODUCTS_TYPES } from "@/consts";
import { isTokenValid } from "@/utils/auth";
import axios from 'axios'
import { getDisabledProducts, getProductsByIds } from "../../../backend/product";
import { filterNotInPrintify } from "../../../backend/printify";
import { getCurrencyById, getShippingInfos } from "../../../backend/app-settings";
import { getProductPriceUnit } from "@/utils/prices";
import { DISABLE_CHECKOUT } from "@/utils/app-controller";

const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { authorization } = req.headers

    if (!authorization)
      res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
      res.status(401).json({ error: "Invalid authentication" })

    if (req.method === 'POST') {
      const {
        customer,
        cartItems,
        currency_code,
        shippingCountry,
        success_url,
        cancel_url,
        user_language,
      } = req.body

      if (DISABLE_CHECKOUT)
        res.status(400).json({ error: { type: 'warning', message: 'checkout_temporarily_disabled' } })

      if (cartItems.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
        res.status(400).json({ error: { type: 'warning', message: 'cart_contains_more_than_limit' } })

      const currency = await getCurrencyById(currency_code)

      const notExistingProducts = await filterNotInPrintify(cartItems)
      if (notExistingProducts.length !== 0) {
        res.status(400).json({
          error: {
            message: 'disabled_products',
            customProps: {
              disabledProducts: notExistingProducts,
              options: {
                count: notExistingProducts.length,
                product_title: notExistingProducts[0].title,
              }
            }
          }
        })
      }

      const disabledProducts = await getDisabledProducts(cartItems)
      if (disabledProducts.length !== 0) {
        res.status(400).json({
          error: {
            message: 'disabled_products',
            customProps: {
              disabledProducts: disabledProducts,
              options: {
                count: disabledProducts.length,
                product_title: disabledProducts[0].title,
              }
            }
          }
        })
      }

      let outOfStock = []

      const asyncOutOfStockRequests = cartItems.map(async item => {
        const blueprint_id = PRODUCTS_TYPES[item.type_id].blueprint_ids[item.provider_id]
        const base_url_print = `https://api.printify.com/v1/catalog/blueprints/${blueprint_id}/print_providers/${item.provider_id}/variants.json?show-out-of-stock=0`
        const headers_print = { Authorization: process.env.PRINTIFY_ACCESS_TOKEN }
        const print_res = await axios.get(base_url_print, { headers: headers_print })
        if (!print_res.data.variants.some(vari => vari.id == item.variant.id_printify))
          outOfStock.push({ id: item.id, title: item.title, variant: item.variant })
      })

      await Promise.all(asyncOutOfStockRequests)
      if (outOfStock.length !== 0) {
        res.status(400).json({
          error: {
            message: 'out_of_stock',
            customProps: {
              outOfStock: outOfStock,
              options: {
                count: outOfStock.length,
                country: shippingCountry,
                product_title: outOfStock[0].title,
                variant_title: outOfStock[0].variant.title,
              }
            }
          }
        })
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

      const productsFullInfo = await getProductsByIds(cartItems.map(item => item.id))

      const line_items = cartItems.map(item => {
        const productFullInfo = productsFullInfo.find(prod => prod.id === item.id)
        const variantFullInfo = productFullInfo.variants.find(vari => vari.id === item.variant.id)
        return {
          price_data: {
            currency: currency.code,
            product_data: {
              name: productFullInfo.title,
              images: [item.image_src],
              description: item.description,
              metadata: {
                id: productFullInfo.id,
                variant_id: variantFullInfo.id,
                quantity: item.quantity
              },
            },
            unit_amount: getProductPriceUnit(productFullInfo, variantFullInfo, currency.rate),
          },
          quantity: item.quantity,
        }
      })

      const cartMetadata = {}

      cartItems.forEach((item, i) => {
        const productFullInfo = productsFullInfo.find(prod => prod.id === item.id)
        const variantFullInfo = productFullInfo.variants.find(vari => vari.id === item.variant.id)
        cartMetadata[i] = JSON.stringify(
          {
            id: productFullInfo.id,
            id_printify: item.id_printify,
            quantity: item.quantity,
            variant_id: variantFullInfo.id,
            variant_id_printify: item.variant.id_printify,
            art_position: item.art_position,
          }
        )
      })

      const paymentMetadata = {
        user_language: user_language,
        ...cartMetadata
      }

      if (customer)
        paymentMetadata.user_id = customer.id

      const productsLessInfo = cartItems.map(prod => (
        {
          type_id: prod.type_id,
          variant_id: prod.variant.id,
          quantity: prod.quantity
        }
      ))

      const shippingInfos = await getShippingInfos(productsLessInfo, shippingCountry)
      const shippingValue = Math.round((shippingInfos.shippingValue + shippingInfos.taxValue) * currency.rate)

      const session = await stripe.checkout.sessions.create({
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
                currency: currency.code,
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
        allow_promotion_codes: false,
        success_url: success_url,
        cancel_url: cancel_url,
        customer: stripeCustomer?.id || undefined,
        /* customer_email: (stripeCustomer || customer)?.email */
        locale: user_language,
        metadata: paymentMetadata,
      })

      // res.redirect(303, session.url)
      res.status(200).json({ url: session.url })
    }
  }
  catch (error) {
    res.status(error.statusCode || 500).json({ error: error })
  }
}