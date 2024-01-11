import {
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore"
import { db, auth } from "../firebaseInit";
import MyError from "@/classes/MyError";

async function getUserById(id) {
    try {
        const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, id)

        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists())
            return { id: userDoc.id, ...userDoc.data() }
        else
            return null
    } catch (error) {
        console.error('Erro ao obter usuário pelo ID:', error)
        throw new MyError(`Erro ao obter usuário pelo ID: ${error.message}`);
    }
}

async function createNewUser(authUser) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
            body: JSON.stringify({
                authUser: authUser,
            })
        }

        const response = await fetch('/api/users/user', options)
        const responseJson = await response.json()

        if (response.status >= 500)
            throw new MyError(responseJson.message, 'error')
        if (response.status >= 300)
            throw new MyError(responseJson.message, 'warning')

        return responseJson.user
    } catch (error) {
        console.error('Error creating a new user:', error);
        throw error;
    }
}

async function updateUser(userId, changes) {
    console.log(userId)
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()

            await updateDoc(userRef, { ...userData, ...changes })

            return { id: userDoc.id, ...userData, ...changes }
        } else {
            throw new MyError('user_not_found', 'error')
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}

async function getUserProvidersByEmail(email) {
    try {
        const providers = await fetchSignInMethodsForEmail(auth, email)

        return providers
    } catch (error) {
        console.error('Error fetching sign-in methods for email:', error)
        throw error
    }
}

export {
    getUserById,
    createNewUser,
    updateUser,
    getUserProvidersByEmail,
}