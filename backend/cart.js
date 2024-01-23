import MyError from "@/classes/MyError";
const admin = require('../firebaseAdminInit');

/**
 * Sets the products in a cart.
 * @param {string} user_id - The ID of the user.
 * @param {Array} cartProducts - The products to set in the cart.
 */
async function setCartProducts(user_id, cartProducts) {
    try {
        const firestore = admin.firestore()
        const userRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${user_id}`)
        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError({ message: `User with ID ${user_id} not found` })

        await userDoc.ref.update({
            cart: {
                products: cartProducts,
                updated_at: admin.firestore.Timestamp.now()
            }
        })

        console.log(`User ${user_id} cart setted successfully!`)
    } catch (error) {
        console.error(`Error setting user ${user_id} cart:`, error)
        throw new MyError({ message: 'error_setting_cart', type: 'error' })
    }
}

export {
    setCartProducts,
}