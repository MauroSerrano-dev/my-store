import { isTokenValid } from "../../../auth";
import { getProductById, createProduct, updateProduct } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const { id } = req.headers
        const result = await getProductById(id)
        res.status(200).json(result)
    }
    else if (req.method === "POST") {
        const { product } = req.body
        const result = await createProduct(product)

        res.status(result.status).json({
            status: result.status,
            msg: result.msg,
        })
    }
    else if (req.method === "PATCH") {
        const { product_id, product_new_fields } = req.body

        const result = await updateProduct(product_id, product_new_fields)

        res.status(result.status).json({
            status: result.status,
            msg: result.msg,
        })
    }
}