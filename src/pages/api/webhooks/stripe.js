import axios from 'axios'
import { setCartProducts } from '../../../../backend/cart'
import { setCartSessionProducts } from '../../../../backend/cart-session'
import { createOrder, updateOrderFieldByStripeId } from '../../../../backend/orders'
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

        if (type === 'checkout.session.completed') {
            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`

            const metadata = data.metadata

            const cart_id = metadata.cart_id === '' ? null : metadata.cart_id
            const user_id = metadata.user_id === '' ? null : metadata.user_id
            const user_language = metadata.user_language === '' ? null : metadata.user_language

            delete metadata.cart_id
            delete metadata.user_id
            delete metadata.user_language

            const line_items = Object.keys(metadata).map(key => JSON.parse(metadata[key]))

            const orderId = uuidv4()

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json',
                },
            }

            const fullName = data.shipping_details.name
            const fullNameArr = data.shipping_details.name.split(' ')

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
                    email: data.customer_details.email,
                    phone: data.customer_details.phone,
                    country: data.shipping_details.address.country,
                    region: data.shipping_details.address.state === '' ? data.shipping_details.address.country : data.shipping_details.address.state,
                    address1: data.shipping_details.address.line1,
                    address2: data.shipping_details.address.line2,
                    city: data.shipping_details.address.city,
                    zip: data.shipping_details.address.postal_code
                }
            }

            const printifyRes = await axios.post(base_url, body_data, options)

            const amount_details = {
                amount_total: data.amount_total,
                amount_discount: data.total_details.amount_discount,
                amount_subtotal: data.amount_subtotal,
                amount_shipping: data.total_details.amount_shipping,
                amount_tax: data.total_details.amount_tax,
                currency: data.currency,
            }

            await createOrder(
                {
                    id: orderId,
                    id_printify: printifyRes.data.id,
                    user_id: user_id,
                    stripe_id: data.payment_intent,
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
                    customer: {
                        email: data.customer_details.email,
                        name: data.customer_details.name,
                        phone: data.customer_details.phone,
                        tax_exempt: data.customer_details.tax_exempt,
                        tax_ids: data.customer_details.tax_ids,
                    },
                    amount: amount_details,
                    shipping_details: data.shipping_details,
                }
            )

            await sendPurchaseConfirmationEmail(data.customer_details, orderId, user_language)

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
        else if (type === 'charge.succeeded') {
            try {
                await updateOrderFieldByStripeId(data.payment_intent, 'receipt_url', data.receipt_url)
                console.log(`Order ${data.payment_intent} receipt_url updated!`)
                res.status(200).json({ message: 'Charge Succeedded Complete!' })
            }
            catch (error) {
                console.error(`Error updating order ${data.payment_intent} receipt_url`, error)
                res.status(500).json({ message: `Error updating order ${data.payment_intent} receipt_url` })
            }
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