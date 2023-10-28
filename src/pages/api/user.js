import { isTokenValid } from "../../../auth";
import { createNewUserWithCredentials, updateUser } from "../../../backend/user"

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    if (req.method === "POST") {
        const { user } = req.body
        const userData = await createNewUserWithCredentials(user)
        res.status(201).json({ user: userData })
    }
    else if (req.method === "PATCH") {
        const { user_id, changes } = req.body
        const response = await updateUser(user_id, changes)
        res.status(response.status).json(response)
    }
}