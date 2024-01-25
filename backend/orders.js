import { ALLOWED_WEBHOOK_STATUS, POPULARITY_POINTS } from "@/consts"
import MyError from "@/classes/MyError";
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

        handlePostOrderCreation(order.products, orderId.user_id)
            .then(() => {
                console.log('handlePostOrderCreation was executed successfully')
            })
            .catch(error => {
                console.error("Error in handlePostOrderCreation:", error)
            })

        return orderId
    }
    catch (error) {
        console.error('Error creating order:', error)
        throw error
    }
}

/**
 * Handles post-order creation tasks such as updating product sales.
 * 
 * @param {Array} line_items - Array of line items from the order.
 * @param {string} userId - userId to update field orders_counter.
 */
async function handlePostOrderCreation(line_items, userId) {
    try {
        const firestore = admin.firestore()

        const userRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${userId}`)
        await userRef.update({ orders_counter: admin.firestore.FieldValue.increment(1) })

        for (const lineItem of line_items) {
            const { id, variant_id, quantity } = lineItem
            const productRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_PRODUCTS}/${id}`)

            const productDoc = await productRef.get()

            if (productDoc.exists) {
                const productData = productDoc.data()
                // Update total sales on the product
                productData.total_sales = (productData.total_sales || 0) + quantity

                // Update popularity scores
                productData.popularity = (productData.popularity || 0) + POPULARITY_POINTS.purchase * quantity
                productData.popularity_year = (productData.popularity_year || 0) + POPULARITY_POINTS.purchase * quantity
                productData.popularity_month = (productData.popularity_month || 0) + POPULARITY_POINTS.purchase * quantity

                // Check if the product has variants
                if (productData.variants) {
                    const variant = productData.variants.find(v => v.id === variant_id)

                    // Check if the variant exists
                    if (variant) {
                        // Update variant sales
                        variant.sales = (variant.sales || 0) + quantity
                    }
                }

                // Update the product in the database
                await productRef.update(productData)
            }
        }
    }
    catch (error) {
        console.error('Error handling purchased products:', error)
        throw new MyError({ message: 'error_handling_purchased_products', type: error?.type || 'error' })
    }
}

async function updateProductStatus(order_id_printify, printify_products) {
    try {
        const firestore = admin.firestore();
        const ordersCollection = firestore.collection(process.env.NEXT_PUBLIC_COLL_ORDERS);

        const q = ordersCollection.where("id_printify", "==", order_id_printify);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty)
            throw new MyError({ message: `Order with ID ${order_id_printify} not found` })

        const orderDoc = querySnapshot.docs[0];

        const now = admin.firestore.Timestamp.now();

        const orderData = orderDoc.data();
        const updatedProducts = orderData.products.map(product => {
            const newPossibleStatus = printify_products.find(prod => prod.product_id === product.id_printify && prod.variant_id === product.variant_id_printify)?.status;
            const newStatus = ALLOWED_WEBHOOK_STATUS.includes(newPossibleStatus) && ALLOWED_WEBHOOK_STATUS.includes(product.status)
                ? newPossibleStatus || null
                : product.status;
            return {
                ...product,
                updated_at: newStatus !== product.status ? now : product.updated_at,
                status: newStatus
            };
        });

        await orderDoc.ref.update({ products: updatedProducts });

        console.log("Order products status updated successfully")
    } catch (error) {
        console.error("Error updating product status", error);
        throw error;
    }
}

async function updateOrderField(order_id_printify, field_name, value) {
    try {
        const firestore = admin.firestore();
        const ordersCollection = firestore.collection(process.env.NEXT_PUBLIC_COLL_ORDERS);

        const q = ordersCollection.where("id_printify", "==", order_id_printify);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0];

            await orderDoc.ref.update({ [field_name]: value });

            console.log('Order updated successfully');
        } else {
            throw new MyError({ message: `Order with Printify ID ${order_id_printify} not found` });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

async function getOrderById(orderId) {
    try {
        const firestore = admin.firestore();
        const orderRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_ORDERS}/${orderId}`);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            console.log(`Order ${orderId} not found`);
            throw new MyError({ message: 'order_not_found', statusCode: 400 })
        }

        const orderData = orderDoc.data();
        console.log("Order retrieved successfully");
        return { id: orderDoc.id, ...orderData };
    } catch (error) {
        console.error('Error getting order by id:', error);
        throw error
    }
}

async function getOrderLimitInfoById(orderId) {
    try {
        const orderRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_ORDERS}/${orderId}`)

        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            console.log(`Order info ${orderId} not found`)
            throw new MyError('order_not_found')
        }

        const orderData = orderDoc.data()

        console.log("Order info retrieved successfully")
        return {
            id: orderDoc.id,
            create_at: orderData.create_at,
            products: orderData.products,
        }

    } catch (error) {
        console.error('Error getting order info by id:', error)
        throw error
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
            throw new MyError({ message: 'refund_fail_order_not_found' })
        }
    } catch (error) {
        console.error('Error refunding order by Stripe ID:', error);
        throw new MyError({ message: 'error_refunding_order', type: error?.type || 'error' })
    }
}

export {
    createOrder,
    updateProductStatus,
    updateOrderField,
    getOrderById,
    getOrderLimitInfoById,
    refundOrderByStripeId,
}