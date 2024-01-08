import { cleanPopularityMonth } from '../../../../backend/product'

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization) {
        console.error("Invalid authentication")
        return res.status(401).json({ error: "Invalid authentication" })
    }

    if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("Invalid authentication")
        return res.status(401).json({ error: "Invalid authentication" })
    }

    await cleanPopularityMonth()

    res.status(200).json({ message: 'Monthly cron run successfully!' })
}