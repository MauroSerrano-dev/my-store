import {
    collection,
    getFirestore,
    setDoc,
    doc,
    getDocs,
    getDoc,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllProductsTypes() {
    try {
        const typesCollection = collection(db, process.env.COLL_PRODUCT_TYPES)
        const querySnapshot = await getDocs(typesCollection)

        const allTypes = []

        querySnapshot.forEach((doc) => {
            const typeData = doc.data()
            allTypes.push(typeData)
        })

        if (allTypes.length > 0) {
            return {
                status: 200,
                message: 'All product types retrieved successfully!',
                product_types: allTypes
            }
        } else {
            return {
                status: 204,
                message: `No product types found.`,
                product_types: []
            }
        }
    } catch (error) {
        return {
            status: 400,
            message: 'Error getting Product Types',
            error: error,
        }
    }
}

async function getProductType(product_type_id) {
    try {
        const productTypeRef = doc(db, process.env.COLL_PRODUCT_TYPES, product_type_id)

        const productType = await getDoc(productTypeRef)

        if (productType.exists()) {
            return {
                status: 200,
                message: `Product Type ${product_type_id} retrieved successfully!`,
                product_type: productType.data(),
            }
        } else {
            return {
                status: 204,
                message: `No Product Type found with ID ${product_type_id}`,
                product_type: null,
            }
        }
    } catch (error) {
        return {
            status: 400,
            message: 'Error getting Product Type',
            error: error,
        }
    }
}

async function createTypeOfProduct(newProductType) {
    try {
        const typeCollection = collection(db, process.env.COLL_PRODUCT_TYPES)

        const typeDocRef = doc(typeCollection, newProductType.id)

        await setDoc(typeDocRef, newProductType);

        return {
            status: 201,
            message: `Product Type ${newProductType.id} created`,
        }
    } catch (error) {
        return {
            status: 400,
            message: 'Error creating Product Type',
            error: error,
        }
    }
}

export {
    getAllProductsTypes,
    getProductType,
    createTypeOfProduct,
}