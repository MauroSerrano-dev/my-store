import MyError from "@/classes/MyError";
const admin = require('../firebaseAdminInit');

/**
 * Creates a new wishlist for a user.
 * @param {string} userId - The ID of the user for whom the wishlist is being created.
 * @returns {Promise<string>} The ID of the created wishlist document.
 */
async function createWishlist(userId) {
    try {
        const wishlistsCollectionRef = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_WISHLISTS);

        const now = admin.firestore.Timestamp.now();

        const newWishlist = {
            user_id: userId,
            products: [],
            created_at: now,
            updated_at: now,
        };

        const docRef = await wishlistsCollectionRef.add(newWishlist);

        return docRef.id;
    } catch (error) {
        console.error('Error creating wishlist:', error);
        throw new MyError({ message: 'Error creating wishlist' });
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
            throw new MyError({ message: 'wishlist_not_found' })
        }

        const wishlistDoc = querySnapshot.docs[0];
        const wishlistData = wishlistDoc.data();

        // Filter out the products that need to be deleted
        wishlistData.products = wishlistData.products.filter(prod => !productsIdsToDelete.includes(prod.id));

        // Update the wishlist document with the new products array
        await wishlistDoc.ref.update({ products: wishlistData.products });

        console.log(`Products successfully deleted from wishlist ${wishlistDoc.id}!`)
        return { id: wishlistDoc.id, ...wishlistData }
    } catch (error) {
        console.error('Error deleting products from the wishlist:', error);
        throw new MyError({ message: 'error_deleting_products_from_wishlist' })
    }
}

export {
    createWishlist,
    deleteProductsFromWishlist,
}