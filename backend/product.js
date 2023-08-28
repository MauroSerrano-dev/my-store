import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config";

initializeApp(firebaseConfig)

const db = getFirestore()


async function createProduct(product) {
    const productRef = doc(db, process.env.COLL_PRODUCTS, product.id)

    try {
        // Verifique se o documento já existe
        const docSnapshot = await getDoc(productRef)
        if (docSnapshot.exists()) {
            return { msg: `Product ID ${product.id} already exists. Cannot create product.` } // Retornar algum valor para indicar que a criação falhou
        }

        // Salve o documento no Firestore
        await setDoc(productRef, product)
        return { msg: `Product ${product.id} created successfully!` }
    } catch (error) {
        console.log("Error creating product:", error)
        return null; // Retornar algum valor para indicar que a criação falhou
    }
}


export {
    createProduct
}