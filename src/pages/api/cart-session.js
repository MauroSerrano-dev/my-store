import { createCartSession, getCartSessionById, updateCartSessionProducts } from "../../../backend/cart-session";

export default async function handler(req, res) {
    const { cartId, cart } = req.body
    const { cart_id } = req.headers

    if (req.method === "GET") {
        const cart = await getCartSessionById(cart_id)
        res.status(200).json({ cart: cart })
    }
    if (req.method === "POST") {
        const cartId = await createCartSession(cart)
        res.status(201).json({ cart_id: cartId })
    }
    else if (req.method === "PATCH") {
        await updateCartSessionProducts(cartId, cart)
        res.status(200).end()
    }
}