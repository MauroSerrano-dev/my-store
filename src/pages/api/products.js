import { getAllProducts } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {

        const result = await getAllProducts()

        res.status(200).json({
            products: result.products,
            msg: result.msg
        })
    }
}