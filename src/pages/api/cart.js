import { isTokenValid } from "../../../auth";
import { createCart, getCartById, updateCart } from "../../../backend/cart";
import { getCartProductsInfo } from "../../../backend/product";

export default async function handler(req, res) {
    const { userId, cartProducts, cartId } = req.body
    const { cart_id, authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const cart = await getCartById(cart_id)
        
        const prodResponse = await getCartProductsInfo(cart.products)

        res.status(200).json(
            {
                ...cart,
                products: prodResponse.products,
            }
        )
    }
    if (req.method === "POST") {
        const cartId = await createCart(userId, cartProducts)
        res.status(201).json({ cartId: cartId })
    }
    else if (req.method === "PATCH") {
        await updateCart(cartId, cartProducts)
        res.status(200).end()
    }
}