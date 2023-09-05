import {
    collection,
    doc,
    getDoc,
    setDoc,
    getFirestore,
} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

async function createNewUser(user) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS)

        // Add the new user to the collection with password encryption
        const newUserRef = doc(usersCollection)

        // Create a session for the new user and return the session ID
        const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)
        const sessionID = authenticatedUser.uid;

        // Set the document for the new user
        await setDoc(newUserRef,
            {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                uid: authenticatedUser.uid
            })

        console.log(`${user.email} has been added as a new user, and a session has been created.`)

        return sessionID
    } catch (error) {
        console.error("Error creating a new user and session:", error)
        throw error;
    }
}

async function createNewUserWithGoogle(user) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS)

        // Add the new user to the collection with password encryption
        const newUserRef = doc(usersCollection)

        // Set the document for the new user
        await setDoc(newUserRef, user)

        console.log(`${user.email} has been added as a new user, and a session has been created.`)

    } catch (error) {
        console.error("Error creating a new user and session:", error)
        throw error;
    }
}

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
    createNewUser,
    createNewUserWithGoogle,
    removeEmailVerifiedField
}