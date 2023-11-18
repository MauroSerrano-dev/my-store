import { arrayUnion, collection, doc, addDoc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where, deleteDoc, Timestamp } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { mergeProducts } from "../utils";

initializeApp(firebaseConfig)

const db = getFirestore()

async function getCartSessionById(id) {
    try {
        const cartRef = doc(db, process.env.COLL_CARTS_SESSION, id)

        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
            return cartDoc.data()
        } else {
            console.log("Cart Session not found. We create new one.")
            const newCartId = await createCartSession(id, [])
            return getCartSessionById(newCartId)
        }
    } catch (error) {
        console.error("Error getting Cart Session by ID:", error)
        return null
    }
}

async function deleteCartSession(id) {
    const cartRef = doc(db, process.env.COLL_CARTS_SESSION, id);

    try {
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
            await deleteDoc(cartRef);

            console.log(`Cart Session with ID ${id} deleted successfully!`);
        } else {
            console.log(`Cart Session with ID ${id} not found.`);
        }
    } catch (error) {
        console.error(`Error deleting Cart Session with ID ${id}:`, error);
    }
}

async function createCartSession(cartId, products) {
    try {
        const cartRef = doc(db, process.env.COLL_CARTS_SESSION, cartId)

        const docSnapshot = await getDoc(cartRef)

        if (docSnapshot.exists()) {
            return {
                status: 409,
                message: `Cart Session ID ${cartId} already exists.`,
            }
        }

        const now = Timestamp.now()

        const newCartSession = {
            id: cartId,
            products: products,
            created_at: now,
            expire_at: Timestamp.fromMillis(now.toMillis() + 7 * 24 * 60 * 60 * 1000)
        }

        await setDoc(cartRef, newCartSession)

        console.log(`Cart Session created with ID: ${cartId}`);
        return cartId;
    } catch (error) {
        console.error("Error creating Cart Session:", error);
        return null;
    }
}

async function setCartSessionProducts(cartId, cartProducts) {
    const userRef = doc(db, process.env.COLL_CARTS_SESSION, cartId)
    const cartDoc = await getDoc(userRef);

    try {
        const cartData = cartDoc.data()

        cartData.products = cartProducts

        const now = Timestamp.now()
        cartData.expire_at = Timestamp.fromMillis(now.toMillis() + 7 * 24 * 60 * 60 * 1000)

        await updateDoc(userRef, cartData)

        console.log(`Cart Session ${cartId} setted successfully!`)
    } catch (error) {
        console.error(`Error setting Cart Session ${cartId}:`, error)
    }
}

async function addProductsToCartSession(cartId, cartNewProducts) {
    const userRef = doc(db, process.env.COLL_CARTS_SESSION, cartId)
    const cartDoc = await getDoc(userRef)

    try {
        const cartData = cartDoc.data()

        cartData.products = mergeProducts(cartData.products, cartNewProducts)
        const now = Timestamp.now()
        cartData.expire_at = Timestamp.fromMillis(now.toMillis() + 7 * 24 * 60 * 60 * 1000)

        await updateDoc(userRef, cartData)

        return {
            status: 200,
            message: `Cart Session ${cartId} updated successfully!`,
            cart: cartData,
        }
    } catch (error) {
        return {
            status: 500,
            message: `Error updating Cart Session ${cartId}: ${error}`,
            cart: null,
            error: error,
        }
    }
}

async function deleteProductFromCartSession(cartId, product) {
    const userRef = doc(db, process.env.COLL_CARTS_SESSION, cartId)
    const cartDoc = await getDoc(userRef)

    try {
        const cartData = cartDoc.data()

        cartData.products = cartData.products.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant_id)
        const now = Timestamp.now()
        cartData.expire_at = Timestamp.fromMillis(now.toMillis() + 7 * 24 * 60 * 60 * 1000)

        await updateDoc(userRef, cartData)

        return {
            status: 200,
            message: `Cart Session ${cartId} updated successfully!`,
            cart: cartData,
        }
    } catch (error) {
        console.error(`Error Deleting Product from Cart Session ${cartId}: ${error}`)
        return {
            status: 500,
            message: `Error Deleting Product from Cart Session ${cartId}: ${error}`,
            cart: null,
            error: error,
        }
    }
}

async function deleteExpiredCartSessions() {
    const cartsCollectionRef = collection(db, process.env.COLL_CARTS_SESSION);
    const now = Timestamp.now();

    try {
        const querySnapshot = await getDocs(cartsCollectionRef);
        
        querySnapshot.forEach(async (doc) => {
            const cartData = doc.data();
            if (cartData.expire_at && cartData.expire_at.toMillis() < now.toMillis()) {
                await deleteDoc(doc.ref);
                console.log(`Cart Session with ID ${doc.id} expired and was deleted.`);
            }
        });
    } catch (error) {
        console.error("Error deleting expired Cart Sessions:", error);
    }
}

export {
    createCartSession,
    setCartSessionProducts,
    getCartSessionById,
    deleteCartSession,
    addProductsToCartSession,
    deleteProductFromCartSession,
    deleteExpiredCartSessions
}