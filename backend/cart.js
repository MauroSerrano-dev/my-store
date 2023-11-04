import { collection, doc, addDoc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { deleteCartSession, getCartSessionById } from "./cart-session";
import { getUserById } from "./user";

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

async function createCart(userId, products) {
    const cartRef = collection(db, process.env.COLL_CARTS)
    const now = new Date()

    try {
        const newCartDocRef = await addDoc(cartRef, {
            user_id: userId,
            products: products,
            created_at: now,
        })

        console.log(`Cart created with ID: ${newCartDocRef.id}`)
        return newCartDocRef.id
    } catch (error) {
        console.error("Error creating cart:", error)
        return null
    }
}

async function updateCart(cartId, cart) {
    const cartRef = doc(db, process.env.COLL_CARTS, cartId)
    const cartDoc = await getDoc(cartRef);

    try {
        const cartData = cartDoc.data()
        cartData.products = cart

        await updateDoc(cartRef, cartData)

        console.log(`Cart ${cartId} updated successfully!`)
    } catch (error) {
        console.error(`Error updating cart ${cartId}:`, error)
    }
}

async function mergeCarts(userId, cart_cookie_id) {
    try {
        const user = await getUserById(userId)
        const cartId = user.cart_id
        const userCart = await getCartById(cartId)

        if (userCart) {
            const cartProducts = await getCartSessionById(cart_cookie_id)

            if (cartProducts) {
                await deleteCartSession(cart_cookie_id)

                const mergedCart = userCart.map(p => {
                    const exist = cartProducts.find(prod => prod.id === p.id && prod.variant_id === p.variant_id)
                    if (exist)
                        return { ...p, quantity: p.quantity + exist.quantity }
                    else
                        return p
                }).concat(cartProducts.filter(prod => !userCart.some(p => p.id === prod.id && p.variant_id === prod.variant_id)))

                await updateCart(cartId, mergedCart)

                console.log(`Cart Session ${cart_cookie_id} merged with cart ${cartId} successfully.`)
            } else {
                console.log(`Cart Session with ID ${cart_cookie_id} not found.`)
            }
        } else {
            console.log(`Cart ${cartId} not found.`)
        }
    } catch (error) {
        console.error(`Error merging Cart Session ${cart_cookie_id}.`, error)
        throw error
    }
}


export {
    createCart,
    updateCart,
    getCartById,
    mergeCarts,
}