import { clearUpdateCounter } from "../../../backend/user"

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization) {
        console.error("Authentication token not provided.")
        return res.status(401).json({ error: "Authentication token not provided." })
    }

    if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("Invalid authentication token.")
        return res.status(401).json({ error: "Invalid authentication token." })
    }

    const response = await clearUpdateCounter()
    res.status(response.status).json(response)
}