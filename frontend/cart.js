import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseInit";
import { LIMITS } from "@/consts";
import { isSameProduct, mergeProducts } from "@/utils";
import MyError from "@/classes/MyError";

/**
 * Retrieves a cart by its ID.
 * @param {string} id - The ID of the cart.
 * @returns {object} The cart data.
 */
async function getCartById(id) {
    try {
        const cartRef = doc(db, process.env.NEXT_PUBLIC_COLL_CARTS, id)

        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
            return { id: cartDoc.id, ...cartDoc.data() };
        } else {
            console.log("Cart not found")
            return null
        }
    } catch (error) {
        console.error('Error getting cart by ID:', error)
        throw error
    }
}

/**
 * Creates a new cart.
 * @param {string} userId - The ID of the user.
 * @param {Array} products - The products in the cart. `Default: []`
 * @returns {string | object} The cart ID or status message if a conflict occurs.
 */
async function createCart(userId, products = []) {
    try {
        const cartsCollectionRef = collection(db, process.env.NEXT_PUBLIC_COLL_CARTS);

        const newCart = {
            user_id: userId,
            products: products,
            created_at: Timestamp.now(),
        }

        const docRef = await addDoc(cartsCollectionRef, newCart);

        console.log('Cart created');
        return docRef.id
    } catch (error) {
        console.error('Error creating cart:', error)
        throw error
    }
}

/**
 * Adds products to a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} cartNewProducts - The new products to add to the cart.
 * @returns {object} Status and message regarding the cart update.
 */
async function addProductsToCart(cartId, cartNewProducts) {
    try {
        const cartRef = doc(db, process.env.NEXT_PUBLIC_COLL_CARTS, cartId)
        const cartDoc = await getDoc(cartRef)

        const cartData = cartDoc.data()

        if (cartData.products.reduce((acc, prod) => acc + prod.quantity, 0) + cartNewProducts.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw new MyError('max_products', 'warning')

        cartData.products = mergeProducts(cartData.products, cartNewProducts)

        await updateDoc(cartRef, cartData)

        return { id: cartDoc.id, ...cartData }
    } catch (error) {
        console.error('Error Adding Product to Cart:', error)
        throw error
    }
}

/**
 * Deletes a product from a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {object} product - The product to be removed from the cart.
 * @returns {object} Status and message regarding the cart update.
 */
async function deleteProductFromCart(cartId, product) {
    const cartRef = doc(db, process.env.NEXT_PUBLIC_COLL_CARTS, cartId)
    const cartDoc = await getDoc(cartRef)

    try {
        const cartData = cartDoc.data()

        cartData.products = cartData.products.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant.id)

        await updateDoc(cartRef, cartData)

        console.log('Cart updated successfully!')
        return { id: cartDoc.id, ...cartData }
    } catch (error) {
        console.error('Error Deleting Product from Cart:', error)
        throw new MyError('error_deleting_product_from_cart', 'error')
    }
}

async function mergeCarts(cartId, products) {
    try {
        const userCart = await getCartById(cartId)
        const newCart = userCart.products.reduce((acc, prod) => acc + prod.quantity, 0) + products.reduce((acc, prod) => acc + prod.quantity, 0) <= LIMITS.cart_items
            ? await addProductsToCart(cartId, products)
            : userCart
        return newCart
    } catch (error) {
        console.error('Error merging Carts', error)
        throw new MyError('error_deleting_product_from_cart', 'error')
    }
}

/**
 * Changes a specific field value in a product within a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {object} product - The product to be updated.
 * @param {string} fieldName - The name of the field to be updated.
 * @param {any} newValue - The new value for the field.
 * @returns {object} Status and message regarding the cart update.
 */
async function changeCartProductField(cartId, product, fieldName, newValue) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_CARTS, cartId)
        const cartDoc = await getDoc(userRef)

        const cartData = cartDoc.data()

        const newProducts = cartData.products.map(prod =>
            isSameProduct(prod, product)
                ? { ...prod, [fieldName]: newValue }
                : prod
        )

        await updateDoc(userRef, { products: newProducts })

        return { id: cartDoc.id, ...cartData }
    } catch (error) {
        console.error('Error in changeProductField:', error)
        throw error
    }
}

export {
    getCartById,
    createCart,
    addProductsToCart,
    deleteProductFromCart,
    mergeCarts,
    changeCartProductField,
}