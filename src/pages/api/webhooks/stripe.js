import axios from 'axios';
import { updateField } from '../../../../backend/user';

export default async function handler(req, res) {
    console.log('fudeu')
    if (req.method === "POST") {
        const body = req.body;
        const type = body.type;
        const data = body.data.object;
        console.log('data', data)
        if (type === 'checkout.session.completed') {
            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`;
            const line_items = Object.keys(data.metadata).map(key => JSON.parse(data.metadata[key]));

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                    'Content-Type': 'application/json',
                },
            };
            const body_data = {
                external_id: body.id,
                label: body.id,
                line_items: line_items,
                shipping_method: 1,
                send_shipping_notification: true,
                address_to: {
                    first_name: data.customer_details.name,
                    last_name: "Roge",
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
            /* await updateField('joK8xLy3yyVz2kfNEW8kJkuD0pw2', 'aaa', body_data) */
            await axios.post(base_url, body_data, options);
            res.status(200).json({ message: 'Checkout Session Complete!' });
        }
        else if (type === 'checkout.session.async_payment_succeeded') {
            // Lógica para pagamento bem-sucedido
        }
        else if (type === 'checkout.session.async_payment_failed') {
            // Lógica para pagamento falhou
        }
        else if (type === 'checkout.session.expired') {
            res.status(200).json({ message: 'Checkout Session Expired!' });
        }
        else {
            res.status(200).json({ message: 'Outros eventos!' });
        }
    }
}