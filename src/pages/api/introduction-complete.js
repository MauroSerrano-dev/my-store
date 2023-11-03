import { isTokenValid } from "../../../auth";
import { updateField } from "../../../backend/user";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        const { id } = req.body

        await updateField(id, 'introduction_complete', true)
        res.status(200).json({ message: `${id} Introduction Complete` })
    }
}