import { isTokenValid } from "../../../auth";
import { getAllProducts, getProductsByQueries } from "../../../backend/product";
import { SEARCH_COLORS } from "../../../consts";

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
            v,
            c,
            cl,
            ac,
            p,
            min,
            max,
            order,
            limit,
            l,
        } = req.headers

        let response

        if (!s && !t && !h && !v && !c && !cl && !ac && !min && !max) {
            response = await getAllProducts({
                order: order,
                prods_limit: limit,
                p: p
            })
        }
        else {
            response = await getProductsByQueries({
                s: s,
                t: t,
                h: h,
                v: v,
                c: c,
                cl: SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === cl),
                ac: SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === ac),
                p: p,
                min: min,
                max: max,
                order: order,
                prods_limit: limit,
                user_language: l,
            })
        }

        res.status(response.status).json(response)
    }
}