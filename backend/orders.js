import {
    collection,
    addDoc,
    doc,
    updateDoc,
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

async function insertNewFieldToOrder(order_id, field_name, value) {
    try {
        const orderRef = doc(db, process.env.COLL_ORDERS, order_id)

        await updateDoc(orderRef, {
            [field_name]: value,
        })

        return {
            success: true,
            message: `${field_name} added to order with ID: ${order_id}`,
        }
    } catch (error) {
        return {
            success: false,
            message: `Error inserting ${field_name}`,
            error: error,
        }
    }
}

export {
    createOrder,
    insertNewFieldToOrder,
}