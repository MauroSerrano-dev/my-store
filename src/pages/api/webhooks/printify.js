import axios from 'axios'
import { updateProductStatus, updateOrderField } from "../../../../backend/orders"
const CryptoJS = require('crypto-js')

export default async function handler(req, res) {
    try {
        const calculatedSignature = CryptoJS.HmacSHA256(JSON.stringify(req.body), process.env.PRINTIFY_WEBHOOK_SECRET).toString(CryptoJS.enc.Hex)

        const providedSignatureWithoutPrefix = req.headers['x-pfy-signature'].replace('sha256=', '')

        if (calculatedSignature !== providedSignatureWithoutPrefix) {
            console.error('Invalid authentication')
            res.status(401).json({ error: 'Invalid authentication' })
        }

        const body = req.body
        const type = body.type

        const orderPrintifyId = body.resource.id

        const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${orderPrintifyId}.json`

        const options = {
            headers: {
                Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
            },
        }

        if (type === 'order:updated' || type === 'order:sent-to-production' || type === 'order:shipment:created' || type === 'order:shipment:delivered') {

            const orderRes = await axios.get(base_url, options)

            const now2 = new Date() 
            console.log('now', now2)
            console.log('orderRes', orderRes)

            await updateProductStatus(orderPrintifyId, orderRes.data.line_items)

            if (orderRes.data.shipments)
                await updateOrderField(orderPrintifyId, 'shipments', orderRes.data.shipments)

            res.status(200).json({ message: 'Order status updated!' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ message: 'Error on printify webhook', error: error.message })
    }
}