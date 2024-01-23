import MyError from "@/classes/MyError";
const admin = require('../firebaseAdminInit');

/**
 * Deletes specified products from a user's wishlist.
 * 
 * @param {string} user_id - The ID of the user whose wishlist is being modified.
 * @param {Array} productsIdsToDelete - Array of product IDs to be deleted from the wishlist.
 * @returns {object} - Updated wishlist.
 */
async function deleteProductsFromWishlist(user_id, productsIdsToDelete) {
    try {
        const firestore = admin.firestore()
        const userRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${user_id}`)
        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError({ message: `User with ID ${user_id} not found` })

        const userData = userDoc.data()

        await userDoc.ref.update({
            wishlist: {
                products: userData.products.filter(prod => !productsIdsToDelete.includes(prod.id)),
                updated_at: admin.firestore.Timestamp.now()
            }
        })

        console.log(`Products successfully deleted from user {${user_id}} wishlist!`)
    } catch (error) {
        console.error('Error deleting products from the wishlist:', error);
        throw new MyError({ message: 'error_deleting_products_from_wishlist' })
    }
}

export {
    deleteProductsFromWishlist,
}