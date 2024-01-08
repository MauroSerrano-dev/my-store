import {
    doc,
    getDoc,
    updateDoc,
    Timestamp,
    collection,
    addDoc
} from "firebase/firestore";
import { db } from "../firebaseInit";
import Error from "next/error";

async function getWishlistById(id) {
    try {
        const wishlistRef = doc(db, process.env.NEXT_PUBLIC_COLL_WISHLISTS, id)

        const wishlistDoc = await getDoc(wishlistRef)

        if (wishlistDoc.exists()) {
            return { id: wishlistDoc.id, ...wishlistDoc.data() };
        } else {
            console.error('Wishlist not found')
            throw new Error('Wishlist not found')
        }
    } catch (error) {
        console.error('Error getting wishlist by ID:', error)
        throw new Error('Error getting wishlist by ID')
    }
}

async function createWishlist(userId) {
    try {
        const wishlistsCollectionRef = collection(db, process.env.NEXT_PUBLIC_COLL_WISHLISTS);

        const now = Timestamp.now()

        const newWishlist = {
            user_id: userId,
            products: [],
            created_at: now,
            updated_at: now,
        }

        const docRef = await addDoc(wishlistsCollectionRef, newWishlist)

        console.log(`Wishlist created with ID: ${docRef.id}`)
        return docRef.id
    } catch (error) {
        console.error('Error creating wishlist:', error)
        throw new Error('Error creating wishlist')
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
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
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
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

export {
    getWishlistById,
    createWishlist,
    addProductToWishlist,
    deleteProductFromWishlist,
}