import {
    doc,
    getDoc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseInit";

async function addProductToWishlist(userId, product) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        if (userData.wishlist.products.some(prod => prod.id === product.id)) {
            return userData
        }

        const now = Timestamp.now()

        await updateDoc(userRef, {
            wishlist: {
                products: userData.wishlist.products.concat({ id: product.id, added_at: now }),
                updated_at: now,
            }
        })

        if (process.env.NEXT_PUBLIC_ENV === 'development')
            console.log('Wishlist updated successfully!')
        return { id: userDoc.id, ...userData }
    } catch (error) {
        console.error('Error updating wishlist:', error)
        throw error
    }
}

async function deleteProductFromWishlist(userId, product) {
    try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_COLL_USERS, userId)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        await updateDoc(userRef, {
            wishlist: {
                products: userData.wishlist.products.filter(prod => prod.id !== product.id),
                updated_at: Timestamp.now(),
            }
        })

        if (process.env.NEXT_PUBLIC_ENV === 'development')
            console.log('Wishlist updated successfully!')
        return { id: userDoc.id, ...userData }
    } catch (error) {
        console.error('Error Deleting Product from wishlist:', error)
        throw error
    }
}

export {
    addProductToWishlist,
    deleteProductFromWishlist,
}