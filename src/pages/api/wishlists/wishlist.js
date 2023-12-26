import { isTokenValid } from "@/utils/auth";
import { getProductsByIds } from "../../../../backend/product";
import { getWishlistById } from "../../../../backend/wishlists";

export default async function handler(req, res) {
    const { wishlist_id, authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        try {
            const wishlist = await getWishlistById(wishlist_id)

            const products = wishlist ? await getProductsByIds(wishlist.products.map(prod => prod.id)) : null

            if (wishlist)
                wishlist.products = products

            res.status(200).json(wishlist)
        }
        catch {
            res.status(500).json({ error: 'default_error' })
        }
    }
}