import { isTokenValid } from "@/utils/auth";
import { getProductsByIds } from "../../../backend/product";
import { PRODUCTS_TYPES } from "@/consts";

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { products_ids, promotion } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        try {
            const products = await getProductsByIds(products_ids)
            if (
                products.some(product => {
                    const type = PRODUCTS_TYPES.find(type => type.id === product.type_id)
                    const variants = product.variants.map(variant => ({ ...variant, cost: type.variants.find(vari => vari.id === variant.id).cost }))
                    return variants.some(vari => vari.cost + 4 >= vari.price * (1 - promotion.percentage))
                })
            )
                res.status(400).json({ error: 'Invalid Promotion Percentage' })
            if (new Date(promotion.expire_at).getTime() - new Date().getTime() <= 18 * 60 * 60 * 1000)
                res.status(400).json({ error: 'Invalid Promotion Expire Date' })
            res.status(200).json({ message: 'deu bom' })
        } catch (error) {
            console.error(`Error in promotion POST: ${error}`)
            res.status(500).json({ error: 'default_error' })
        }
    }
}