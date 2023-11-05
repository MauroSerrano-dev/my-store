import axios from 'axios'
import { updateProductStatus, updateOrderField } from "../../../../backend/orders"
const CryptoJS = require('crypto-js')

export default async function handler(req, res) {
    try {
        const calculatedSignature = CryptoJS.HmacSHA256(JSON.stringify(req.body), process.env.PRINTIFY_WEBHOOK_SECRET).toString(CryptoJS.enc.Hex)

        const providedSignatureWithoutPrefix = req.headers['x-pfy-signature'].replace('sha256=', '')

        if (calculatedSignature !== providedSignatureWithoutPrefix)
            return res.status(401).json({ error: 'Invalid authentication.' })

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

            await updateProductStatus(orderPrintifyId, orderRes.data.line_items)

            if (true)
                await updateOrderField(orderPrintifyId, 'shipments', [
                    {
                        "carrier": "SPRING",
                        "number": "LR011653238NL",
                        "url": "https://mailingtechnology.com/tracking/?tn=LR011653238NL",
                        "delivered_at": "2023-11-02 10:54:00+00:00"
                    }
                ])

            res.status(200).json({ message: 'Order status updated!' })
        }
    }
    catch (error) {
        res.status(500).json({ error: `Error on printify webhook: ${error}` })
    }
}