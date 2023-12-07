import {
    doc,
    setDoc,
    getFirestore,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createReceiptUrl(id, data) {
    try {
        const orderRef = doc(db, 'STRIPE_RECEIPT_URL', id)
        await setDoc(orderRef, data)
        console.log(`Document with ID ${id} created successfully!`)
    } catch (error) {
        throw new Error(`Error creating stripe receipt url: ${error}`);
    }
}

export {
    createReceiptUrl,
}