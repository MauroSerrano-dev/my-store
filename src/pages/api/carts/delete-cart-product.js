import { isTokenValid } from "../../../../auth";
import { deleteProductFromCart } from "../../../../backend/cart";
import { deleteProductFromCartSession } from "../../../../backend/cart-session";
import { getCartProductsInfo } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization, user_id } = req.headers
    const { product, cartId } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const response = user_id
            ? await deleteProductFromCart(cartId, product)
            : await deleteProductFromCartSession(cartId, product)
        if (response.cart?.products) {
            const prodResponse = await getCartProductsInfo(response.cart.products)
            response.cart.products = prodResponse.products
        }
        res.status(response.status).json(response)
    }
}