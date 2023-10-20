import { isTokenValid } from "../../../auth";
import { getAllProducts } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {

        const result = await getAllProducts()

        res.status(200).json({
            products: result.products,
            msg: result.msg
        })
    }
}