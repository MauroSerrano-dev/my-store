import { isTokenValid } from "@/utils/auth";
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
        try {
            const wishlist = await addProductToWishlist(wishlist_id, product)

            const products = await getProductsByIds(wishlist.products.map(prod => prod.id))
            wishlist.products = products

            res.status(200).json({ data: wishlist })
        } catch (error) {
            console.error(`Error in /api/wishlists/wishlist-products POST: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'error_adding_product_to_wishlist' })
        }
    }
    else if (req.method === "DELETE") {
        try {
            const wishlist = await deleteProductFromWishlist(wishlist_id, product)

            const products = await getProductsByIds(wishlist.products.map(prod => prod.id))
            wishlist.products = products

            res.status(200).json({ data: wishlist })
        } catch (error) {
            console.error(`Error in /api/wishlists/wishlist-products DELETE: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'error_removing_product_from_wishlist' })
        }
    }
}