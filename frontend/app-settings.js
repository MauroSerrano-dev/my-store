import {
    doc,
    getDoc,
    collection,
    getDocs,
} from "firebase/firestore"
import { db } from "../firebaseInit"
import MyError from "@/classes/MyError";

async function getAppSettings() {
    try {
        const settingsCollectionRef = collection(db, process.env.NEXT_PUBLIC_COLL_APP_SETTINGS);

        // Executando a consulta para obter todos os documentos na coleção de configurações
        const querySnapshot = await getDocs(settingsCollectionRef);

        const allSettings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (allSettings.length > 0) {
            if (process.env.NEXT_PUBLIC_ENV === 'development')
                console.log('Settings collections retrieved successfully.');
            return allSettings;
        } else {
            if (process.env.NEXT_PUBLIC_ENV === 'development')
                console.log('No settings found in the collection.');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving settings collections:', error);
        throw error
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
            throw new MyError({ message: 'default_error' })
        }
    } catch (error) {
        console.error("Error retrieving currencies:", error)
        throw error
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
        throw error
    }
}

export {
    getAppSettings,
    getAllCurrencies,
    emailIsProhibited,
}