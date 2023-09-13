import { getProductsByQueries, getProductsByTitle } from "../../../backend/product";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const {
            s,
            t,
            c,
            page,
            min,
            max,
            order,
            limit,
            l,
        } = req.headers

        const result = await getProductsByQueries({
            s: s,
            t: t,
            c: c,
            page: page,
            min: min,
            max: max,
            order: order,
            itemsPerPage: limit,
            userLanguage: l,
        })

        res.status(201).json(result)
    }
}