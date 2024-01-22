import MyError from '@/classes/MyError';

const admin = require('../firebaseAdminInit')

/**
 * Retrieves currency information by its ID.
 * 
 * @param {string} currencyId - The ID of the currency to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the currency data if found.
 */
async function getCurrencyById(currencyId) {
    try {
        const currRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_APP_SETTINGS}/currencies`);

        const currDoc = await currRef.get();
        if (currDoc.exists) {
            const currenciesData = currDoc.data().data;

            const currency = currenciesData[currencyId];

            if (currency)
                return currency;
            else
                throw new MyError({ message: `Currency with ID ${currencyId} not found` });
        }
        else
            throw new MyError({ message: `Currency collection not found` });
    } catch (error) {
        console.error('Error getting currency by ID:', error);
        throw error;
    }
}

async function updateAllCurrencies(updatedCurrencies) {
    try {
        const currRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_APP_SETTINGS}/currencies`)

        await currRef.set({
            data: updatedCurrencies,
            updated_at: admin.firestore.Timestamp.now()
        })

        console.log('Currencies updated successfully!')
    } catch (error) {
        console.error('Error updating currencies:', error)
        throw error
    }
}

async function addUserDeleted(email) {
    try {
        const settingsRef = admin.firestore().doc(`app_settings/deleted_users`);

        const settingsDoc = await settingsRef.get();
        if (settingsDoc.exists) {
            await settingsRef.update({
                data: admin.firestore.FieldValue.arrayUnion({ email: email, deleted_at: admin.firestore.Timestamp.now() })
            });
        } else {
            await settingsRef.set({
                data: [{ email: email, deleted_at: admin.firestore.Timestamp.now() }]
            });
        }
        console.log('Deleted users updated successfully!');
    } catch (error) {
        console.error('Error adding user to deleted_users:', error)
        throw error
    }
}

async function clearDeletedUsers() {
    try {
        const settingsRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_APP_SETTINGS}/deleted_users`);

        const settingsDoc = await settingsRef.get();
        if (settingsDoc.exists) {
            const data = settingsDoc.data().data;
            const thirtyDaysAgo = admin.firestore.Timestamp.now().seconds - (30 * 24 * 60 * 60);

            const updatedData = data.filter(user => user.deleted_at.seconds > thirtyDaysAgo);

            await settingsRef.update({
                data: updatedData,
                updated_at: admin.firestore.Timestamp.now()
            });
            console.log('Deleted users cleaned successfully!');
        }
    } catch (error) {
        console.error("Error clearing old deleted users:", error);
        throw error
    }
}

async function handleStripeWebhookFail(callId) {
    try {
        const ordersInfoRef = admin.firestore().doc('app_settings/orders_info');
        const ordersInfoDoc = await ordersInfoRef.get();

        if (ordersInfoDoc.exists) {
            await ordersInfoRef.update({
                orders_failed: admin.firestore.FieldValue.arrayUnion({
                    stripe_call_id: callId,
                    created_at: admin.firestore.Timestamp.now()
                })
            });
        } else {
            await ordersInfoRef.set({
                orders_failed: [{
                    stripe_call_id: callId,
                    created_at: admin.firestore.Timestamp.now()
                }]
            });
        }

        console.log('Order failure recorded successfully!')
    } catch (error) {
        console.error('Error recording order failure:', error);
        throw error
    }
}

/**
 * Checks if an email is in the list of prohibited emails.
 * This function looks up the 'deleted_users' document in the 'app_settings' collection
 * to see if the provided email is listed there.
 * 
 * @param {string} email - The email to check against the prohibited list.
 * @returns {Promise<boolean>} True if the email is prohibited, false otherwise.
 */
async function emailIsProhibited(email) {
    try {
        const settingsRef = admin.firestore().doc(`${process.env.NEXT_PUBLIC_COLL_APP_SETTINGS}/deleted_users`);
        const settingsDoc = await settingsRef.get();

        if (settingsDoc.exists && settingsDoc.data().data) {
            const prohibitedEmails = settingsDoc.data().data.map(item => item.email);
            return prohibitedEmails.includes(email);
        }
        return false;
    } catch (error) {
        console.error("Error checking if email is prohibited:", error);
        throw error;
    }
}

export {
    getCurrencyById,
    updateAllCurrencies,
    addUserDeleted,
    clearDeletedUsers,
    handleStripeWebhookFail,
    emailIsProhibited,
}