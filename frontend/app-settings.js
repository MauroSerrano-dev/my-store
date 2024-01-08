import {
    doc,
    getDoc,
    collection,
    getDocs,
} from "firebase/firestore"
import Error from "next/error"
import { db } from "../firebaseInit"

async function getAppSettings() {
    try {
        const settingsCollectionRef = collection(db, process.env.NEXT_PUBLIC_COLL_APP_SETTINGS);

        // Executando a consulta para obter todos os documentos na coleção de configurações
        const querySnapshot = await getDocs(settingsCollectionRef);

        const allSettings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (allSettings.length > 0) {
            console.log('Settings collections retrieved successfully.');
            return allSettings;
        } else {
            console.log('No settings found in the collection.');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving settings collections:', error);
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

async function getAllCurrencies() {
    try {
        const currRef = doc(db, process.env.NEXT_PUBLIC_COLL_APP_SETTINGS, 'currencies')
        const currDoc = await getDoc(currRef)

        if (currDoc.exists()) {
            return currDoc.data()
        } else {
            console.error("Currencies document does not exist")
            throw new Error({ title: 'default_error', type: 'error' })
        }
    } catch (error) {
        console.error("Error retrieving currencies:", error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

async function emailIsProhibited(email) {
    try {
        const settingsRef = doc(db, process.env.NEXT_PUBLIC_COLL_APP_SETTINGS, 'deleted_users');
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists() && settingsDoc.data().data) {
            const prohibitedEmails = settingsDoc.data().data.map(item => item.email);
            return prohibitedEmails.includes(email);
        }
        return false;
    } catch (error) {
        console.error("Error checking if email is prohibited:", error);
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

export {
    getAppSettings,
    getAllCurrencies,
    emailIsProhibited,
}