import { isTokenValid } from '@/utils/auth'
import { getProductFromPrintify } from '../../../../backend/printify'

export default async function handler(req, res) {
    const {
        authorization,
        prod_printify_id,
    } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === 'GET') {
        try {
            const product = await getProductFromPrintify(prod_printify_id)
            res.status(200).json({ data: product })
        } catch (error) {
            console.error(`Error in printify product GET: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'default_error' })
        }
    }
}