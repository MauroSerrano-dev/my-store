import { isTokenValid } from "../../../auth";
import { getProductsByQueries } from "../../../backend/product";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "GET") {
        const {
            s,
            t,
            p,
            c,
            cl,
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
            p: p,
            c: c,
            cl: cl,
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