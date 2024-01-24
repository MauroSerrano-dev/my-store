import { isTokenValid } from "@/utils/auth";
import { getOrderLimitInfoById } from "../../../../backend/orders";
import MyError from "@/classes/MyError";

export default async function handler(req, res) {
    const { authorization, order_id } = req.headers

    if (!authorization)
        res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const order = await getOrderLimitInfoById(order_id)
            res.status(200).json({ data: order })
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
}