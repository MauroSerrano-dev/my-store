import { getSession } from "../../../backend/sessions";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { session_token } = req.headers

        const result = await getSession(session_token)

        res.status(200).json(result)
    }
}