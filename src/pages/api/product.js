import { isTokenValid } from "@/utils/auth";
import { getProductById, createProduct, updateProduct } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization, id } = req.headers
    const { product, product_id, new_product } = req.body

    if (!authorization)
        res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const product = await getProductById(id)
            res.status(200).json(product)
        }
        catch (error) {
            console.error('Error in product GET:', error)
            res.status(500).json({ error: 'default_error' })
        }
    }
    else if (req.method === "POST") {
        const result = await createProduct(product)

        res.status(result.status).json({
            status: result.status,
            msg: result.msg,
        })
    }
    else if (req.method === "PUT") {
        try {
            const result = await updateProduct(product_id, new_product)

            res.status(200).json({ message: result.message })
        }
        catch (error) {
            console.error('Error in product PATCH:', error)
            res.status(500).json({ error: 'default_error' })
        }
    }
}