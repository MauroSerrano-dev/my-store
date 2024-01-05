import { isTokenValid } from '@/utils/auth'
import { getProductsAnalytics } from '../../../backend/product'
import { getAppSettings } from '../../../backend/app-settings'

export default async function handler(req, res) {
    const {
        authorization,
    } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === 'GET') {
        try {
            const prods_data = await getProductsAnalytics()
            const app_data = await getAppSettings()
            console.log('Dashboard retrieved successfully!')
            res.status(200).json({ prods_data: prods_data, app_data: app_data })
        } catch (error) {
            console.error(`Error in api/dashboard GET: ${error?.props?.title || error}`)
            res.status(error?.props?.statusCode || 500).json({ error: error?.props?.title || 'default_error' })
        }
    }
}