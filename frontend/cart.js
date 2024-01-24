import {
    Timestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseInit";
import { LIMITS } from "@/consts";
import { isSameProduct, mergeProducts } from "@/utils";
import MyError from "@/classes/MyError";

/**
 * Adds products to a cart.
 * @param {string} userId - The ID of the user.
 * @param {Array} cartNewProducts - The new products to add to the cart.
 * @returns {object} Status and message regarding the cart update.
 */
async function addProductsToCart(userId, cartNewProducts) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        if (userData.cart.products.reduce((acc, prod) => acc + prod.quantity, 0) + cartNewProducts.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw new MyError({ message: 'max_products', type: 'warning' })

        const cartProducts = mergeProducts(userData.cart.products, cartNewProducts)

        await updateDoc(userRef, { cart: { products: cartProducts, updated_at: Timestamp.now() } })
    }
    catch (error) {
        console.error('Error Adding Product to Cart:', error)
        throw error
    }
}

/**
 * Deletes a product from a cart.
 * @param {string} userId - The ID of the user.
 * @param {Object} product - The product to be removed from the cart.
 * @returns {object} Status and message regarding the cart update.
 */
async function deleteProductFromCart(userId, product) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        const cartProducts = userData.cart.products.filter(prod => !isSameProduct(prod, product))

        await updateDoc(userRef, { cart: { products: cartProducts, updated_at: Timestamp.now() } })

        if (process.env.NEXT_PUBLIC_ENV === 'development')
            console.log('Cart updated successfully!')
    }
    catch (error) {
        console.error('Error Deleting Product from Cart:', error)
        throw new MyError({ message: 'error_deleting_product_from_cart' })
    }
}

async function mergeCarts(userId, products) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        userData.cart.products.reduce((acc, prod) => acc + prod.quantity, 0) + products.reduce((acc, prod) => acc + prod.quantity, 0) <= LIMITS.cart_items
            ? await addProductsToCart(userId, products)
            : await setCartProducts(userId, products)
    }
    catch (error) {
        console.error('Error merging Carts', error)
        throw new MyError({ message: 'error_deleting_product_from_cart' })
    }
}

/**
 * Changes a specific field value in a product within a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Object} product - The product to be updated.
 * @param {string} fieldName - The name of the field to be updated.
 * @param {any} newValue - The new value for the field.
 * @returns {object} Status and message regarding the cart update.
 */
async function changeCartProductField(userId, product, fieldName, newValue) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        const newProducts = userData.cart.products.map(prod =>
            isSameProduct(prod, product)
                ? { ...prod, [fieldName]: newValue }
                : prod
        )

        if (newProducts.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw new MyError({ message: 'max_products', type: 'warning' })

        await updateDoc(userRef, { cart: { products: newProducts, updated_at: Timestamp.now() } })
    }
    catch (error) {
        console.error('Error in changeCartProductField:', error)
        throw error
    }
}

/**
 * Sets the products for a cart.
 * @param {string} userId - The ID of the cart.
 * @param {Array} cartProducts - The new list of products for the cart.
 * @returns {object} Status and message regarding the cart update.
 */
async function setCartProducts(userId, cartProducts) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists())
            throw new MyError({ message: 'user_not_found' })

        await updateDoc(userRef, { cart: { products: cartProducts, updated_at: Timestamp.now() } });

        if (process.env.NEXT_PUBLIC_ENV === 'development')
            console.log('Cart products set successfully!');
    }
    catch (error) {
        console.error('Error setting cart products:', error);
        throw error;
    }
}

export {
    addProductsToCart,
    deleteProductFromCart,
    mergeCarts,
    changeCartProductField,
    setCartProducts,
}