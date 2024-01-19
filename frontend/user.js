import {
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore"
import { db, auth } from "../firebaseInit";
import MyError from "@/classes/MyError";
import { DONT_SHOW_POS_ADD } from "@/consts";

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
        throw new MyError({ message: `Erro ao obter usuário pelo ID: ${error.message}` });
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
                authUser: {
                    ...authUser,
                    preferences: localStorage.getItem(DONT_SHOW_POS_ADD)
                        ? [DONT_SHOW_POS_ADD]
                        : []
                },
            })
        }

        const response = await fetch('/api/users/user', options)
        const responseJson = await response.json()

        if (response.status >= 500)
            throw new MyError({ message: responseJson.message })
        if (response.status >= 300)
            throw new MyError({ message: responseJson.message, type: 'warning' })

        return responseJson.user
    } catch (error) {
        console.error('Error creating a new user:', error);
        throw error;
    }
}

async function updateUser(userId, changes) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()

            await updateDoc(userRef, { ...userData, ...changes })

            return { id: userDoc.id, ...userData, ...changes }
        } else {
            throw new MyError({ message: 'user_not_found' })
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

            return updatedQuests
        } else {
            console.error('User not found')
            throw new MyError({ message: 'user_not_found' })
        }
    } catch (error) {
        console.error('Error completing quest:', error)
        throw error
    }
}

export {
    getUserById,
    createNewUser,
    updateUser,
    getUserProvidersByEmail,
    completeQuest,
}