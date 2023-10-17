import {
    collection,
    addDoc,
    getFirestore,
    Timestamp,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createOrder(order) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS)

        const newOrderRef = await addDoc(ordersCollection, {
            ...order,
            create_at: Timestamp.now(),
        })

        const orderId = newOrderRef.id;

        return {
            success: true,
            message: `Order created with ID: ${orderId}`,
            orderId: orderId,
        }
    } catch (error) {
        return {
            success: false,
            message: 'Error creating order',
            error: error,
        }
    }
}

export {
    createOrder,
}