import { isTokenValid } from "../../../auth";
import { getProductsByCategory } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const {
            category
        } = req.headers

        let result

        if (category) {
            result = await getProductsByCategory(category)
        }

        res.status(201).json(result)
    }
}