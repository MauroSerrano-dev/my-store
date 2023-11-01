import { isTokenValid } from "../../../auth";
import { getOrdersByUserId } from "../../../backend/orders";

export default async function handler(req, res) {
    const { authorization, user_id, start_date, end_date } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const result = await getOrdersByUserId(user_id, start_date, end_date)
        res.status(result.status).json(result)
    }
}