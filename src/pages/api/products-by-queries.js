import { getProductsByQueries, getProductsByTitle } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const {
            s,
            t,
            page,
            min,
            max,
            order,
            limit
        } = req.headers
        const result = await getProductsByQueries({
            s: s,
            t: t,
            page: page,
            min: min,
            max: max,
            order: order,
            itemsPerPage: limit,
        })

        res.status(201).json(result)
    }
}