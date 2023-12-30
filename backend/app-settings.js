import {
    Timestamp,
    arrayUnion,
    doc,
    getDoc,
    getFirestore,
    setDoc,
    updateDoc,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import Error from "next/error"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllCurrencies() {
    try {
        const currRef = doc(db, process.env.COLL_APP_SETTINGS, 'currencies')
        const currDoc = await getDoc(currRef)

        if (currDoc.exists()) {
            console.error("Currencies retrieved successfully.")
            return currDoc.data()
        } else {
            console.error("Currencies document does not exist.")
            return null
        }
    } catch (error) {
        console.error("Error retrieving currencies:", error)
        return null
    }
}

async function updateAllCurrencies(updatedCurrencies) {
    try {
        const currRef = doc(db, process.env.COLL_APP_SETTINGS, 'currencies')

        await setDoc(currRef, {
            data: updatedCurrencies,
            updated_at: Timestamp.now()
        })

        console.log('Currencies updated successfuly!')
        return
    } catch (error) {
        console.error("Error updating currencies:", error)
        return null
    }
}

async function addUserDeleted(email) {
    try {
        const settingsRef = doc(db, process.env.COLL_APP_SETTINGS, 'deleted_users');

        const settingsDoc = await getDoc(settingsRef);
        if (settingsDoc.exists()) {
            // Se o documento existe, mas o array 'data' não, inicialize-o
            const settingsData = settingsDoc.data();
            const updatedData = settingsData.data ? settingsData.data : [];

            await updateDoc(settingsRef, {
                data: arrayUnion(...updatedData, { email: email, deleted_at: Timestamp.now() })
            });
        } else {
            // Se o documento não existe, crie-o com o array 'data'
            await setDoc(settingsRef, {
                data: [{ email: email, deleted_at: Timestamp.now() }]
            });
        }
        console.log('Deleted users updated successfuly!');
    } catch (error) {
        console.error("Error adding user to deleted_users:", error);
        throw new Error(`Error adding user to deleted_users: ${error}`);
    }
}


async function clearDeletedUsers() {
    try {
        const settingsRef = doc(db, process.env.COLL_APP_SETTINGS, 'deleted_users');

        const settingsDoc = await getDoc(settingsRef);
        if (settingsDoc.exists()) {
            const data = settingsDoc.data().data;
            const thirtyDaysAgo = Timestamp.now().seconds - (30 * 24 * 60 * 60);

            const updatedData = data.filter(user => user.deleted_at.seconds > thirtyDaysAgo)

            await updateDoc(
                settingsRef,
                {
                    data: updatedData,
                    updated_at: Timestamp.now()
                }
            )
            console.log('Deleted users cleaned successfuly!')
        }
    } catch (error) {
        console.error("Error clearing old deleted users:", error);
        throw new Error(`Error clearing old deleted users: ${error}`);
    }
}

async function emailIsProhibited(email) {
    try {
        const settingsRef = doc(db, process.env.COLL_APP_SETTINGS, 'deleted_users');
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists() && settingsDoc.data().data) {
            const prohibitedEmails = settingsDoc.data().data.map(item => item.email);
            return prohibitedEmails.includes(email);
        }
        return false;
    } catch (error) {
        console.error("Error checking if email is prohibited:", error);
        throw new Error(`Error checking if email is prohibited: ${error}`);
    }
}

async function handleStripeWebhookFail(callId) {
    try {
        const ordersInfoRef = doc(db, process.env.COLL_APP_SETTINGS, 'orders_info');
        const ordersInfoDoc = await getDoc(ordersInfoRef);

        if (ordersInfoDoc.exists()) {
            await updateDoc(ordersInfoRef, {
                orders_failed: arrayUnion({
                    stripe_call_id: callId,
                    created_at: Timestamp.now()
                })
            });
        } else {
            await setDoc(ordersInfoRef, {
                orders_failed: [{
                    stripe_call_id: callId,
                    created_at: Timestamp.now()
                }]
            });
        }

        console.log('Order failure recorded successfully!');
    } catch (error) {
        console.error("Error recording order failure:", error);
        throw new Error(`Error recording order failure: ${error}`);
    }
}

export {
    updateAllCurrencies,
    getAllCurrencies,
    addUserDeleted,
    clearDeletedUsers,
    emailIsProhibited,
    handleStripeWebhookFail,
}