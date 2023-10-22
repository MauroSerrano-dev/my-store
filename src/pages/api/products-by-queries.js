import { isTokenValid } from "../../../auth";
import { getProductsByQueries } from "../../../backend/product";
import { ART_COLORS, SEARCH_PRODUCTS_COLORS } from "../../../consts";

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
            h,
            p,
            c,
            cl,
            ac,
            page,
            min,
            max,
            order,
            limit,
            l,
        } = req.headers

        const response = await getProductsByQueries({
            s: s,
            t: t,
            h: h,
            p: p,
            c: c,
            cl: SEARCH_PRODUCTS_COLORS.find(color => color.title.toLowerCase() === cl)?.id,
            ac: ART_COLORS.find(color => color.title.toLowerCase() === ac)?.id,
            page: page,
            min: min,
            max: max,
            order: order,
            prods_limit: limit,
            user_language: l,
        })

        res.status(response.status).json(response)
    }
}