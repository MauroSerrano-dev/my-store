import {
    collection,
    addDoc,
    getFirestore,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../../../../firebase.config"
import axios from 'axios'
import { updateProductStatus } from "../../../../backend/orders"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createWeebhook(body) {
    try {
        const webhooksCollection = collection(db, 'webfff')

        await addDoc(webhooksCollection, body)

        return {
            success: true,
            message: 'Webhook created!',
        }
    } catch (error) {
        return {
            success: false,
            message: 'Error creating webhook',
        }
    }
}

export default async function handler(req, res) {
    await createWeebhook(req.body)
    try {
        if (req.method === "POST") {
            const body = req.body
            const type = body.type

            const orderId = body.resource.id

            const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${orderId}.json`

            const options = {
                headers: {
                    Authorization: process.env.PRINTIFY_ACCESS_TOKEN,
                },
            }

            if (type === 'order:updated' || type === 'order:sent-to-production' || type === 'order:shipment:created' || type === 'order:shipment:delivered') {

                const orderRes = await axios.get(base_url, options)

                await updateProductStatus(orderId, orderRes.data.line_items, { authorization: req.headers.authorization || null })

                res.status(200).json({ message: 'Order status updated!' })
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: `Error on printify webhook: ${error}` })
    }
}