import { isTokenValid } from "@/utils/auth";
import { createNewUserWithCredentials, deleteUser, updateUser } from "../../../backend/user"
import { emailIsProhibited } from "../../../backend/app-settings";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const { user, userLanguage } = req.body
        try {
            const isProhibited = await emailIsProhibited(user.email)
            if (isProhibited)
                return res.status(400).json({ status: 400, message: 'account_with_this_email_recently_deleted' })
            await createNewUserWithCredentials(user, userLanguage)
            res.status(201).json({ status: 201, message: 'user_created' })
        }
        catch (error) {
            if (error.code === 'auth/invalid-email')
                return res.status(400).json({ status: 400, message: 'invalid_email' })
            if (error.code === 'auth/email-already-in-use')
                return res.status(400).json({ status: 400, message: 'email_already_exists' })
            if (error.code === 'auth/weak-password')
                return res.status(400).json({ status: 400, message: 'weak_password' })
            if (error.code === 'auth/account-exists-with-different-credential')
                return res.status(400).json({ status: 400, message: 'account_exists_with_different_credential' })
            return res.status(500).json({ status: 500, message: 'error_creating_user' })
        }
    }
    else if (req.method === "PATCH") {
        const { user_id, changes } = req.body
        const response = await updateUser(user_id, changes)
        res.status(response.status).json(response)
    }
    else if (req.method === "DELETE") {
        const { user_id } = req.headers
        try {
            await deleteUser(user_id)
            res.status(200).json({ message: 'user_deleted_successfully' })
        }
        catch {
            res.status(500).json({ error: 'default_error' })
        }
    }
}