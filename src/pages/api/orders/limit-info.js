import { isTokenValid } from "@/utils/auth";
import { getOrderLimitInfoById } from "../../../../backend/orders";

export default async function handler(req, res) {
    const { authorization, order_id } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const order = await getOrderLimitInfoById(order_id)

            if (order)
                res.status(200).json({ data: order })
            else
                res.status(404).json({ error: 'order_not_found', data: null })
        }
        catch (error) {
            res.status(500).json({ error: 'default_error', data: null });
        }
    }
}