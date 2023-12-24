import { doc, getDoc, getFirestore, updateDoc, Timestamp, setDoc, getDocs, query, collection, where, deleteDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import { mergeProducts } from "@/utils";
import Error from "next/error";

initializeApp(firebaseConfig)

const db = getFirestore()

async function getWishlistById(id) {
    const wishlistRef = doc(db, process.env.COLL_WISHLISTS, id)

    try {
        const wishlistDoc = await getDoc(wishlistRef)

        if (wishlistDoc.exists()) {
            return wishlistDoc.data()
        } else {
            console.log("Wishlist not found")
            return null
        }
    } catch (error) {
        console.error("Error getting wishlist by ID:", error)
        return null
    }
}

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

async function addProductToWishlist(wishlistId, wishlistNewProduct) {
    const wishlistRef = doc(db, process.env.COLL_WISHLISTS, wishlistId)
    const wishlistDoc = await getDoc(wishlistRef)

    try {
        const wishlistData = wishlistDoc.data()
        if (wishlistData.products.some(prod => prod.id === wishlistNewProduct.id)) {
            return {
                status: 200,
                message: `Product is already in Wishlist ${wishlistId}.`,
                wishlist: wishlistData,
            }
        }

        wishlistData.products.push(wishlistNewProduct)

        await updateDoc(wishlistRef, wishlistData)

        return {
            status: 200,
            message: `Wishlist ${wishlistId} updated successfully!`,
            wishlist: wishlistData,
        }
    } catch (error) {
        console.error(`Error updating wishlist ${wishlistId}:`, error)
        return {
            status: 500,
            message: `Error updating wishlist ${wishlistId}: ${error}`,
            wishlist: null,
            error: error,
        }
    }
}

async function deleteProductFromWishlist(wishlistId, product) {
    const wishlistRef = doc(db, process.env.COLL_WISHLISTS, wishlistId)
    const wishlistDoc = await getDoc(wishlistRef)

    try {
        const wishlistData = wishlistDoc.data()

        wishlistData.products = wishlistData.products.filter(prod => prod.id !== product.id)

        await updateDoc(wishlistRef, wishlistData)

        return {
            status: 200,
            message: `Wishlist ${wishlistId} updated successfully!`,
            wishlist: wishlistData,
        }
    } catch (error) {
        console.error(`Error Deleting Product from wishlist ${wishlistId}: ${error}`)
        return {
            status: 500,
            message: `Error Deleting Product from wishlist ${wishlistId}: ${error}`,
            wishlist: null,
            error: error,
        }
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

/**
 * Deletes a wishlist by its ID.
 * @param {string} wishlistId - The ID of the wishlist to be deleted.
 */
async function deleteWishlist(wishlistId) {
    try {
        const wishlistRef = doc(db, process.env.COLL_WISHLISTS, wishlistId)

        await deleteDoc(wishlistRef)

        console.log(`Wishlist with ID ${wishlistId} has been deleted successfully.`)
    } catch (error) {
        console.error(`Error deleting wishlist with ID ${wishlistId}:`, error)
        throw new Error(`Error deleting wishlist with ID ${wishlistId}: ${error}`)
    }
}

export {
    getWishlistById,
    createWishlist,
    addProductToWishlist,
    deleteProductFromWishlist,
    deleteProductsFromWishlist,
    deleteWishlist
}