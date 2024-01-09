import { doc, getDoc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import Error from "next/error";
import { db } from "../firebaseInit";

/**
 * Creates a new cart.
 * @param {string} userId - The ID of the user.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} products - The products in the cart.
 * @returns {string | object} The cart ID or status message if a conflict occurs.
 */
async function createCart(userId, cartId, products) {
    try {
        const cartRef = doc(db, process.env.NEXT_PUBLIC_COLL_CARTS, cartId)

        const docSnapshot = await getDoc(cartRef)

        if (docSnapshot.exists()) {
            return {
                status: 409,
                message: `Cart ID ${cartId} already exists.`,
            }
        }

        const newCart = {
            id: cartId,
            user_id: userId,
            products: products,
            created_at: Timestamp.now(),
        }

        await setDoc(cartRef, newCart)

        console.log(`Cart created with ID: ${cartId}`)
        return cartId
    } catch (error) {
        console.error("Error creating cart:", error)
        return null
    }
}

/**
 * Sets the products in a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} cartProducts - The products to set in the cart.
 */
async function setCartProducts(cartId, cartProducts) {
    try {
        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${cartId}`)

        await cartRef.update({ products: cartProducts });

        console.log(`Cart ${cartId} setted successfully!`)
    } catch (error) {
        console.error(`Error setting cart ${cartId}:`, error)
        throw new Error({ title: error?.props?.title || 'error_setting_cart', type: error?.props?.type || 'error' })
    }
}

/**
 * Changes a specific field value in a product within a cart.
 * @param {string} collectionName - The name of the collection.
 * @param {string} cartId - The ID of the cart.
 * @param {object} product - The product to be updated.
 * @param {string} fieldName - The name of the field to be updated.
 * @param {any} newValue - The new value for the field.
 * @returns {object} Status and message regarding the cart update.
 */
async function changeProductField(collectionName, cartId, product, fieldName, newValue) {
    try {
        const userRef = doc(db, collectionName, cartId)
        const cartDoc = await getDoc(userRef)

        const cartData = cartDoc.data()

        cartData.products = cartData.products.map(prod =>
            prod.id === product.id && prod.variant_id === product.variant_id
                ? { ...prod, [fieldName]: newValue }
                : prod
        )

        await updateDoc(userRef, cartData)

        return {
            status: 200,
            message: `Product field ${fieldName} in Cart ${cartId} updated successfully!`,
            cart: cartData,
        }
    } catch (error) {
        console.error(`Error in changeProductField: ${error}`)
        return {
            status: 500,
            message: `Error in changeProductField: ${error}`,
            cart: null,
            error: error,
        }
    }
}

export {
    createCart,
    setCartProducts,
    changeProductField,
}