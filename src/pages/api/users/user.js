import { isTokenValid } from "@/utils/auth";
import { createNewUser, deleteUser } from "../../../../backend/user";
import { addUserDeleted } from "../../../../backend/app-settings";

export default async function handler(req, res) {
    try {
        const { authorization, user_id } = req.headers
        const { authUser } = req.body

        if (!authorization)
            res.status(401).json({ message: "Invalid authentication" })

        if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
            res.status(401).json({ message: "Invalid authentication" })

        if (req.method === "POST") {
            const user = await createNewUser(authUser)
            res.status(201).json({ message: 'user_created', user: user })
        }
        else if (req.method === "DELETE") {
            const deletedUser = await deleteUser(user_id)
            await addUserDeleted(deletedUser.email)
            res.status(200).json({ message: 'user_deleted_successfully' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'default_error' })
    }
}