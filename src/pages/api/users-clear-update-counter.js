import { isTokenValid } from "../../../auth"
import { clearUpdateCounter } from "../../../backend/user"

export default async function handler(req, res) {
    const { authorization } = req.headers.authorization

    await clearUpdateCounter(authorization)

    /* if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.CRON_SECRET))
        return res.status(401).json({ error: "Invalid authentication token." })

    const response = await clearUpdateCounter() */
    res.status(response.status).json(response)
}