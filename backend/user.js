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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { firebaseConfig } from "../firebase.config"
import { createCart } from "./cart"
import { getCartSessionById, deleteCartSession } from "./cart-session"
import { DEFAULT_PRODUCTS_TAGS } from "../consts"
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

async function createNewUserWithCredentials(user) {
    try {
        // Verifique se o usuário com o mesmo e-mail já existe
        const userIdExists = await getUserIdByEmail(user.email)

        // Se o usuário não existir, crie um novo
        if (!userIdExists) {
            // Create a reference to the users collection
            const usersCollection = collection(db, process.env.COLL_USERS)

            // Create a session for the new user and return the session ID
            const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)

            // Add the new user to the collection with password encryption
            const newUserRef = doc(usersCollection, authenticatedUser.uid)

            const newUser = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                cart: [],
                providers: ['password'],
                email_verified: false,
                introduction_complete: false,
                home_page_tags: DEFAULT_PRODUCTS_TAGS,
                create_at: Timestamp.now(),
            }
            const cart_id = uuidv4()
            await createCart(newUserRef.id, cart_id, [])
            // Set the document for the new user
            await setDoc(newUserRef, { ...newUser, cart_id: cart_id })

            /* // Envie o e-mail de verificação
            sendEmailVerification(authenticatedUser)
                .then(() => {
                    // O e-mail de verificação foi enviado com sucesso
                    console.log(`Verification email sent to ${authenticatedUser.email}`);
                })
                .catch((error) => {
                    // Lidar com erros ao enviar o e-mail de verificação
                    console.error("Error sending verification email:", error);
                });
 */
            return {
                ...newUser,
                id: newUserRef.id
            };
        } else {
            console.log(`${user.email} already exists as a user.`)
            return null
        }
    } catch (error) {
        console.error("Error creating a new user and session:", error)
        throw error
    }
}

async function createNewUserWithGoogle(user, id, cart_cookie_id) {
    try {
        // Verifique se o usuário com o mesmo e-mail já existe
        const userIdExists = await getUserIdByEmail(user.email)

        // Se o usuário não existir, crie um novo
        if (!userIdExists) {
            // Create a reference to the users collection
            const usersCollection = collection(db, process.env.COLL_USERS)

            // Add the new user to the collection with password encryption
            const newUserRef = doc(usersCollection, id)

            const cartSession = await getCartSessionById(cart_cookie_id)
            await deleteCartSession(cart_cookie_id)

            const cart_id = uuidv4()
            await createCart(newUserRef.id, cart_id, cartSession ? cartSession.products : [])

            const newUser = {
                ...user,
                cart_id: cart_id,
                create_at: Timestamp.now(),
            }

            await setDoc(newUserRef, newUser)

            console.log(`${newUser.email} has been added as a new user.`)

            return newUser
        } else {
            console.log(`${user.email} already exists as a user.`)
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
                message: 'User updated successfully!',
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
            message: 'Error updating user.',
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

export {
    createNewUserWithCredentials,
    createNewUserWithGoogle,
    removeEmailVerifiedField,
    checkUserExistsByEmail,
    getUserById,
    updateField,
    updateUser,
    clearUpdateCounter,
}