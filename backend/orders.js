import {
    collection,
    doc,
    updateDoc,
    Timestamp,
    query,
    where,
    getDocs,
    orderBy,
    getDoc,
} from "firebase/firestore"
import { ALLOWED_WEBHOOK_STATUS, POPULARITY_POINTS } from "@/consts"
import Error from "next/error"
import { db } from "../firebaseInit"
const admin = require('../firebaseAdminInit');

/**
 * Creates a new order in the Firestore.
 * 
 * @param {string} orderId - The order ID.
 * @param {Object} order - The order object to be created in the Firestore.
 * @returns {string} The order ID.
 */
async function createOrder(orderId, order) {
    try {
        const orderRef = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_ORDERS).doc(orderId);

        const now = admin.firestore.Timestamp.now();

        // Set the order document with the provided order data.
        // Update 'updated_at' timestamp for each product in the order.
        await orderRef.set({
            ...order,
            products: order.products.map(prod => ({ ...prod, updated_at: now })),
            create_at: now,
        })

        await handlePostOrderCreation(order.products) // Function to handle post-order creation logic.

        return orderId
    } catch (error) {
        console.error('Error creating order:', error)
        throw new Error({ title: error?.props?.title || 'error_creating_order', type: error?.props?.type || 'error' })
    }
}

/**
 * Handles post-order creation tasks such as updating product sales.
 * 
 * @param {Array} line_items - Array of line items from the order.
 */
async function handlePostOrderCreation(line_items) {
    try {
        for (const lineItem of line_items) {
            const { id, variant_id, quantity } = lineItem;

            const productRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_PRODUCTS}/${id}`);
            const productDoc = await productRef.get();

            if (productDoc.exists()) {
                const productData = productDoc.data();
                // Update total sales on the product
                productData.total_sales = (productData.total_sales || 0) + quantity;

                // Update popularity scores
                productData.popularity = (productData.popularity || 0) + POPULARITY_POINTS.purchase * quantity;
                productData.popularity_year = (productData.popularity_year || 0) + POPULARITY_POINTS.purchase * quantity;
                productData.popularity_month = (productData.popularity_month || 0) + POPULARITY_POINTS.purchase * quantity;

                // Check if the product has variants
                if (productData.variants) {
                    const variant = productData.variants.find(v => v.id === variant_id);

                    // Check if the variant exists
                    if (variant) {
                        // Update variant sales
                        variant.sales = (variant.sales || 0) + quantity;
                    }
                }

                // Update the product in the database
                await productRef.update(productData);
            }
        }
    } catch (error) {
        console.error('Error handling purchased products:', error);
        throw new Error({ title: error?.props?.title || 'error_handling_purchased_products', type: error?.props?.type || 'error' })
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
        const ordersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_ORDERS)

        const q = query(ordersCollection, where("id_printify", "==", order_id_printify))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {

            const orderDoc = querySnapshot.docs[0]

            const now = Timestamp.now();

            const orderData = orderDoc.data()
            const updatedProducts = orderData.products.map(product => {
                const newPossibleStatus = printify_products.find(prod => prod.product_id === product.id_printify && prod.variant_id === product.variant_id_printify)?.status
                const newStatus = ALLOWED_WEBHOOK_STATUS.some(step => step === newPossibleStatus) && ALLOWED_WEBHOOK_STATUS.some(step => step === product.status)
                    ? newPossibleStatus || null
                    : product.status
                return {
                    ...product,
                    updated_at: newStatus !== product.status
                        ? now
                        : product.updated_at,
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
        const ordersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_ORDERS)

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
        const orderRef = doc(db, process.env.NEXT_PUBLIC_COLL_ORDERS, orderId)
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

async function getOrderLimitInfoById(orderId) {
    try {
        const orderRef = doc(db, process.env.NEXT_PUBLIC_COLL_ORDERS, orderId)
        const orderDoc = await getDoc(orderRef)

        if (orderDoc.exists()) {
            const orderData = orderDoc.data()
            console.log("Order info retrieved successfully")
            return {
                create_at: orderData.create_at,
                id: orderData.id,
                products: orderData.products,
            }
        }
        else {
            console.log(`Order info ${orderId} not found`)
            return null
        }
    } catch (error) {
        console.error(`Error getting order info by id: ${error}`)
        throw new Error(`Error getting order info by id: ${error}`)
    }
}

/**
 * Refunds an order based on its Stripe payment intent ID.
 * 
 * @param {string} payment_intent - The Stripe payment intent ID.
 * @param {number} amount_refunded - The amount refunded.
 */
async function refundOrderByStripeId(payment_intent, amount_refunded) {
    try {
        const ordersCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_ORDERS);
        const q = ordersCollection.where("id_stripe_payment_intent", "==", payment_intent);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0];
            const orderData = orderDoc.data();

            await orderDoc.ref.update({
                payment_details: {
                    ...orderData.payment_details,
                    refund: {
                        amount: amount_refunded,
                        refund_at: admin.firestore.Timestamp.now(),
                    },
                },
                products: orderData.products.map(prod => ({ ...prod, status: 'refunded' }))
            });
        } else {
            console.error(`Refund fail. Order with Stripe ID ${payment_intent} not found.`);
            throw new Error({ title: 'refund_fail_order_not_found', type: 'error' })
        }
    } catch (error) {
        console.error('Error refunding order by Stripe ID:', error);
        throw new Error({ title: error?.props?.title || 'error_refunding_order', type: error?.props?.type || 'error' })
    }
}

export {
    createOrder,
    getOrdersByUserId,
    updateProductStatus,
    updateOrderField,
    getOrderById,
    getOrderLimitInfoById,
    refundOrderByStripeId,
}