import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    limit,
    startAt,
    getFirestore,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
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

async function getProductsByQueries(queries) {

    const {
        c, // categories (array de strings)
        s, // search (string)
        t, // themes (array de strings)
        page = 1, // número da página
        min, // preço mínimo
        max // preço máximo
    } = queries;

    // Crie uma consulta base
    const productsCollection = collection(db, process.env.COLL_PRODUCTS);
    let q = query(productsCollection);

    // Filtre por categoria (se presente)
    if (c) {
        q = query(q, where("categories", "array-contains", c));
    }

    // Filtre por termo de busca (se presente)
    if (s) {
        const search = s.toLowerCase()
        q = query(q, where("title", "==", s));
        /* q = query(q, where("categories", "array-contains", search)); */
    }

    // Filtre por tema (se presente)
    if (t) {
        t.forEach(t => {
            q = query(q, where("themes", "array-contains", t));
        });
    }

    // Filtre por preço mínimo (se presente)
    if (min) {
        q = query(q, where("price", ">=", parseFloat(min.concat('00'))));
    }

    // Filtre por preço máximo (se presente)
    if (max) {
        q = query(q, where("price", "<=", parseFloat(max.concat('00'))));
    }

    // Calcule a posição de início com base no número da página
    const itemsPerPage = 60;
    const startIndex = (parseFloat(page) - 1) * itemsPerPage;

    // Execute a consulta paginada
    q = query(q, orderBy(s ? "title" : "price")); // Ordenar por título, você pode escolher o campo de ordenação desejado

    // Crie uma nova consulta limitada ao número de itens por página
    const paginatedQuery = query(q, limit(itemsPerPage), startAt(startIndex));

    const querySnapshot = await getDocs(paginatedQuery);

    const productsMatchingQueries = [];

    querySnapshot.forEach((doc) => {
        const productData = doc.data();
        productsMatchingQueries.push(productData);
    });

    if (productsMatchingQueries.length > 0) {
        return {
            msg: `Products matching queries found successfully!`,
            products: productsMatchingQueries
        };
    } else {
        return {
            msg: `No products found matching the queries.`,
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
    getProductsByQueries,
    getProductById,
    getAllProductPrintifyIds,
    getAllProducts
}