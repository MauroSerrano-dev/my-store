import { isTokenValid } from "../../../utils/auth";
import { createNewUserWithCredentials, updateUser } from "../../../backend/user"

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const { user } = req.body
        try {
            const credentialResponse = await createNewUserWithCredentials(user)
            res.status(200).json(credentialResponse)
        }
        catch {
            res.status(500).json({ message: 'error_creating_user' })
        }
    }
    else if (req.method === "PATCH") {
        const { user_id, changes } = req.body
        const response = await updateUser(user_id, changes)
        res.status(response.status).json(response)
    }
}