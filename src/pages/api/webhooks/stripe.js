import axios from 'axios';
import { updateCart } from '../../../../backend/cart';
import { updateCartSessionProducts } from '../../../../backend/cart-session';
import { handleProductsPurchased } from '../../../../backend/product';

export default async function handler(req, res) {
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

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json',
                },
            }

            const body_data = {
                external_id: body.id,
                label: body.id,
                line_items: line_items,
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

            await axios.post(base_url, body_data, options)

            await handleProductsPurchased(line_items)

            if (is_loggin)
                await updateCart(cart_id, [])
            else
                await updateCartSessionProducts(cart_id, [])
            res.status(200).json({ message: `Checkout Session Complete!${JSON.stringify(line_items)}` })
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
}