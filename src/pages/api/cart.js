import { setUserCart } from "../../../backend/cart";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, cart } = req.body
        await setUserCart(userId, cart)
        res.status(201).end()
    }
}