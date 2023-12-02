import { isTokenValid } from "@/utils/auth";
import { changeProductField } from "../../../../backend/cart";
import { getProductsInfo } from "../../../../backend/product";

export default async function handler(req, res) {
    const { authorization, user_id } = req.headers
    const { product, cartId, newQuantity } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "PUT") {
        const response = await changeProductField(user_id ? process.env.COLL_CARTS : process.env.COLL_CARTS_SESSION, cartId, product, 'quantity', newQuantity)
        if (response.cart?.products) {
            const prodResponse = await getProductsInfo(response.cart.products)
            response.cart.products = prodResponse.products
        }
        res.status(response.status).json(response)
    }
}