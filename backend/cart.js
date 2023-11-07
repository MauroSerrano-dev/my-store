import { collection, doc, addDoc, getDoc, getFirestore, updateDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { deleteCartSession, getCartSessionById } from "./cart-session";

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

async function getCartByUserId(userId) {
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
                message: "Cart not found",
                cart: null,
            }
        }

        const cartDoc = querySnapshot.docs[0]
        const cart = { id: cartDoc.id, data: cartDoc.data() }

        return {
            status: 200,
            message: "Cart retrieved successfully",
            cart: cart,
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Error retrieving cart",
            cart: null,
            error: error,
        }
    }
}

async function createCart(userId, products) {
    const cartRef = collection(db, process.env.COLL_CARTS)

    try {
        const newCartDocRef = await addDoc(cartRef, {
            user_id: userId,
            products: products,
            created_at: Timestamp.now(),
        })

        console.log(`Cart created with ID: ${newCartDocRef.id}`)
        return newCartDocRef.id
    } catch (error) {
        console.error("Error creating cart:", error)
        return null
    }
}

async function updateCart(cartId, cartProducts) {
    const cartRef = doc(db, process.env.COLL_CARTS, cartId)
    const cartDoc = await getDoc(cartRef);

    try {
        const cartData = cartDoc.data()
        cartData.products = cartProducts

        await updateDoc(cartRef, cartData)

        console.log(`Cart ${cartId} updated successfully!`)
    } catch (error) {
        console.error(`Error updating cart ${cartId}:`, error)
    }
}

async function mergeCarts(userId, cart_cookie_id) {
    try {
        const userCartRes = await getCartByUserId(userId)
        const userCartId = userCartRes?.cart?.id
        const userCart = userCartRes?.cart?.data

        if (userCartRes) {
            const cartSession = await getCartSessionById(cart_cookie_id)

            if (cartSession) {
                await deleteCartSession(cart_cookie_id)

                const mergedProducts = userCart.products.map(p => {
                    const exist = cartSession.products.find(prod => prod.id === p.id && prod.variant_id === p.variant_id)
                    if (exist)
                        return { ...p, quantity: p.quantity + exist.quantity }
                    else
                        return p
                }).concat(cartSession.products.filter(prod => !userCart.products.some(p => p.id === prod.id && p.variant_id === prod.variant_id)))

                await updateCart(userCartId, mergedProducts)

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
    updateCart,
    getCartById,
    getCartByUserId,
    mergeCarts,
}