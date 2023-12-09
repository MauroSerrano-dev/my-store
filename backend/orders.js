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
    orderBy,
    getDoc,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { handleProductsPurchased } from "./product"
import { ALLOWED_WEBHOOK_STATUS } from "@/consts"
import Error from "next/error"

initializeApp(firebaseConfig)

const db = getFirestore()

async function createOrder(order) {
    try {
        const orderRef = doc(db, process.env.COLL_ORDERS, order.id)

        const now = Timestamp.now()

        await setDoc(
            orderRef,
            {
                ...order,
                products: order.products.map(prod => ({ ...prod, updated_at: now })),
                create_at: now,
            }
        )

        await handleProductsPurchased(order.products)

        return {
            status: 200,
            message: `Order created with ID: ${order.id}`,
            orderId: order.id,
        }
    } catch (error) {
        throw new Error(`Error creating order: ${error}`);
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

        q = query(q, orderBy("create_at", "desc"))

        const querySnapshot = await getDocs(q)

        const orders = querySnapshot.docs.map(doc => doc.data())

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

async function updateProductStatus(order_id_printify, printify_products) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS)

        const q = query(ordersCollection, where("id_printify", "==", order_id_printify))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {

            const orderDoc = querySnapshot.docs[0]

            const orderData = orderDoc.data()
            const updatedProducts = orderData.products.map(product => {
                const newPossibleStatus = printify_products.find(prod => prod.product_id === product.id_printify && prod.variant_id === product.variant_id_printify)?.status
                const newStatus = ALLOWED_WEBHOOK_STATUS.some(step => step.id === newPossibleStatus) && ALLOWED_WEBHOOK_STATUS.some(step => step.id === product.status)
                    ? newPossibleStatus || null
                    : product.status
                return {
                    ...product,
                    updated_at: newStatus === product.status
                        ? product.status
                        : Timestamp.now(),
                    status: newStatus
                }
            })

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

async function updateOrderField(order_id_printify, field_name, value) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS)

        const q = query(ordersCollection, where("id_printify", "==", order_id_printify))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0]

            await updateDoc(orderDoc.ref, { [field_name]: value })

            return {
                status: 200,
                message: "Product updated successfully",
            }
        } else {
            return {
                status: 404,
                message: `Order with Printify ID ${order_id_printify} not found`,
            }
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Error updating product",
            error: error,
        }
    }
}

async function getOrderById(orderId) {
    try {
        const orderRef = doc(db, process.env.COLL_ORDERS, orderId)
        const orderDoc = await getDoc(orderRef)

        if (orderDoc.exists()) {
            const orderData = orderDoc.data()
            console.log("Order retrieved successfully")
            return orderData
        }
        else {
            console.log(`Order ${orderId} not found`)
            return null
        }
    } catch (error) {
        console.error(`Error getting order by id: ${error}`)
        throw new Error(`Error getting order by id: ${error}`)
    }
}

async function refundOrderByStripeId(payment_intent, amount_refunded) {
    try {
        const ordersCollection = collection(db, process.env.COLL_ORDERS)

        const q = query(ordersCollection, where("id_stripe_payment_intent", "==", payment_intent))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0]
            const orderData = orderDoc.data()

            await updateDoc(
                orderDoc.ref,
                {
                    payment_details: {
                        ...orderData.payment_details,
                        refund: {
                            amount: amount_refunded,
                            refund_at: Timestamp.now(),
                        },
                    },
                    products: orderData.products.map(prod => ({ ...prod, status: 'refunded' }))
                })

            return {
                status: 200,
                message: "Order refunded successfully",
            }
        } else {
            console.error(`Order with Stripe ID ${payment_intent} not found. Refund fail.`)
            throw new Error(`Order with Stripe ID ${payment_intent} not found. Refund fail.`)
        }
    } catch (error) {
        console.error(`Error refunding order by stripe id: ${error}`)
        throw new Error(`Error refunding order by stripe id: ${error}`)
    }
}

export {
    createOrder,
    getOrdersByUserId,
    updateProductStatus,
    updateOrderField,
    getOrderById,
    refundOrderByStripeId,
}