import { isTokenValid } from "../../../auth";
import { getProductsByTitle } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const { s } = req.headers
        const result = await getProductsByTitle(s)
        
        res.status(201).json(result)
    }
}