import { getProductsByTitle } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { s } = req.headers

        const result = await getProductsByTitle(s)

        res.status(201).json(result)
    }
}