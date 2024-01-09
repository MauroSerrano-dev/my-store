import axios from 'axios'
import { setCartProducts } from '../../../../backend/cart'
import { createOrder, refundOrderByStripeId } from '../../../../backend/orders'
import { handleStripeWebhookFail } from '../../../../backend/app-settings'
import { deleteProductsFromWishlist } from '../../../../backend/wishlists'
import { sendPurchaseConfirmationEmail } from '../../../../backend/email-sender'
import getRawBody from 'raw-body'
import { STEPS } from '@/consts'
const { v4: uuidv4 } = require('uuid')

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    const sig = req.headers['stripe-signature']

    let event

    try {
        const rawBody = await getRawBody(req)
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid authentication' })
    }

    try {
        const { type, data } = event
        const {
            customer_details,
            shipping_details,
            metadata,
            payment_intent,
            amount_total,
            amount_subtotal,
            total_details,
            payment_method_types,
            currency,
            amount_refunded,
        } = data.object

        if (type === 'checkout.session.completed') {
            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`

            const newMetadata = { ...metadata }

            const cart_id = newMetadata.cart_id || null
            const user_id = newMetadata.user_id || null
            const user_language = newMetadata.user_language || null

            delete newMetadata.cart_id
            delete newMetadata.user_id
            delete newMetadata.user_language
            delete newMetadata.shippingValue

            const line_items = Object.keys(newMetadata).map(key => JSON.parse(newMetadata[key]))

            const orderId = uuidv4()

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json',
                },
            }

            const fullName = shipping_details.name
            const fullNameArr = shipping_details.name.split(' ')

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
                    email: customer_details.email,
                    phone: shipping_details.phone,
                    country: shipping_details.address.country,
                    region: shipping_details.address.state === '' ? shipping_details.address.country : shipping_details.address.state,
                    address1: shipping_details.address.line1,
                    address2: shipping_details.address.line2,
                    city: shipping_details.address.city,
                    zip: shipping_details.address.postal_code
                }
            }

            const printifyRes = await axios.post(base_url, body_data, options)

            const stripePaymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
            const stripeCharge = await stripe.charges.retrieve(stripePaymentIntent.latest_charge)

            await createOrder(
                orderId,
                {
                    id_printify: printifyRes.data.id,
                    user_id: user_id,
                    user_email: customer_details.email,
                    id_stripe_payment_intent: payment_intent,
                    receipt_url: stripeCharge.receipt_url,
                    products: line_items.map(prod => (
                        {
                            id: prod.id,
                            id_printify: prod.id_printify,
                            quantity: prod.quantity,
                            variant_id: prod.variant_id,
                            variant_id_printify: prod.variant_id_printify,
                            status: STEPS[0]
                        }
                    )),
                    payment_details: {
                        total: amount_total,
                        discount: total_details.amount_discount,
                        shipping: total_details.amount_shipping,
                        tax: total_details.amount_tax,
                        refund: null,
                        subtotal: amount_subtotal,
                        currency: currency,
                        payment_methods: payment_method_types
                    },
                    shipping_details: {
                        name: shipping_details.name,
                        address: {
                            city: shipping_details.address.city,
                            country: shipping_details.address.country,
                            line1: shipping_details.address.line1,
                            line2: shipping_details.address.line2,
                            postal_code: shipping_details.address.postal_code,
                            state: shipping_details.address.state === '' ? null : shipping_details.address.state,
                        },
                    },
                }
            )

            if (customer_details.email)
                await sendPurchaseConfirmationEmail(customer_details.email, orderId, user_language)

            if (cart_id) {
                if (user_id) {
                    await setCartProducts(cart_id, [])
                    await deleteProductsFromWishlist(user_id, line_items.map(prod => prod.id))
                }
            }
            res.status(200).json({ message: `Order ${orderId} Created. Checkout Complete!` })
        }
        else if (type === 'charge.refunded') {
            await refundOrderByStripeId(payment_intent, amount_refunded)
            res.status(200).json({ message: `Order stripe id ${payment_intent} Refunded. Charge Refunded!` })
        }
    } catch (error) {
        try {
            await handleStripeWebhookFail(event?.id)
            res.status(500).json({ message: 'Error on stripe webhook', error: error })
        }
        catch {
            res.status(500).json({ message: 'Error on handleStripeWebhookFail', error: error })
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}