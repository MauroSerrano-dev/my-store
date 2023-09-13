import axios from 'axios';
import { updateField } from '../../../../backend/user';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body;
        const type = body.type;
        const data = body.data.object;

        if (type === 'checkout.session.completed') {
            try {
                const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`;
                const line_items = Object.keys(data.metadata).map(key => JSON.parse(data.metadata[key]));
                updateField('joK8xLy3yyVz2kfNEW8kJkuD0pw2', 'aaa', line_items)
                updateField('joK8xLy3yyVz2kfNEW8kJkuD0pw2', 'bbb', body.data.customer_details)
                updateField('joK8xLy3yyVz2kfNEW8kJkuD0pw2', 'ccc', body.data.shipping_details)
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
                        country: data.shipping_details.country,
                        region: data.shipping_details.state,
                        address1: data.shipping_details.line1,
                        address2: data.shipping_details.line2,
                        city: data.shipping_details.city,
                        zip: data.shipping_details.postal_code
                    }
                };

                await axios.post(base_url, body_data, options);
                res.status(200).json({ message: 'Checkout Session Complete!' });
            } catch (error) {
                console.error('Erro no manipulador de solicitação POST:', error);
                res.status(500).json({ message: 'Erro ao processar a solicitação.', error: error });
            }
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