import {
    Timestamp,
    doc,
    getDoc,
    setDoc,
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
            return userDoc.data()
        else
            return null
    } catch (error) {
        console.error('Erro ao obter usuário pelo ID:', error)
        throw new Error(`Erro ao obter usuário pelo ID: ${error.message}`);
    }
}

async function createNewUserWithGoogle(authUser) {
    try {
        const fullName = authUser.displayName.split(' ')

        const firstName = fullName.length <= 1 ? authUser.displayName : fullName.slice(0, fullName.length - 1).join(' ')
        const lastName = fullName.length <= 1 ? null : fullName[fullName.length - 1]

        const newUserRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, authUser.uid)

        const cart_id = await createCart(newUserRef.id)

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

        return newUser
    } catch (error) {
        console.error('Error creating a new user and session:', error);
        throw new Error(`Error creating a new user and session: ${error.message}`);
    }
}

export {
    getUserById,
    createNewUserWithGoogle,
}