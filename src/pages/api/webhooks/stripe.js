import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body
        const type = body.type
        const data = body.data.object

        if (type === 'checkout.session.completed') {
            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`;

            const line_items = Object.keys(data.metadata).map(item => JSON.parse(item))

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    external_id: body.id,
                    label: body.id,
                    line_items: line_items,
                    shipping_method: 1,
                    send_shipping_notification: true,
                    address_to: {
                        first_name: data.customer_details.name,
                        /* last_name: "Roge", */
                        email: data.customer_details.email,
                        phone: data.customer_details.phone,
                        country: data.shipping_details.country,
                        region: data.shipping_details.state,
                        address1: data.shipping_details.line1,
                        address2: data.shipping_details.line2,
                        city: data.shipping_details.city,
                        zip: data.shipping_details.postal_code
                    }
                })
            }

            await axios.post(base_url, options)

            res.status(200).json({ message: 'Checkout Session Complete!' })
        }
        else if (type === 'checkout.session.async_payment_succeeded') {
        }
        else if (type === 'checkout.session.async_payment_failed') {
        }
        else if (type === 'checkout.session.expired') {
            res.status(200).json({ message: 'Checkout Session Expired!' })
        }
        else
            res.status(200).json({ message: 'Outros eventos!' })
    }
}