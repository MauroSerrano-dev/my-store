import {
    collection,
    addDoc,
    getFirestore,
    Timestamp,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../../../../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createWeebhook(body) {
    try {
        const webhooksCollection = collection(db, 'webhooks')

        await addDoc(webhooksCollection, {
            ...body,
            create_at: Timestamp.now(),
        })

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

export {
    createOrder,
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body
        createWeebhook(body)
    }
}