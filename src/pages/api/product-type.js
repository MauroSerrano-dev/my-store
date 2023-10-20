import { isTokenValid } from "../../../auth";
import { createTypeOfProduct, getProductType } from "../../../backend/product-types";
import { TYPES_POOL } from "../../../consts";

export default async function handler(req, res) {
    const { authorization, type_id } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Token de autenticação não fornecido." });

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Token de autenticação inválido." })

    if (req.method === "GET") {
        const response = await getProductType(type_id)

        res.status(response.status).json({
            product_type: response.product_type,
            message: response.message
        })
    }
    else if (req.method === "POST") {
        const response = await createTypeOfProduct(TYPES_POOL[0])
        res.status(response.status).json({ messsage: response.message })
    }
}