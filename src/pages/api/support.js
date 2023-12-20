import { isTokenValid } from "@/utils/auth";
import { getUserIdByEmail } from "../../../backend/user";
import { getOrderById } from "../../../backend/orders";

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { option, fields } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        if (option === 'order_problem') {
            if (!fields.order_id)
                res.status(400).json({ error: 'missing_order_id' })
            if (!fields.problem_description)
                res.status(400).json({ error: 'missing_problem_description' })
            const orderData = await getOrderById(fields.order_id)
            if (!orderData)
                res.status(400).json({ error: 'invalid_order_id' })
            res.status(200).json({ message: 'deu bom' })
        }
        if (option === 'account_problem') {
            if (!fields.email)
                res.status(400).json({ error: 'missing_email' })
            if (!fields.problem_description)
                res.status(400).json({ error: 'missing_problem_description' })
            const userId = await getUserIdByEmail(fields.email)
            if (!userId)
                res.status(400).json({ error: 'invalid_email' })
            res.status(200).json({ message: 'deu bom' })
        }
        if (option === 'other') {
            if (!fields.subject)
                res.status(400).json({ error: 'missing_subject' })
            if (!fields.problem_description)
                res.status(400).json({ error: 'missing_problem_description' })
            res.status(200).json({ message: 'deu bom' })
        }
    }

}