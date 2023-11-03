import axios from 'axios'
import { updateCart } from '../../../../backend/cart'
import { updateCartSessionProducts } from '../../../../backend/cart-session'
import { createOrder } from '../../../../backend/orders'
const { v4: uuidv4 } = require('uuid')

const Stripe = require("stripe")

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const sig = req.headers['stripe-signature']

    try {
        stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
    catch (error) {
        return res.status(401).json({ error: `Invalid authentication. ${error}` })
    }

    try {
        if (req.method === "POST") {
            const body = req.body
            const type = body.type
            const data = body.data.object

            if (type === 'checkout.session.completed') {
                const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`

                const items = data.metadata

                const cart_id = JSON.parse(items.cart_id)
                const is_loggin = JSON.parse(items.is_loggin)

                delete items.cart_id
                delete items.is_loggin

                const line_items = Object.keys(items).map(key => JSON.parse(items[key]))

                const orderId = uuidv4()

                const options = {
                    headers: {
                        Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                        'Content-Type': 'application/json',
                    },
                }

                const body_data = {
                    external_id: orderId,
                    label: `Order: ${orderId}`,
                    line_items: line_items.map(lineItem => (
                        {
                            product_id: lineItem.id_printify,
                            variant_id: lineItem.variant_id,
                            quantity: lineItem.quantity,
                        }
                    )),
                    shipping_method: 1,
                    send_shipping_notification: true,
                    address_to: {
                        first_name: data.customer_details.name,
                        last_name: "Serrano",
                        email: data.customer_details.email,
                        phone: data.customer_details.phone,
                        country: data.shipping_details.address.country,
                        region: data.shipping_details.address.state === '' ? data.shipping_details.address.city : data.shipping_details.address.state,
                        address1: data.shipping_details.address.line1,
                        address2: data.shipping_details.address.line2,
                        city: data.shipping_details.address.city,
                        zip: data.shipping_details.address.postal_code
                    }
                }

                const printifyRes = await axios.post(base_url, body_data, options)

                await createOrder(
                    {
                        id: orderId,
                        printify_id: printifyRes.data.id,
                        customer: {
                            ...data.customer_details,
                        },
                        shipping_details: {
                            shipping_cost: data.shipping_cost,
                            ...data.shipping_details,
                        },
                        products: line_items,
                        stripe_id: data.id,
                        currency: data.currency,
                        amount_total: data.amount_total,
                        amount_subtotal: data.amount_subtotal,
                    }
                )

                if (is_loggin)
                    await updateCart(cart_id, [])
                else
                    await updateCartSessionProducts(cart_id, [])

                res.status(200).json({ message: `Order ${orderId} Created. Checkout Complete!` })
            }
            else if (type === 'checkout.session.async_payment_succeeded') {
            }
            else if (type === 'checkout.session.async_payment_failed') {
            }
            else if (type === 'checkout.session.expired') {
                res.status(200).json({ message: 'Checkout Session Expired!' })
            }
            else {
                res.status(200).json({ message: 'Outros eventos!' })
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error on stripe webhook' })
    }
}