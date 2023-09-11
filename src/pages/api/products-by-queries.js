import { getProductsByQueries } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const {
            c,
            s,
            t,
            page,
            min,
            max
        } = req.headers
        
        const result = await getProductsByQueries({
            c: c,
            s: s,
            t: t,
            page: page,
            min: min,
            max: max
        })

        res.status(201).json(result)
    }
}