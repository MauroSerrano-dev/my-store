import { isTokenValid } from "@/utils/auth";
import { getProductsByIds } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization, products_ids } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const products = await getProductsByIds(products_ids)
            res.status(200).json(products)
        }
        catch {
            res.status(500).json({ error: 'default_error' })
        }
    }
}