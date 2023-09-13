import { setUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const type = req.body.type
        if (type === 'checkout.session.completed') {
            /* const email = req.body.data.object.customer_details.email
            const planName = req.body.data.object.metadata.planName
            await setUserPlan(email, { name: planName, status: 'active' }) */
            res.status(200).json({ message: `Checkout Complete!` })
        }
        else if (type === 'checkout.session.async_payment_succeeded') {
        }
        else if (type === 'checkout.session.async_payment_failed') {
        }
        else if (type === 'checkout.session.expired') {
        }
        else
            res.status(200).json({ message: 'Outros eventos!' })
    }
}