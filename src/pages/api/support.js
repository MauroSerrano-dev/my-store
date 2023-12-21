import { isTokenValid } from "@/utils/auth";
import { getUserIdByEmail } from "../../../backend/user";
import { getOrderById } from "../../../backend/orders";
import { sendSupportEmail } from "../../../backend/email-sender";
const nodemailer = require('nodemailer')

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { option, fields, user_language } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        try {
            if (!fields.email)
                res.status(400).json({ error: 'missing_email' })
            if (!fields.problem_description)
                res.status(400).json({ error: 'missing_problem_description' })
            const userId = await getUserIdByEmail(fields.email)
            if (!userId)
                res.status(400).json({ error: 'invalid_email' })

            if (option === 'order_problem') {
                if (!fields.order_id)
                    res.status(400).json({ error: 'missing_order_id' })
                if (!fields.problem_description)
                    res.status(400).json({ error: 'missing_problem_description' })
                const orderData = await getOrderById(fields.order_id)
                if (!orderData)
                    res.status(400).json({ error: 'invalid_order_id' })
                if (orderData.user_id !== userId)
                    res.status(400).json({ error: 'invalid_order_for_this_user' })
                await sendSupportEmail(fields.email, 'Technical Assistance: Order Problem', fields.problem_description, user_language)
                res.status(200).json({ message: 'support_email_success' })
            }
            if (option === 'account_problem') {
                await sendSupportEmail(fields.email, 'Technical Assistance: Account Problem', fields.problem_description, user_language)
                res.status(200).json({ message: 'support_email_success' })
            }
            if (option === 'other') {
                if (!fields.subject)
                    res.status(400).json({ error: 'missing_subject' })
                if (!fields.problem_description)
                    res.status(400).json({ error: 'missing_problem_description' })
                await sendSupportEmail(fields.email, `Technical Assistance: ${fields.subject}`, fields.problem_description, user_language)
                res.status(200).json({ message: 'support_email_success' })
            }
        } catch {

        }
    }
}