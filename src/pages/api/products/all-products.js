import { isTokenValid } from "../../../../utils/auth";
import { getAllProducts } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const result = await getAllProducts()

        res.status(result.status).json({
            products: result.products,
            message: result.message
        })
    }
}