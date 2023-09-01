import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where, FieldValue } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config";

initializeApp(firebaseConfig)

const db = getFirestore()

async function removeEmailVerifiedField(userId) {
    try {
        const userRef = doc(db, process.env.COLL_USERS, userId); // Adjust the path accordingly

        // Get the existing user data
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
            const userData = userDoc.data()

            delete userData.emailVerified

            await setDoc(userRef, userData)

            console.log(`${userId} emailVerified field removed from the database`)
        } else {
            console.log(`${userId} User document not found`)
        }
    } catch (error) {
        console.error(`Error removing ${userId} emailVerified field from the database:`, error)
    }
}

export {
    removeEmailVerifiedField
}