import { getProductsByCategory } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const {
            category
        } = req.headers

        let result

        if (category) {
            result = await getProductsByCategory(category)
        }

        res.status(201).json({
            products: result.products,
            msg: result.msg
        })
    }
}