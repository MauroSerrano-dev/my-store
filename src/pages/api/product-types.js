import { isTokenValid } from "../../../auth";
import { getAllProductsTypes } from "../../../backend/product-types";

export default async function handler(req, res) {
    const token = req.headers.authorization

    if (!token)
        return res.status(401).json({ error: "Token de autenticação não fornecido." });

    if (!isTokenValid(token, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Token de autenticação inválido." })

    if (req.method === "GET") {
        const response = await getAllProductsTypes()

        res.status(response.status).json({
            product_types: response.product_types,
            message: response.message
        })
    }
}