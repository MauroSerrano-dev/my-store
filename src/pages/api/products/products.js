import { isTokenValid } from "@/utils/auth";
import { getProductsByIds } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization, products_ids } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const result = await getProductsByIds(products_ids)

        res.status(result.status).json(result)
    }
}