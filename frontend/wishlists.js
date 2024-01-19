import {
    doc,
    getDoc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseInit";
import MyError from "@/classes/MyError";

async function getWishlistById(id) {
    try {
        const wishlistRef = doc(db, process.env.NEXT_PUBLIC_COLL_WISHLISTS, id)

        const wishlistDoc = await getDoc(wishlistRef)

        if (wishlistDoc.exists()) {
            return { id: wishlistDoc.id, ...wishlistDoc.data() };
        } else {
            console.error('Wishlist not found')
            throw new MyError({ message: 'Wishlist not found' })
        }
    } catch (error) {
        console.error('Error getting wishlist by ID:', error)
        throw new MyError({ message: 'Error getting wishlist by ID' })
    }
}

async function addProductToWishlist(wishlistId, product) {
    try {
        const wishlistRef = doc(db, process.env.NEXT_PUBLIC_COLL_WISHLISTS, wishlistId)
        const wishlistDoc = await getDoc(wishlistRef)
        const wishlistData = wishlistDoc.data()
        if (wishlistData.products.some(prod => prod.id === product.id)) {
            return wishlistData
        }

        const now = Timestamp.now()

        wishlistData.products.push({
            id: product.id,
            added_at: now
        })

        await updateDoc(wishlistRef, {
            ...wishlistData,
            updated_at: now
        })

        console.log('Wishlist updated successfully!')
        return { id: wishlistDoc.id, ...wishlistData }
    } catch (error) {
        console.error('Error updating wishlist:', error)
        throw error
    }
}

async function deleteProductFromWishlist(wishlistId, product) {
    try {
        const wishlistRef = doc(db, process.env.NEXT_PUBLIC_COLL_WISHLISTS, wishlistId)
        const wishlistDoc = await getDoc(wishlistRef)

        const wishlistData = wishlistDoc.data()

        wishlistData.products = wishlistData.products.filter(prod => prod.id !== product.id)

        await updateDoc(wishlistRef, {
            ...wishlistData,
            updated_at: Timestamp.now()
        })

        console.log('Wishlist updated successfully!')
        return { id: wishlistDoc.id, ...wishlistData }
    } catch (error) {
        console.error('Error Deleting Product from wishlist:', error)
        throw error
    }
}

export {
    getWishlistById,
    addProductToWishlist,
    deleteProductFromWishlist,
}