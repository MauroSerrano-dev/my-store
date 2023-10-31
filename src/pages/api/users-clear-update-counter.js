import { isTokenValid } from "../../../auth";
import { clearUpdateCounter } from "../../../backend/user"

export default async function handler(req, res) {
    if (!process.env.NEXT_PUBLIC_APP_TOKEN)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(process.env.NEXT_PUBLIC_APP_TOKEN, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication token." })

    const response = await clearUpdateCounter()
    res.status(response.status).json(response)
}