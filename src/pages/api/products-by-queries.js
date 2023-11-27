import { isTokenValid } from "@/utils/auth";
import { getAllProducts, getProductsByQueries } from "../../../backend/product";
import { SEARCH_PRODUCT_COLORS, SEARCH_ART_COLORS } from "@/consts";
import LANGUAGES from '../../../public/locales/en/languages.json'

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

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
            user_language,
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
                cl: SEARCH_PRODUCT_COLORS.find(color => color.color_display.id_string === cl),
                ac: SEARCH_ART_COLORS.find(color => color.color_display.id_string === ac),
                p: p,
                min: min,
                max: max,
                order: order,
                prods_limit: limit,
                user_language: Object.keys(LANGUAGES).includes(user_language) ? user_language : 'en',
            })
        }

        res.status(response.status).json(response)
    }
}