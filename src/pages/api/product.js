import { isTokenValid } from "@/utils/auth";
import { getProductById, createProduct, updateProduct, getDisabledProductById } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization, id } = req.headers
    const { product, product_id, product_new_fields } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const result = await getProductById(id)
        res.status(result.status).json(result)
    }
    else if (req.method === "POST") {
        const result = await createProduct(product)

        res.status(result.status).json({
            status: result.status,
            msg: result.msg,
        })
    }
    else if (req.method === "PATCH") {
        try {
            const result = await updateProduct(product_id, product_new_fields)

            res.status(200).json({ status: 200, msg: result.message })
        }
        catch (error) {
            res.status(error?.props?.statusCode || 500).json({ status: error?.props?.statusCode || 500, msg: 'default_error' })
        }
    }
}