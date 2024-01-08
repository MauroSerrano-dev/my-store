import { doc, getDoc, updateDoc, Timestamp, setDoc, getDocs, query, collection, where, deleteDoc } from "firebase/firestore";
import Error from "next/error";
import { db } from "../firebaseInit";

async function createWishlist(userId, wishlistId) {
    try {
        const wishlistRef = doc(db, process.env.COLL_WISHLISTS, wishlistId)

        const docSnapshot = await getDoc(wishlistRef)

        if (docSnapshot.exists()) {
            return {
                status: 409,
                message: `Wishlist ID ${wishlistId} already exists.`,
            }
        }

        const newWishlist = {
            id: wishlistId,
            user_id: userId,
            products: [],
            created_at: Timestamp.now(),
        }

        await setDoc(wishlistRef, newWishlist)

        console.log(`Wishlist created with ID: ${wishlistId}`)
        return wishlistId
    } catch (error) {
        console.error("Error creating wishlist:", error)
        return null
    }
}

async function deleteProductsFromWishlist(user_id, productsIdsToDelete) {
    try {
        const wishlistQuery = query(
            collection(db, process.env.COLL_WISHLISTS),
            where("user_id", "==", user_id)
        )
        const querySnapshot = await getDocs(wishlistQuery);

        if (querySnapshot.empty) {
            return {
                status: 404,
                message: `Wishlist for user ID ${user_id} not found.`,
                wishlist: null,
            }
        }

        const wishlistDoc = querySnapshot.docs[0];
        const wishlistData = wishlistDoc.data();

        wishlistData.products = wishlistData.products.filter(prod => !productsIdsToDelete.includes(prod.id))

        await updateDoc(wishlistDoc.ref, wishlistData)

        return {
            status: 200,
            message: `Products deleted from the wishlist successfully!`,
            wishlist: wishlistData,
        }
    } catch (error) {
        console.error(`Error deleting products from the wishlist: ${error}`)
        throw new Error(`Error deleting products from the wishlist: ${error}`)
    }
}

export {
    createWishlist,
    deleteProductsFromWishlist,
}