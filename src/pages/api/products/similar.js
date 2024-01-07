import { isTokenValid } from '@/utils/auth'
import { getSimilarProducts } from '../../../../backend/product'

export default async function handler(req, res) {
    const {
        authorization,
        product_id,
        limit,
    } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === 'GET') {
        try {
            const products = await getSimilarProducts(product_id, limit)
            console.log('Similar products retrieved successfully!')
            res.status(200).json({ data: products })
        } catch (error) {
            console.error(`Error in products similar GET: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'default_error' })
        }
    }
}