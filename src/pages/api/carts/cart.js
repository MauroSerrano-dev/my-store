import { isTokenValid } from "../../../../utils/auth";
import { getCartById } from "../../../../backend/cart";
import { getCartSessionById } from "../../../../backend/cart-session";
import { getCartProductsInfo } from "../../../../backend/product";

export default async function handler(req, res) {
    const { user_id, cart_id, authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {

        const cart = user_id
            ? await getCartById(cart_id)
            : await getCartSessionById(cart_id)

        const prodResponse = await getCartProductsInfo(cart.products)

        cart.products = prodResponse.products

        res.status(200).json(cart)
    }
}