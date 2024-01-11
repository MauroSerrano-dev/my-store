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
import { createCart } from "./cart"
import { createWishlist } from "./wishlists"
import { newUserModel } from "@/utils/models"
import { addUserDeleted } from "./app-settings"
const admin = require('../firebaseAdminInit');
import { db } from "../firebaseInit";
import MyError from "@/classes/MyError"

/**
 * Retrieves the user ID associated with a given email address.
 * Queries the 'users' collection in Firestore to find a user document with the provided email.
 * 
 * @param {string} email - The email address to search for in the users collection.
 * @returns {Promise<string | null>} The user ID if found, or null if no user exists with the given email.
 * @throws {Error} Throws an error if there is an issue during the query.
 */
async function getUserIdByEmail(email) {
    try {
        const usersCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_USERS);
        const q = usersCollection.where("email", "==", email);
        const querySnapshot = await q.get();

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

/**
 * Creates a new user with given credentials in the Firestore database.
 * Additionally, it creates a new cart and wishlist for the user.
 * 
 * @param {Object} user - User object containing details like email, first name, last name, etc.
 * @returns {Promise<string>} The ID of the created user document.
 */
async function createNewUserWithCredentials(user) {
    try {
        const usersCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_USERS);
        const newUserRef = usersCollection.doc(user.id);

        const cart_id = await createCart(user.id, []);
        const wishlist_id = await createWishlist(user.id);

        const newUser = newUserModel({
            email: user.email,
            first_name: user.first_name,
            last_name: lastName,
            cart_id: cart_id,
            wishlist_id: wishlist_id,
            email_verified: false,
            create_at: admin.firestore.Timestamp.now()
        });

        await newUserRef.set(newUser);

        console.log("New user created with credentials");
        return newUserRef.id;
    } catch (error) {
        console.error("Error creating new user with credentials", error);
        throw error;
    }
}

/**
 * Creates a new user using Google authentication details.
 * If the user does not already exist, creates a new user document in the 'users' collection.
 * Also creates a new cart and wishlist for the user.
 * 
 * @param {Object} authUser - The authenticated user object from Google.
 * @param {Object} cartProducts - The cart session ID from a cookie.
 * @returns {Promise<Object>} The new user object if created.
 */
async function createNewUser(authUser) {
    try {
        // Check if user with the same email already exists
        const userIdExists = await getUserIdByEmail(authUser.email);

        if (!userIdExists) {
            const fullName = authUser.displayName.split(' ');
            const firstName = fullName.length <= 1 ? authUser.displayName : fullName.slice(0, fullName.length - 1).join(' ');
            const lastName = fullName.length <= 1 ? null : fullName[fullName.length - 1];

            const cart_id = await createCart(authUser.uid);

            const wishlist_id = await createWishlist(authUser.uid);

            const newUser = newUserModel({
                email: authUser.email,
                first_name: firstName,
                last_name: lastName,
                cart_id: cart_id,
                wishlist_id: wishlist_id,
                email_verified: authUser.emailVerified,
                create_at: admin.firestore.Timestamp.now()
            });

            await admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_USERS).doc(authUser.uid).set(newUser);

            console.log(`${newUser.email} has been added as a new user.`);
            return { id: authUser.uid, ...newUser };
        } else {
            console.log(`${authUser.email} already exists as a user.`);
            throw new MyError(`${authUser.email} already exists as a user.`);
        }
    } catch (error) {
        console.error("Error creating a new user:", error);
        throw error;
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
        console.error('Error completing quest:', error)
        throw error
    }
}

async function deleteUser(user_id) {
    try {
        const userRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${user_id}`)

        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError('user_not_found')

        const user = userDoc.data()

        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_CARTS}/${user.cart_id}`)

        const cartDoc = await cartRef.get()

        if (!cartDoc.exists)
            throw new MyError('cart_not_found')

        const wishlistRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_WISHLISTS}/${user.wishlist_id}`)

        const wishlistDoc = await wishlistRef.get()
        if (!wishlistDoc.exists)
            throw new MyError('wishlist_not_found')

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
    deleteUser,
    createNewUser,
}