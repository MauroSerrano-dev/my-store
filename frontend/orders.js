import {
    collection,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    getDoc,
} from "firebase/firestore"
import Error from "next/error"
import { db } from "../firebaseInit"

async function getOrderById(orderId) {
    try {
        const orderRef = doc(db, process.env.NEXT_PUBLIC_COLL_ORDERS, orderId)
        const orderDoc = await getDoc(orderRef)

        if (orderDoc.exists()) {
            const orderData = orderDoc.data()
            console.log("Order retrieved successfully")
            return { id: orderDoc.id, ...orderData }
        }
        else
            throw new Error({ title: 'order_not_found', type: 'error' })
    } catch (error) {
        console.error('Error getting order:', error);
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

async function getOrdersByUserId(userId, startDate, endDate) {
    try {
        const ordersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_ORDERS);
        let q = query(
            ordersCollection,
            where("user_id", "==", userId)
        );

        if (startDate) {
            const start = new Date(Number(startDate))
            q = query(q, where("create_at", ">=", start))
        }

        if (endDate) {
            const end = new Date(Number(endDate))
            q = query(q, where("create_at", "<=", end))
        }

        q = query(q, orderBy("create_at", "desc"))

        const querySnapshot = await getDocs(q)

        const orders = querySnapshot.docs.map(doc => doc.data())

        return orders
    } catch (error) {
        console.error('Error retrieving orders:', error);
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

export {
    getOrdersByUserId,
    getOrderById,
}