import { isTokenValid } from "../../../auth";
import { createCartSession, getCartSessionById, updateCartSessionProducts } from "../../../backend/cart-session";
import { getCartProductsInfo } from "../../../backend/product";

export default async function handler(req, res) {
    const { cartId, cartProducts } = req.body
    const { cart_id, authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const cart = await getCartSessionById(cart_id)
        const prodResponse = await getCartProductsInfo(cart.products)

        res.status(200).json(
            {
                ...cart,
                products: prodResponse.products,
            }
        )
    }
    if (req.method === "POST") {
        const cartId = await createCartSession(cartProducts)
        res.status(201).json({ cart_id: cartId })
    }
    else if (req.method === "PATCH") {
        await updateCartSessionProducts(cartId, cartProducts)
        res.status(200).end()
    }
}