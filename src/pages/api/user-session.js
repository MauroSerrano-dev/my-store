import { createNewUserWithGoogle, getUserById } from "../../../backend/user";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { uid, new_user } = req.body
        
        const user = await getUserById(uid)

        if (user) {
            res.status(200).json({
                ...user,
                id: uid
            })
        }
        else {
            const newUser = await createNewUserWithGoogle(new_user, uid)
            res.status(200).json({
                ...newUser,
                id: uid
            })
        }
    }
}