import { createNewUserWithGoogle } from "../../../backend/user"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user } = req.body
        const sessionID = await createNewUserWithGoogle(user)
        res.status(201).json({ sessionID: sessionID })
    }
}