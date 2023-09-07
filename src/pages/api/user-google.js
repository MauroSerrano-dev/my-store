import { createNewUserWithGoogle } from "../../../backend/user"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user, id } = req.body
        const sessionToken = await createNewUserWithGoogle(user, id)
        res.status(201).json({ sessionToken: sessionToken })
    }
}