import { collection, doc, addDoc, getDoc, getFirestore, updateDoc, Timestamp, getDocs, query, where, setDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { deleteCartSession, getCartSessionById } from "./cart-session";
import { mergeProducts } from "../utils";

initializeApp(firebaseConfig)

const db = getFirestore()

async function getCartById(id) {
    const cartRef = doc(db, process.env.COLL_CARTS, id)

    try {
        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
            return cartDoc.data()
        } else {
            console.log("Cart not found")
            return null
        }
    } catch (error) {
        console.error("Error getting cart by ID:", error)
        return null
    }
}

async function getCartIdByUserId(userId) {
    try {
        const cartCollection = collection(db, process.env.COLL_CARTS)

        let q = query(
            cartCollection,
            where("user_id", "==", userId)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return {
                status: 200,
                message: "Cart ID not found",
                cart_id: null,
            }
        }

        const cartDoc = querySnapshot.docs[0]

        return {
            status: 200,
            message: "Cart ID retrieved successfully",
            cart_id: cartDoc.id,
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Error retrieving cart ID",
            cart_id: null,
            error: error,
        }
    }
}

async function createCart(userId, cartId, products) {
    try {
        const cartRef = doc(db, process.env.COLL_CARTS, cartId)

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

async function setCartProducts(cartId, cartProducts) {
    const cartRef = doc(db, process.env.COLL_CARTS, cartId)
    const cartDoc = await getDoc(cartRef)

    try {
        const cartData = cartDoc.data()
        cartData.products = cartProducts

        await updateDoc(cartRef, cartData)

        console.log(`Cart ${cartId} setted successfully!`)
    } catch (error) {
        console.error(`Error setting cart ${cartId}:`, error)
    }
}

async function addProductsToCart(cartId, cartNewProducts) {
    const cartRef = doc(db, process.env.COLL_CARTS, cartId)
    const cartDoc = await getDoc(cartRef)

    try {
        const cartData = cartDoc.data()

        cartData.products = mergeProducts(cartData.products, cartNewProducts)

        await updateDoc(cartRef, cartData)

        return {
            status: 200,
            message: `Cart ${cartId} updated successfully!`,
            cart: cartData,
        }
    } catch (error) {
        console.error(`Error updating Cart ${cartId}:`, error)
        return {
            status: 500,
            message: `Error updating Cart ${cartId}: ${error}`,
            cart: null,
            error: error,
        }
    }
}

async function deleteProductFromCart(cartId, product) {
    const userRef = doc(db, process.env.COLL_CARTS, cartId)
    const cartDoc = await getDoc(userRef)

    try {
        const cartData = cartDoc.data()

        cartData.products = cartData.products.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant_id)

        await updateDoc(userRef, cartData)

        return {
            status: 200,
            message: `Cart ${cartId} updated successfully!`,
            cart: cartData,
        }
    } catch (error) {
        console.error(`Error Deleting Product from Cart ${cartId}: ${error}`)
        return {
            status: 500,
            message: `Error Deleting Product from Cart ${cartId}: ${error}`,
            cart: null,
            error: error,
        }
    }
}

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

async function mergeCarts(userId, cart_cookie_id) {
    try {
        const userCartRes = await getCartIdByUserId(userId)
        const userCartId = userCartRes?.id

        if (userCartId) {
            const cartSession = await getCartSessionById(cart_cookie_id)

            if (cartSession) {
                await deleteCartSession(cart_cookie_id)

                await addProductsToCart(userCartId, cartSession.products)

                console.log(`Cart Session ${cart_cookie_id} merged with cart ${userCartId} successfully.`)
            } else {
                console.log(`Cart Session with ID ${cart_cookie_id} not found.`)
            }
        } else {
            console.log(`User ${userId} Cart not found.`)
        }
    } catch (error) {
        console.error(`Error merging Cart Session ${cart_cookie_id}.`, error)
        throw error
    }
}

export {
    createCart,
    setCartProducts,
    getCartById,
    getCartIdByUserId,
    mergeCarts,
    addProductsToCart,
    deleteProductFromCart,
    changeProductField,
}