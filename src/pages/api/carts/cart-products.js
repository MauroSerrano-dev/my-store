import { isTokenValid } from "@/utils/auth";
import { addProductsToCart } from "../../../../backend/cart";
import { addProductsToCartSession } from "../../../../backend/cart-session";
import { getProductsInfo } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization, user_id } = req.headers
    const { cartProducts, cartId } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "PATCH") {
        try {
            const cart = user_id
                ? await addProductsToCart(cartId, cartProducts)
                : await addProductsToCartSession(cartId, cartProducts)

            if (cart?.products) {
                const prodResponse = await getProductsInfo(cart.products)
                cart.products = prodResponse.products
            }
            res.status(200).json({ cart: cart })
        }
        catch (error) {
            res.status(400).json({ error: error })
        }
    }
}