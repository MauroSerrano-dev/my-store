import { getProductsByQueries } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const {
            s,
            t,
            page,
            min,
            max,
            order
        } = req.headers

        const result = await getProductsByQueries({
            s, s,
            t: t,
            page: page,
            min: min,
            max: max,
            order: order,
        })

        res.status(201).json(result)
    }
}