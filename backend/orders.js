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

async function updateProductStatus(order_id_printify, products, auth) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS)

        const q = query(ordersCollection, where("id_printify", "==", order_id_printify))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {

            const orderDoc = querySnapshot.docs[0]

            const orderData = orderDoc.data()
            const updatedProducts = orderData.products.map(product => (
                {
                    ...product,
                    status: products.find(prod => prod.product_id === product.id_printify && prod.variant_id === product.variant_id)?.status || null,
                    ...auth,
                }
            ))

            await updateDoc(orderDoc.ref, { products: updatedProducts })

            return {
                status: 200,
                message: "Product status updated successfully",
            }
        } else {
            return {
                status: 404,
                message: `Order with ID ${order_id_printify} not found`,
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
    updateProductStatus,
}