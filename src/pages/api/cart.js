import { createCart, getCartById, updateCart } from "../../../backend/cart";

export default async function handler(req, res) {
    const { userId, cart, cartId } = req.body
    const { cart_id } = req.headers

    if (req.method === "GET") {
        const cart = await getCartById(cart_id)
        res.status(200).json({ cart: cart })
    }
    if (req.method === "POST") {
        const cartId = await createCart(userId, cart)
        res.status(201).json({ cartId: cartId })
    }
    else if (req.method === "PATCH") {
        await updateCart(cartId, cart)
        res.status(200).end()
    }
}