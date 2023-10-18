import {
    collection,
    addDoc,
    getFirestore,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../../../../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createWeebhook(body) {
    try {
        const webhooksCollection = collection(db, 'webhooks')

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
    if (req.method === "POST") {
        const body = req.body
        const response = await createWeebhook(body)
        res.status(200).json({ message: response.message })
    }
}