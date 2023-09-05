import { createNewUser } from "../../../backend/user"

export default async function handler(req, res) {
    if (req.method === "GET") {
    }
    else if (req.method === "POST") {
        const { user } = req.body
        const sessionID = await createNewUser(user)
        res.status(201).json({ sessionID: sessionID })
    }
}