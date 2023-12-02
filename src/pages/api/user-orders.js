import { isTokenValid } from "@/utils/auth";
import { getOrdersByUserId } from "../../../backend/orders";
import { getProductsInfo } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization, user_id, start_date, end_date } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const response = await getOrdersByUserId(user_id, start_date, end_date)
        const productsInfoRes = await getProductsInfo(response.orders.reduce((acc, order) => [...acc, ...order.products], []))

        res.status(response.status).json({ ...response, orders: response.orders.map((order, i) => ({ ...order, products: order.products.map(() => productsInfoRes.products.shift()) })) })
    }
}