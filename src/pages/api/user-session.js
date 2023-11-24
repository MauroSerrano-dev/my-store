import { isTokenValid } from "../../../utils/auth";
import { mergeCarts } from "../../../backend/cart";
import { updateField, createNewUserWithGoogle, getUserById } from "../../../backend/user";
import { getWishlistById } from "../../../backend/wishlists";
import { DEFAULT_PRODUCTS_TAGS } from "../../../consts";

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
            const fullName = authUser.displayName.split(' ')

            const firstName = fullName.length <= 1 ? null : fullName.slice(0, fullName.length - 1).join(' ')
            const lastName = fullName.length <= 1 ? authUser.displayName : fullName[fullName.length - 1]

            const new_user = {
                email: authUser.email,
                first_name: firstName,
                last_name: lastName,
                email_verified: authUser.emailVerified,
                home_page_tags: DEFAULT_PRODUCTS_TAGS,
            }

            const newUser = await createNewUserWithGoogle(new_user, uid, cart_cookie_id)
            res.status(200).json({
                ...newUser,
                id: uid
            })
        }
    }
}