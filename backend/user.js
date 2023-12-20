import {
    collection,
    doc,
    getDoc,
    setDoc,
    getFirestore,
    getDocs,
    where,
    query,
    updateDoc,
    Timestamp,
} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail, updateProfile } from "firebase/auth"
import { firebaseConfig } from "../firebase.config"
import { createCart } from "./cart"
import { getCartSessionById, deleteCartSession } from "./cart-session"
import { DEFAULT_PRODUCTS_TAGS } from "@/consts"
import { createWishlist } from "./wishlists"
import { newUserModel } from "@/utils/models"
import Error from "next/error"
const { v4: uuidv4 } = require('uuid')

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

async function getUserIdByEmail(email) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS);

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

async function getUserById(id) {
    try {
        const userDocRef = doc(db, process.env.COLL_USERS, id)

        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
            return userDoc.data()
        } else {
            return null
        }
    } catch (error) {
        console.error("Erro ao obter usuário pelo ID:", error)
        throw error
    }
}

async function createNewUserWithCredentials(user, userLanguage) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS)

        // Create a session for the new user and return the session ID
        const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)

        // Set display name for the authenticated user
        await updateProfile(authenticatedUser, {
            displayName: `${user.first_name} ${user.last_name}`
        })

        // Add the new user to the collection with password encryption
        const newUserRef = doc(usersCollection, authenticatedUser.uid)

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
            quests: [],
            home_page_tags: DEFAULT_PRODUCTS_TAGS,
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

async function createNewUserWithGoogle(authUser, id, cart_cookie_id) {
    try {
        // Verifique se o usuário com o mesmo e-mail já existe
        const userIdExists = await getUserIdByEmail(authUser.email)

        // Se o usuário não existir, crie um novo
        if (!userIdExists) {
            const fullName = authUser.displayName.split(' ')

            const firstName = fullName.length <= 1 ? authUser.displayName : fullName.slice(0, fullName.length - 1).join(' ')
            const lastName = fullName.length <= 1 ? null : fullName[fullName.length - 1]

            // Create a reference to the users collection
            const usersCollection = collection(db, process.env.COLL_USERS)

            // Add the new user to the collection with password encryption
            const newUserRef = doc(usersCollection, id)

            const cartSession = await getCartSessionById(cart_cookie_id)
            await deleteCartSession(cart_cookie_id)

            const cart_id = uuidv4()
            await createCart(newUserRef.id, cart_id, cartSession ? cartSession.products : [])

            const wishlist_id = uuidv4()
            await createWishlist(newUserRef.id, wishlist_id)

            const newUser = newUserModel({
                email: authUser.email,
                first_name: firstName,
                last_name: lastName,
                cart_id: cart_id,
                wishlist_id: wishlist_id,
                quests: [],
                home_page_tags: DEFAULT_PRODUCTS_TAGS,
                email_verified: authUser.emailVerified,
            })

            newUser.create_at = Timestamp.now()

            await setDoc(newUserRef, newUser)

            console.log(`${newUser.email} has been added as a new user.`)

            return newUser
        } else {
            console.log(`${authUser.email} already exists as a user.`)
            return null;
        }
    } catch (error) {
        console.error("Error creating a new user and session:", error);
        throw error;
    }
}

async function checkUserExistsByEmail(email) {
    try {
        const usersCollection = collection(db, process.env.COLL_USERS);

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

async function updateField(userId, fieldName, value) {
    try {
        const userRef = doc(db, process.env.COLL_USERS, userId)
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

async function updateUser(userId, changes) {
    try {
        const userRef = doc(db, process.env.COLL_USERS, userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()

            await updateDoc(userRef, { ...userData, ...changes })

            return {
                status: 200,
                message: 'Profile updated successfully!',
            }
        } else {
            return {
                status: 404,
                message: 'User not found.',
            }
        }
    } catch (error) {
        return {
            status: 500,
            message: 'Error updating profile.',
            error: error,
        }
    }
}

async function clearUpdateCounter() {
    try {
        const usersCollection = collection(db, process.env.COLL_USERS)
        const usersQuery = query(usersCollection)
        const userDocs = await getDocs(usersQuery)

        const updatePromises = []

        userDocs.forEach((userDoc) => {
            const userData = userDoc.data()
            userData.update_counter = Timestamp.now()

            const userRef = doc(db, process.env.COLL_USERS, userDoc.id)

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

async function getUserProvidersByEmail(email) {
    try {
        const providers = await fetchSignInMethodsForEmail(auth, email)

        return providers
    } catch (error) {
        console.error(`Error fetching sign-in methods for email: ${error}`)
        throw new Error(`Error fetching sign-in methods for email: ${error}`)
    }
}

async function completeQuest(user_id, quest_id) {
    try {
        const userRef = doc(db, process.env.COLL_USERS, user_id)
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
            throw new Error(`User ${user_id} not found.`)
        }
    } catch (error) {
        console.error(`Error completing quest for user ${user_id}: ${error}`)
        throw new Error(`Error completing quest for user ${user_id}: ${error}`)
    }
}

export {
    createNewUserWithCredentials,
    createNewUserWithGoogle,
    removeEmailVerifiedField,
    checkUserExistsByEmail,
    getUserById,
    getUserIdByEmail,
    updateField,
    updateUser,
    clearUpdateCounter,
    getUserProvidersByEmail,
    completeQuest,
}