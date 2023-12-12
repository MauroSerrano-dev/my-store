import { isTokenValid } from "@/utils/auth";
import { getOrderById } from "../../../backend/orders";
import { getProductsInfo } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization, order_id } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        try {
            const order = await getOrderById(order_id)

            if (order) {
                const productsRes = await getProductsInfo(order.products)
                res.status(200).json({
                    data: {
                        ...order,
                        products: productsRes.products
                    }
                })
            }
            else
                res.status(404).json({ data: null })
        }
        catch (error) {
            res.status(500).json({ error: "Error retrieving order", data: null });
        }
    }
}