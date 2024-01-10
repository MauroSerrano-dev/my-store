import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    where,
    query,
    updateDoc,
    Timestamp,
} from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import { createCart } from "./cart"
import { createWishlist } from "./wishlists"
import { newUserModel } from "@/utils/models"
import Error from "next/error"
import { addUserDeleted } from "./app-settings"
const { v4: uuidv4 } = require('uuid')
const admin = require('../firebaseAdminInit');
import { db } from "../firebaseInit";

async function getUserIdByEmail(email) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_USERS);

        // Query the user with the provided email
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // If a document is returned, return the userId
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting userId by email:", error);
        throw error;
    }
}

async function createNewUserWithCredentials(user, userLanguage) {
    try {
        // Create a session for the new user and return the session ID
        const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)

        // Set display name for the authenticated user
        await updateProfile(authenticatedUser, {
            displayName: `${user.first_name} ${user.last_name}`
        })

        // Add the new user to the collection with password encryption
        const newUserRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, authenticatedUser.uid)

        const cart_id = uuidv4()
        await createCart(newUserRef.id, cart_id, [])

        const wishlist_id = uuidv4()
        await createWishlist(newUserRef.id, wishlist_id)

        const newUser = newUserModel({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            cart_id: cart_id,
            wishlist_id: wishlist_id,
            email_verified: false,
        })

        newUser.create_at = Timestamp.now()

        // Set the document for the new user
        await setDoc(newUserRef, newUser)

        // Envie o e-mail de verificação
        auth.languageCode = userLanguage
        sendEmailVerification(authenticatedUser, {
            url: process.env.NEXT_PUBLIC_URL.concat('/email-verification'),
            handleCodeInApp: true,
        })
            .then(() => {
                console.log(`Verification email sent to ${authenticatedUser.email}`)
            })
            .catch((error) => {
                console.error("Error sending verification email:", error)
            })

        return newUserRef.id
    } catch (error) {
        console.error("Error creating new user with credentials", error)
        throw error
    }
}

async function checkUserExistsByEmail(email) {
    try {
        const usersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_USERS);

        // Crie uma consulta para verificar se há um documento com o mesmo email
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // Se algum documento for retornado, isso significa que o usuário já existe
        if (!querySnapshot.empty) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
}

async function removeEmailVerifiedField(userId) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId); // Adjust the path accordingly

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

async function updateField(userId, fieldName, value) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()

            userData[fieldName] = value

            await updateDoc(userRef, userData)

            console.log(`User ${userId} field ${fieldName} updated successfully!`)

            const updatedUserDoc = await getDoc(userRef)

            return updatedUserDoc.data()
        } else {
            console.log(`User with id ${userId} not found.`)
        }
    } catch (error) {
        console.error(`Error updating field ${fieldName} for user ${userId}.`, error)
        throw error
    }
}

async function clearUpdateCounter() {
    try {
        const usersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_USERS)
        const usersQuery = query(usersCollection)
        const userDocs = await getDocs(usersQuery)

        const updatePromises = []

        userDocs.forEach((userDoc) => {
            const userData = userDoc.data()
            userData.update_counter = Timestamp.now()

            const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userDoc.id)

            updatePromises.push(setDoc(userRef, userData))
        })

        await Promise.all(updatePromises)

        console.log("The 'update_counter' field for all users has been set to zero successfully.")

        return {
            status: 200,
            message: "The 'update_counter' field for all users has been set to zero successfully.",
        }
    } catch (error) {
        console.error("Error clearing the 'update_counter' field for all users:", error)
        return {
            status: 500,
            message: "Error clearing the 'update_counter' field for all users.",
            error: error,
        }
    }
}

async function completeQuest(user_id, quest_id) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, user_id)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()
            const { quests } = userData

            // Update the quests array using map to modify the specific quest
            const updatedQuests = quests.filter(quest => quest !== quest_id)

            // Update the user document with the modified quests array
            await updateDoc(userRef, { quests: updatedQuests })

            console.log(`Quest ${quest_id} completed for user ${user_id}.`)
            return updatedQuests
        } else {
            console.error(`User ${user_id} not found.`)
            throw new MyError(`User ${user_id} not found.`)
        }
    } catch (error) {
        console.error(`Error completing quest for user ${user_id}: ${error}`)
        throw new MyError(`Error completing quest for user ${user_id}: ${error}`)
    }
}

async function deleteUser(user_id) {
    try {
        const userRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${user_id}`)

        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError({ title: 'user_not_found', type: 'error' })

        const user = userDoc.data()

        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_CARTS}/${user.cart_id}`)

        const cartDoc = await cartRef.get()

        if (!cartDoc.exists)
            throw new MyError({ title: 'cart_not_found', type: 'error' })

        const wishlistRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_WISHLISTS}/${user.wishlist_id}`)

        const wishlistDoc = await wishlistRef.get()
        if (!wishlistDoc.exists)
            throw new MyError({ title: 'wishlist_not_found', type: 'error' })

        await admin.auth().deleteUser(user_id)
        await userRef.delete()
        await cartRef.delete()
        await wishlistRef.delete()

        await addUserDeleted(user.email)

        console.log(`User with ID ${user_id} has been deleted successfully.`)
    } catch (error) {
        console.error(`Error deleting user with ID ${user_id}:`, error)
        throw error
    }
}

export {
    createNewUserWithCredentials,
    removeEmailVerifiedField,
    checkUserExistsByEmail,
    getUserIdByEmail,
    updateField,
    clearUpdateCounter,
    completeQuest,
    deleteUser
}