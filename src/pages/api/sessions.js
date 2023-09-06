import { getSession, deleteSession } from "../../../backend/sessions";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { session_token } = req.headers

        const result = await getSession(session_token)

        res.status(200).json(result)
    }
    if (req.method === "DELETE") {
        const { session_token } = req.headers

        const result = await deleteSession(session_token)

        res.status(200).json(result)
    }
}