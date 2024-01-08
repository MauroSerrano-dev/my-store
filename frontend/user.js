import {
    Timestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore"
import { db } from "../firebaseInit";
import { createCart } from "./cart";
import { createWishlist } from "./wishlists";
import { newUserModel } from "@/utils/models";
import Error from "next/error";

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
        throw new Error(`Erro ao obter usuário pelo ID: ${error.message}`);
    }
}

async function createNewUserWithGoogle(authUser, cartProducts = []) {
    try {
        const fullName = authUser.displayName.split(' ')

        const firstName = fullName.length <= 1 ? authUser.displayName : fullName.slice(0, fullName.length - 1).join(' ')
        const lastName = fullName.length <= 1 ? null : fullName[fullName.length - 1]

        const newUserRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, authUser.uid)

        const cart_id = await createCart(newUserRef.id, cartProducts)

        const wishlist_id = await createWishlist(newUserRef.id)

        const newUser = newUserModel({
            email: authUser.email,
            first_name: firstName,
            last_name: lastName,
            cart_id: cart_id,
            wishlist_id: wishlist_id,
            email_verified: authUser.emailVerified,
        })

        newUser.create_at = Timestamp.now()

        await setDoc(newUserRef, newUser)

        console.log(`${newUser.email} has been added as a new user.`)

        return { id: authUser.uid, ...newUser }
    } catch (error) {
        console.error('Error creating a new user and session:', error);
        throw new Error(`Error creating a new user and session: ${error.message}`);
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
            throw new Error({ title: 'user_not_found', type: 'error' })
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

async function getUserProvidersByEmail(email) {
    try {
        const providers = await fetchSignInMethodsForEmail(auth, email)

        return providers
    } catch (error) {
        console.error('Error fetching sign-in methods for email:', error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

export {
    getUserById,
    createNewUserWithGoogle,
    updateUser,
    getUserProvidersByEmail,
}