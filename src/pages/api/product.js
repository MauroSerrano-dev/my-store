import { createProduct } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { product } = req.body
        const result = await createProduct(product);
        res.status(201).json({
            msg: result.msg
        })
    }
}