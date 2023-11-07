import { arrayUnion, collection, doc, addDoc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where, deleteDoc, Timestamp } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getCartSessionById(id) {
    const cartRef = doc(db, process.env.COLL_CARTS_SESSION, id)

    try {
        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
            return cartDoc.data()
        } else {
            console.log("Cart Session not found")
            await createCartSession([], id)
            return await getCartSessionById(id)
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

async function createCartSession(products, id = null) {
    const cartsRef = id ? doc(db, process.env.COLL_CARTS_SESSION, id) : collection(db, process.env.COLL_CARTS_SESSION);

    try {
        if (id) {
            // Usando o ID personalizado
            await setDoc(cartsRef, {
                products: products,
                created_at: Timestamp.now(),
            });
        } else {
            // O Firestore gera automaticamente um ID
            const newCartDocRef = await addDoc(cartsRef, {
                products: products,
                created_at: Timestamp.now(),
            });

            console.log(`Cart Session created with ID: ${newCartDocRef.id}`);
            return newCartDocRef.id;
        }

        console.log(`Cart Session created with ID: ${id}`);
        return id;
    } catch (error) {
        console.error("Error creating Cart Session:", error);
        return null;
    }
}

async function updateCartSessionProducts(cartId, cart) {
    const userRef = doc(db, process.env.COLL_CARTS_SESSION, cartId)
    const cartDoc = await getDoc(userRef);

    try {
        const cartData = cartDoc.data()

        cartData.products = cart

        await updateDoc(userRef, cartData)

        console.log(`Cart Session ${cartId} updated successfully!`)
    } catch (error) {
        console.error(`Error updating Cart Session ${cartId}:`, error)
    }
}

export {
    createCartSession,
    updateCartSessionProducts,
    getCartSessionById,
    deleteCartSession,
}