import MyError from "@/classes/MyError";
const admin = require('../firebaseAdminInit');

/**
 * Creates a new cart for a user.
 * @param {string} userId - The ID of the user for whom the cart is being created.
 * @param {Array} products - Products to be included in the cart. Default is an empty array.
 * @returns {Promise<string>} The ID of the created cart document.
 */
async function createCart(userId, products = []) {
    try {
        const cartsCollectionRef = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_CARTS);

        const newCart = {
            user_id: userId,
            products: products,
            created_at: admin.firestore.Timestamp.now(),
        };

        const docRef = await cartsCollectionRef.add(newCart);

        return docRef.id;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
}

/**
 * Sets the products in a cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} cartProducts - The products to set in the cart.
 */
async function setCartProducts(cartId, cartProducts) {
    try {
        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_CARTS}/${cartId}`)

        await cartRef.update({ products: cartProducts });

        console.log(`Cart ${cartId} setted successfully!`)
    } catch (error) {
        console.error(`Error setting cart ${cartId}:`, error)
        throw new MyError({ message: 'error_setting_cart', type: 'error' })
    }
}

export {
    createCart,
    setCartProducts,
}