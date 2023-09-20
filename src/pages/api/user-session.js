import { mergeCarts } from "../../../backend/cart";
import { updateField, createNewUserWithGoogle, getUserById } from "../../../backend/user";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { uid, new_user, providers, cart_cookie_id } = req.body

        const user = await getUserById(uid)

        if (user) {
            if (cart_cookie_id) {
                await mergeCarts(uid, cart_cookie_id)
            }
            const updateUser = await updateField(uid, 'providers', providers)
            res.status(200).json({
                ...updateUser,
                id: uid
            })
        }
        else {
            const newUser = await createNewUserWithGoogle(new_user, uid, cart_cookie_id)
            res.status(200).json({
                ...newUser,
                id: uid
            })
        }
    }
}