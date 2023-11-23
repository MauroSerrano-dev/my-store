import { isTokenValid } from "../../../../utils/auth";
import { getProductsByIds } from "../../../../backend/product";
import { addProductToWishlist, deleteProductFromWishlist } from "../../../../backend/wishlists";

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { wishlist_id, product } = req.body

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const response = await addProductToWishlist(wishlist_id, product)

        if (response.status === 200) {
            const prodResponse = await getProductsByIds(response.wishlist.products.map(prod => prod.id))
            response.wishlist.products = prodResponse.products
        }
        res.status(response.status).json(response)
    }
    else if (req.method === "DELETE") {
        const response = await deleteProductFromWishlist(wishlist_id, product)

        if (response.status === 200) {
            const prodResponse = await getProductsByIds(response.wishlist.products.map(prod => prod.id))
            response.wishlist.products = prodResponse.products
        }
        res.status(response.status).json(response)
    }
}