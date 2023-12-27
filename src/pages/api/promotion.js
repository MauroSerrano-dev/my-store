import { isTokenValid } from "@/utils/auth"
import { createPromotionForProducts } from "../../../backend/product"

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { products_ids, promotion } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        try {
            await createPromotionForProducts(products_ids, promotion)
            res.status(200).json({ message: promotion.percentage === 0 ? 'promotion_deleted_successfully' : 'promotion_create_successfully' })
        } catch (error) {
            console.error(`Error in promotion POST: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'default_error' })
        }
    }
}