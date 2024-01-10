import { doc, getDoc, Timestamp, setDoc } from "firebase/firestore";
import { db } from "../firebaseInit";
import MyError from "@/classes/MyError";

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

/**
 * Deletes specified products from a user's wishlist.
 * 
 * @param {string} user_id - The ID of the user whose wishlist is being modified.
 * @param {Array} productsIdsToDelete - Array of product IDs to be deleted from the wishlist.
 * @returns {object} - Updated wishlist.
 */
async function deleteProductsFromWishlist(user_id, productsIdsToDelete) {
    try {
        const wishlistQuery = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_WISHLISTS)
            .where("user_id", "==", user_id);
        const querySnapshot = await wishlistQuery.get();

        if (querySnapshot.empty) {
            console.error(`Wishlist for user ID ${user_id} not found`)
            throw new MyError('wishlist_not_found', 'error')
        }

        const wishlistDoc = querySnapshot.docs[0];
        const wishlistData = wishlistDoc.data();

        // Filter out the products that need to be deleted
        wishlistData.products = wishlistData.products.filter(prod => !productsIdsToDelete.includes(prod.id));

        // Update the wishlist document with the new products array
        await wishlistDoc.ref.update({ products: wishlistData.products });

        return { id: wishlistDoc.id, ...wishlistData }
    } catch (error) {
        console.error('Error deleting products from the wishlist:', error);
        throw new MyError('error_deleting_products_from_wishlist', 'error')
    }
}

export {
    createWishlist,
    deleteProductsFromWishlist,
}