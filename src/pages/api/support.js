import { isTokenValid } from "@/utils/auth";
import { getUserIdByEmail } from "../../../backend/user";
import { getOrderById } from "../../../backend/orders";
import { sendSupportEmail } from "../../../backend/email-sender";

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { option, fields, user_language } = req.body

    if (!authorization)
        res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "POST") {
        try {
            if (!fields.email)
                res.status(400).json({ error: 'missing_email' })
            if (!fields.problem_description)
                res.status(400).json({ error: 'missing_problem_description' })

            if (option === 'order_problem') {
                if (!fields.order_id)
                    res.status(400).json({ error: 'missing_order_id' })
                if (!fields.problem_description)
                    res.status(400).json({ error: 'missing_problem_description' })
                const orderData = await getOrderById(fields.order_id)
                if (!orderData)
                    res.status(400).json({ error: 'invalid_order_id' })
                if (orderData.user_email !== fields.email)
                    res.status(400).json({ error: 'invalid_order_id_for_this_user' })
                await sendSupportEmail(
                    {
                        customer_email: fields.email,
                        subject: option,
                        customer_problem_description: fields.problem_description,
                        user_language: user_language,
                        order_id: fields.order_id
                    }
                )
                res.status(200).json({ message: 'support_email_sent' })
            }
            if (option === 'account_problem') {
                const userId = await getUserIdByEmail(fields.email)
                if (!userId)
                    res.status(400).json({ error: 'invalid_email' })
                await sendSupportEmail(
                    {
                        customer_email: fields.email,
                        subject: option,
                        customer_problem_description: fields.problem_description,
                        user_language: user_language,
                    }
                )
                res.status(200).json({ message: 'support_email_sent' })
            }
            if (option === 'report_bug') {
                if (!fields.problem_description)
                    res.status(400).json({ error: 'missing_problem_description' })
                await sendSupportEmail(
                    {
                        customer_email: fields.email,
                        subject: option,
                        customer_problem_description: fields.problem_description,
                        user_language: user_language,
                    }
                )
                res.status(200).json({ message: 'support_email_sent' })
            }
            if (option === 'other') {
                if (!fields.subject)
                    res.status(400).json({ error: 'missing_subject' })
                if (!fields.problem_description)
                    res.status(400).json({ error: 'missing_problem_description' })
                await sendSupportEmail(
                    {
                        customer_email: fields.email,
                        subject: option,
                        customer_problem_description: fields.problem_description,
                        user_language: user_language,
                        custom_subject: fields.subject,
                    }
                )
                res.status(200).json({ message: 'support_email_sent' })
            }
        } catch {
            res.status(500).json({ error: 'default_error' })
        }
    }
}