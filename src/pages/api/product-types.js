import { isTokenValid } from "../../../auth";
import { getAllProductsTypes } from "../../../backend/product-types";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const response = await getAllProductsTypes()

        res.status(response.status).json({
            product_types: response.product_types,
            message: response.message
        })
    }
}