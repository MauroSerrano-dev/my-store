import { isTokenValid } from "../../../auth"
import { clearUpdateCounter } from "../../../backend/user"

export default async function handler(req, res) {
    /* const { authorization } = req.headers.authorization */
    const authToken = (req.headers.get('authorization') || '')
        .split('Bearer ')
        .at(1)
    await clearUpdateCounter(authToken)

    /* if (!authorization)
        return res.status(401).json({ error: "Authentication token not provided." })

    if (!isTokenValid(authorization, process.env.CRON_SECRET))
        return res.status(401).json({ error: "Invalid authentication token." })

    const response = await clearUpdateCounter()
    res.status(response.status).json(response) */
    res.status(200).json({})
}