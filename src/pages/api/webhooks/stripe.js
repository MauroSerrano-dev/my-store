import axios from 'axios'
import { setCartProducts } from '../../../../backend/cart'
import { setCartSessionProducts } from '../../../../backend/cart-session'
import { createOrder } from '../../../../backend/orders'
import getRawBody from 'raw-body'
import { deleteProductsFromWishlist } from '../../../../backend/wishlists'
import { sendPurchaseConfirmationEmail } from '../../../../backend/email-sender'
import { STEPS } from '@/consts'
const { v4: uuidv4 } = require('uuid')

const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    const sig = req.headers['stripe-signature']

    let event

    try {
        const rawBody = await getRawBody(req)
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid authentication.' })
    }

    try {
        const type = event.type
        const data = event.data.object

        if (type === 'charge.succeeded') {
            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`

            const metadata = data.metadata

            const cart_id = metadata.cart_id || null
            const user_id = metadata.user_id || null
            const user_language = metadata.user_language || null
            const shippingValue = metadata.shippingValue || null

            delete metadata.cart_id
            delete metadata.user_id
            delete metadata.user_language
            delete metadata.shippingValue

            const line_items = Object.keys(metadata).map(key => JSON.parse(metadata[key]))

            const orderId = uuidv4()

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json',
                },
            }

            const fullName = data.shipping.name
            const fullNameArr = data.shipping.name.split(' ')

            const first_name = fullNameArr.length <= 1 ? fullName : fullNameArr.slice(0, fullNameArr.length - 1).join(' ')
            const last_name = fullNameArr.length <= 1 ? '.' : fullNameArr[fullNameArr.length - 1]

            const body_data = {
                external_id: orderId,
                label: `Order: ${orderId}`,
                line_items: line_items.map(lineItem => (
                    {
                        product_id: lineItem.id_printify,
                        variant_id: lineItem.variant_id_printify,
                        quantity: lineItem.quantity,
                    }
                )),
                shipping_method: 1,
                send_shipping_notification: true,
                address_to: {
                    first_name: first_name,
                    last_name: last_name,
                    email: data.billing_details.email,
                    phone: data.shipping.phone,
                    country: data.shipping.address.country,
                    region: data.shipping.address.state === '' ? data.shipping.address.country : data.shipping.address.state,
                    address1: data.shipping.address.line1,
                    address2: data.shipping.address.line2,
                    city: data.shipping.address.city,
                    zip: data.shipping.address.postal_code
                }
            }

            const printifyRes = await axios.post(base_url, body_data, options)

            await createOrder(
                {
                    id: orderId,
                    id_printify: printifyRes.data.id,
                    user_id: user_id,
                    stripe_id: data.payment_intent,
                    receipt_url: data.receipt_url,
                    products: line_items.map(prod => (
                        {
                            id: prod.id,
                            id_printify: prod.id_printify,
                            price: prod.price,
                            quantity: prod.quantity,
                            variant_id: prod.variant_id,
                            variant_id_printify: prod.variant_id_printify,
                            status: STEPS[0].id
                        }
                    )),
                    user_details: {
                        email: data.billing_details.email,
                        name: data.billing_details.name,
                        phone: data.billing_details.phone,
                    },
                    payment_details: {
                        amount_total: data.amount,
                        amount_refunded: data.amount_refunded,
                        amount_subtotal: data.amount - shippingValue,
                        amount_shipping: shippingValue,
                        currency: data.currency,
                    },
                    shipping_details: {
                        name: data.shipping.name,
                        address: {
                            city: data.shipping.address.city,
                            country: data.shipping.address.country,
                            line1: data.shipping.address.line1,
                            line2: data.shipping.address.line2,
                            postal_code: data.shipping.address.postal_code,
                            state: data.shipping.address.state === '' ? null : data.shipping.address.state,
                        },
                    },
                }
            )

            await sendPurchaseConfirmationEmail(data.billing_details.email, orderId, user_language)

            if (cart_id) {
                if (user_id) {
                    await setCartProducts(cart_id, [])
                    await deleteProductsFromWishlist(user_id, line_items.map(prod => prod.id))
                }
                else
                    await setCartSessionProducts(cart_id, [])
            }
            res.status(200).json({ message: `Order ${orderId} Created. Checkout Complete!` })
        }
        else {
            res.status(200).json({ message: 'Other Events!' })
        }
    } catch (error) {
        res.status(500).json({ error: `Error on stripe webhook: ${error}` })
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}