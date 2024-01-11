import { isTokenValid } from '@/utils/auth'
import { fetchFilteredPrintifyProducts } from '../../../../backend/printify'

export default async function handler(req, res) {
    const {
        authorization,
        provider_id,
        blueprint_id,
        limit,
        page
    } = req.headers

    if (!authorization)
        res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        res.status(401).json({ error: "Invalid authentication" })

    if (req.method === 'GET') {
        try {
            const response = await fetchFilteredPrintifyProducts(Number(provider_id), Number(blueprint_id), limit, page)
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in printify products GET:', error)
            res.status(500).json({ error: 'default_error' })
        }
    }
}