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
    getDoc,
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

async function getOrdersByUserId(userId, startDate, endDate) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS);
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

        const querySnapshot = await getDocs(q)

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
        console.error(error)
        return {
            status: 500,
            message: "Error retrieving orders",
            orders: [],
            error: error,
        };
    }
}

async function updateProductFields(order_id, id_printify, variant_id, newFields) {
    try {
        const orderRef = doc(db, process.env.COLL_ORDERS, order_id)
        const orderDoc = await getDoc(orderRef)

        if (orderDoc.exists()) {
            const orderData = orderDoc.data()

            const updatedProducts = orderData.products.map(product =>
                product.id_printify === id_printify && product.variant_id === variant_id
                    ? { ...product, ...newFields }
                    : product
            )

            await updateDoc(orderRef, { products: updatedProducts })

            return {
                status: 200,
                message: "Product status updated successfully",
            }
        } else {
            return {
                status: 404,
                message: `Order with ID ${order_id} not found`,
            }
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Error updating product status",
            error: error,
        }
    }
}

export {
    createOrder,
    getOrdersByUserId,
    updateProductFields,
}