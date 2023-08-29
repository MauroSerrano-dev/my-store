import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config";

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllProducts() {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS);
    const querySnapshot = await getDocs(productsCollection);

    const allProducts = [];

    querySnapshot.forEach((doc) => {
        const productData = doc.data();
        allProducts.push(productData);
    });

    if (allProducts.length > 0) {
        return {
            msg: `All products retrieved successfully!`,
            products: allProducts
        };
    } else {
        return {
            msg: `No products found.`,
            products: []
        };
    }
}

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

async function getProductsByCategory(category) {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS);
    const q = query(productsCollection, where("categories", "array-contains", category));

    const querySnapshot = await getDocs(q);

    const productsInCategory = [];

    querySnapshot.forEach((doc) => {
        const productData = doc.data();
        productsInCategory.push(productData);
    });

    if (productsInCategory.length > 0) {
        return {
            msg: `Category ${category} products successfully found!`,
            products: productsInCategory
        };
    } else {
        return {
            msg: `No products found in category ${category}.`,
            products: []
        };
    }
}

async function getProductById(id) {
    const productRef = doc(db, process.env.COLL_PRODUCTS, id);
    try {
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
            const productData = productDoc.data();
            return {
                msg: `Product with ID ${id} found!`,
                product: productData
            };
        } else {
            return {
                msg: `Product with ID ${id} not found.`,
                product: null
            };
        }
    } catch (error) {
        console.log("Error getting product:", error);
        return null;
    }
}

async function getAllProductPrintifyIds() {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS);
    const querySnapshot = await getDocs(productsCollection);

    const productPrintifyIds = [];

    querySnapshot.forEach((doc) => {
        const productData = doc.data();
        productPrintifyIds.push(productData.id_printify);
    });

    return {
        msg: `All product Printify IDs retrieved successfully!`,
        printifyIds: productPrintifyIds
    };
}

export {
    createProduct,
    getProductsByCategory,
    getProductById,
    getAllProductPrintifyIds,
    getAllProducts
}