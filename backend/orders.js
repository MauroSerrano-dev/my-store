import {
    collection,
    setDoc,
    doc,
    updateDoc,
    getFirestore,
    Timestamp,
    query,
    where,
    getDocs,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { handleProductsPurchased } from "./product"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createOrder(order) {
    try {
        const orderRef = doc(db, process.env.COLL_ORDERS, order.id)

        await setDoc(
            orderRef,
            {
                ...order,
                create_at: Timestamp.now(),
            }
        )

        await handleProductsPurchased(order.products)

        return {
            status: 200,
            message: `Order created with ID: ${order.id}`,
            orderId: order.id,
        }
    } catch (error) {
        return {
            status: 500,
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
            status: 200,
            message: `${field_name} added to order with ID: ${order_id}`,
        }
    } catch (error) {
        return {
            status: 500,
            message: `Error inserting ${field_name}`,
            error: error,
        }
    }
}

async function getOrdersByUserId(userId, startDate, endDate) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS);
        let q = query(
            ordersCollection,
            where("user_id", "==", userId)
        );

        if (startDate) {
            q = query(q, where("create_at", ">=", startDate));
        }

        if (endDate) {
            q = query(q, where("create_at", "<=", endDate));
        }

        const querySnapshot = await getDocs(q);

        const orders = [];

        querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            orders.push(orderData);
        });

        return {
            status: 200,
            message: "Orders retrieved successfully",
            orders: orders,
        };
    } catch (error) {
        return {
            status: 500,
            message: "Error retrieving orders",
            error: error,
        };
    }
}

export {
    createOrder,
    insertNewFieldToOrder,
    getOrdersByUserId,
}