import { createNewUserWithGoogle, getUserById } from "../../../backend/user";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { uid, new_user } = req.headers
        
        console.log('api', JSON.parse(new_user), uid)

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