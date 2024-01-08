import { isTokenValid } from "@/utils/auth";
import { getAllProducts, getProductsByQueries } from "../../../backend/product";
import { SEARCH_PRODUCT_COLORS, SEARCH_ART_COLORS, DEFAULT_LANGUAGE } from "@/consts";
import LANGUAGES from '../../../public/locales/en/languages.json'

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        const {
            i, //id
            s, //search
            t, //tags
            h, //theme
            y, //type
            v, //family
            c, //collection
            cl, //product color
            ac, //art color
            p, //número da página
            all, //call all products
            min, //preço mínimo
            max, //preço máximo
            order,
            limit,
            user_language,
            join_disabled,
        } = req.headers

        let response

        if (all || (!i && !s && !t && !h && !v && !c && !cl && !ac && !min && !max && !y)) {
            response = await getAllProducts({
                order: order,
                prods_limit: limit,
                p: p
            })
        }
        else {
            response = await getProductsByQueries({
                i: i,
                s: s,
                t: t,
                h: h,
                y: y,
                v: v,
                c: c,
                cl: SEARCH_PRODUCT_COLORS.find(color => color.color_display.id_string === cl),
                ac: SEARCH_ART_COLORS.find(color => color.color_display.id_string === ac),
                p: p,
                min: min,
                max: max,
                order: order,
                prods_limit: limit,
                join_disabled: join_disabled,
                user_language: Object.keys(LANGUAGES).includes(user_language) ? user_language : DEFAULT_LANGUAGE,
            })
        }

        res.status(response.status).json(response)
    }
}