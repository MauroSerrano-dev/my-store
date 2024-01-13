import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseInit";
import MyError from "@/classes/MyError";
const admin = require('../firebaseAdminInit');

/**
 * Creates a new cart for a user.
 * @param {string} userId - The ID of the user for whom the cart is being created.
 * @param {Array} products - Products to be included in the cart. Default is an empty array.
 * @returns {Promise<string>} The ID of the created cart document.
 */
async function createCart(userId, products = []) {
    try {
        const cartsCollectionRef = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_CARTS);

        const newCart = {
            user_id: userId,
            products: products,
            created_at: admin.firestore.Timestamp.now(),
        };

        const docRef = await cartsCollectionRef.add(newCart);

        return docRef.id;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
}

/**
 * Sets the products in a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} cartProducts - The products to set in the cart.
 */
async function setCartProducts(cartId, cartProducts) {
    try {
        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_CARTS}/${cartId}`)

        await cartRef.update({ products: cartProducts });

        console.log(`Cart ${cartId} setted successfully!`)
    } catch (error) {
        console.error(`Error setting cart ${cartId}:`, error)
        throw new MyError('error_setting_cart', 'error')
    }
}

/**
 * Changes a specific field value in a product within a cart.
 * @param {string} collectionName - The name of the collection.
 * @param {string} cartId - The ID of the cart.
 * @param {Object} product - The product to be updated.
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

        return cartData
    }
    catch (error) {
        console.error('Error in changeProductField:', error)
        throw error
    }
}

export {
    createCart,
    setCartProducts,
    changeProductField,
}