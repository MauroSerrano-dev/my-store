import {
    Timestamp,
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllCurrencies() {
    try {
        const currRef = doc(db, process.env.COLL_APP_SETTINGS, 'currencies')
        const currDoc = await getDoc(currRef)

        if (currDoc.exists()) {
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

export {
    updateAllCurrencies,
    getAllCurrencies,
}