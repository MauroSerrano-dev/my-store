import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

// Function to update the "cart" field of a user
async function setUserCart(userId, cart) {
    // Get a reference to the user's document using the provided userId
    const userRef = doc(db, process.env.COLL_USERS, userId)

    try {
        // Update the "cart" field in the user's document
        await updateDoc(userRef, { cart: cart })

        console.log(`User ${userId} cart updated successfully!`)
    } catch (error) {
        console.error(`Error updating user ${userId} cart:`, error)
    }
}

export {
    setUserCart,
}