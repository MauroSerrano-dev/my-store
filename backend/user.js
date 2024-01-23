import { newUserModel } from "@/utils/models"
const admin = require('../firebaseAdminInit');
import MyError from "@/classes/MyError"

async function getUserById(id) {
    try {
        const firestore = admin.firestore()
        const userRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${id}`)
        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError({ message: `User with ID ${id} not found` })

        const userData = userDoc.data()
        console.log(`User with ID ${id} found!`)
        return { id: userDoc.id, ...userData }
    } catch (error) {
        console.error("Error getting user:", error)
        throw error
    }
}

/**
 * Retrieves the user ID associated with a given email address.
 * Queries the 'users' collection in Firestore to find a user document with the provided email.
 * 
 * @param {string} email - The email address to search for in the users collection.
 * @returns {Promise<string | null>} The user ID if found, or null if no user exists with the given email.
 */
async function getUserIdByEmail(email) {
    try {
        const usersCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_USERS);
        const q = usersCollection.where("email", "==", email);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting userId by email:", error);
        throw error;
    }
}

/**
 * Creates a new user using Google authentication details.
 * If the user does not already exist, creates a new user document in the 'users' collection.
 * Also creates a new cart and wishlist for the user.
 * 
 * @param {Object} authUser - The authenticated user object from Google.
 * @param {Object} cartProducts - The cart session ID from a cookie.
 * @returns {Promise<Object>} The new user object if created.
 */
async function createNewUser(authUser) {
    try {
        // Check if user with the same email already exists
        const userIdExists = await getUserIdByEmail(authUser.email);

        if (!userIdExists) {
            const fullName = authUser.displayName.split(' ');
            const firstName = fullName.length <= 1 ? authUser.displayName : fullName.slice(0, fullName.length - 1).join(' ');
            const lastName = fullName.length <= 1 ? null : fullName[fullName.length - 1];

            const now = admin.firestore.Timestamp.now()

            const newUser = newUserModel({
                email: authUser.email,
                first_name: firstName,
                last_name: lastName,
                preferences: authUser.preferences,
                email_verified: authUser.emailVerified,
                cart: { products: [], updated_at: now },
                wishlist: { products: [], updated_at: now },
            });

            newUser.create_at = admin.firestore.Timestamp.now()

            await admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_USERS).doc(authUser.uid).set(newUser);

            console.log(`${newUser.email} has been added as a new user`);
            return { id: authUser.uid, ...newUser };
        } else {
            console.log(`${authUser.email} already exists as a user`);
            throw new MyError({ message: `${authUser.email} already exists as a user` });
        }
    } catch (error) {
        console.error("Error creating a new user:", error);
        throw error;
    }
}

async function deleteUser(user_id) {
    try {
        const userRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${user_id}`)

        const userDoc = await userRef.get()

        if (!userDoc.exists)
            throw new MyError({ message: 'user_not_found' })

        const user = userDoc.data()

        const cartRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_CARTS}/${user.cart_id}`)

        const cartDoc = await cartRef.get()

        if (!cartDoc.exists)
            throw new MyError({ message: 'cart_not_found' })

        const wishlistRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_WISHLISTS}/${user.wishlist_id}`)

        const wishlistDoc = await wishlistRef.get()
        if (!wishlistDoc.exists)
            throw new MyError({ message: 'wishlist_not_found' })

        await admin.auth().deleteUser(user_id)
        await userRef.delete()
        await cartRef.delete()
        await wishlistRef.delete()

        console.log(`User with ID ${user_id} has been deleted successfully.`)
        return { id: userDoc.id, ...user }
    } catch (error) {
        console.error(`Error deleting user with ID ${user_id}:`, error)
        throw error
    }
}

async function getUsersInactiveForMonths(limit = 100, monthsInactive = 12) {
    if (typeof limit !== 'number') {
        throw new MyError({ message: 'Limit must be a number' });
    }
    if (typeof monthsInactive !== 'number') {
        throw new MyError({ message: 'Months Inactive must be a number' });
    }

    const firestore = admin.firestore();
    const inactiveSince = new Date();
    inactiveSince.setMonth(inactiveSince.getMonth() - monthsInactive);

    let inactiveUsers = [];
    let pageToken;

    do {
        const listUsersResult = await admin.auth().listUsers(limit, pageToken);
        for (const userRecord of listUsersResult.users) {
            const lastRefreshTime = new Date(userRecord.metadata.lastRefreshTime);
            if (lastRefreshTime < inactiveSince) {
                const userDocRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${userRecord.uid}`);
                const userDoc = await userDocRef.get();
                if (userDoc.exists && userDoc.data().orders_counter === 0) {
                    inactiveUsers.push(userRecord);
                }
            }
        }
        pageToken = listUsersResult.pageToken;
    } while (pageToken);

    return inactiveUsers;
}

async function deleteInactiveUsersForMonths(monthsInactive = 12) {
    try {
        // Define the date for inactivity threshold
        const inactiveSince = new Date();
        inactiveSince.setMonth(inactiveSince.getMonth() - monthsInactive);

        // Initialize Firestore and Admin Auth
        const firestore = admin.firestore();
        let pageToken;

        do {
            const listUsersResult = await admin.auth().listUsers(1000, pageToken);
            for (const userRecord of listUsersResult.users) {
                const lastRefreshTime = new Date(userRecord.metadata.lastRefreshTime);

                // Check if the user is inactive and has not made any purchases
                if (lastRefreshTime < inactiveSince) {
                    const userDocRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_USERS}/${userRecord.uid}`);
                    const userDoc = await userDocRef.get();

                    if (userDoc.exists && userDoc.data().orders_counter === 0) {
                        // Delete the user and their associated data
                        await deleteUser(userRecord.uid);
                    }
                }
            }

            pageToken = listUsersResult.pageToken;
        } while (pageToken);

        console.log('Inactive users deleted successfully');
    } catch (error) {
        console.error(`Error deleting inactive users: ${error}`);
        throw error;
    }
}

export {
    getUserById,
    getUserIdByEmail,
    deleteUser,
    createNewUser,
    getUsersInactiveForMonths,
    deleteInactiveUsersForMonths,
}