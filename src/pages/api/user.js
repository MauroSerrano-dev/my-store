import { createNewUserWithCredentials } from "../../../backend/user"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user } = req.body
        const userData = await createNewUserWithCredentials(user)
        res.status(201).json({ user: userData })
    }
}