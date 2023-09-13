import axios from 'axios';
import { updateField } from '../../../../backend/user';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body;
        const type = body.type;
        const data = body.data.object;

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
                "external_id": "2225sadds3",
                "label": "Order 222dsdsaa53",
                "line_items": [
                    {
                        "product_id": "64df65c1a996f39335017a6c",
                        "variant_id": 12149,
                        "quantity": 1
                    },
                    {
                        "product_id": "64ed7b0c2fce7b60bc02fb06",
                        "variant_id": 38224,
                        "quantity": 1
                    }
                ],
                "shipping_method": 1,
                "send_shipping_notification": true,
                "address_to": {
                    "first_name": "Mauro",
                    "email": "mauro.serrano.dev@gmail.com",
                    "phone": "+351910651120",
                    "country": "US",
                    "region": "Lisbon",
                    "address1": "R. Stefan Zweig 42, 1 esquerda",
                    "address2": "",
                    "city": "Estoril",
                    "zip": "2765-610"
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