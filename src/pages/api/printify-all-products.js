import axios from 'axios'
import { isTokenValid } from '../../../utils/auth'

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === 'GET') {
        const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`

        const headers = {
            Authorization: process.env.PRINTIFY_ACCESS_TOKEN
        }

        try {
            const response = await axios.get(base_url, { headers })

            const data = response.data
            res.status(200).json(data)
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: 'Error getting products from Printify' })
        }
    }
}