import { isTokenValid } from "@/utils/auth";
import { createNewUserWithGoogle, getUserById } from "../../../backend/user";
import { getWishlistById } from "../../../backend/wishlists";
import { mergeCarts } from "../../../backend/cart";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const { uid, authUser, cart_cookie_id } = req.body

        const user = await getUserById(uid)

        if (user) {
            if (cart_cookie_id) {
                await mergeCarts(uid, cart_cookie_id)
            }

            const wishlist = await getWishlistById(user.wishlist_id)

            res.status(200).json({
                ...user,
                wishlist_products_ids: wishlist.products.map(prod => prod.id),
                id: uid
            })
        }
        else {
            const newUser = await createNewUserWithGoogle(authUser, uid, cart_cookie_id)
            res.status(200).json({
                ...newUser,
                wishlist_products_ids: [],
                id: uid
            })
        }
    }
}