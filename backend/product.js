import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    limit,
    startAfter,
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
    let q = query(productsCollection, where("category", "==", category));
    q = query(q, orderBy("popularity"))

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
        t, // theme
        page = 1, // número da página
        min, // preço mínimo
        max, // preço máximo
        order = 'popularity', // order
    } = queries;

    try {
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.COLL_PRODUCTS);
        let q = query(productsCollection);

        // Filtre por termo de busca (se presente)
        if (s) {
            const search = s.toLowerCase()
            q = query(q, where("tags", "array-contains", search));
        }

        // Filtre por categoria (se presente)
        if (c) {
            q = query(q, where('category', "==", c));
        }

        // Filtre por tema (se presente)
        if (t) {
            const themes = t.split(';')
            q = query(q, where('themes', "array-contains-any", themes));
        }

        // Filtre por preço mínimo (se presente)
        if (min) {
            q = query(q, where("price", ">=", parseFloat(min.concat('00'))));
        }

        // Filtre por preço máximo (se presente)
        if (max) {
            q = query(q, where("price", "<=", parseFloat(max.concat('00'))));
        }

        const orders = new Map([
            ['popularity', { value: 'popularity', direction: 'desc' }],
            ['newest', { value: 'create_at', direction: 'desc' }],
            ['lowest-price', { value: 'price', direction: 'asc' }],
            ['higher-price', { value: 'price', direction: 'desc' }],
        ])

        // Calcule a página inicial com base no número da página e no tamanho da página
        const itemsPerPage = 60;
        const startAfterDoc = (parseFloat(page) - 1) * itemsPerPage;

        // Aplique a ordenação correta
        q = query(q, orderBy(orders.get(order).value, orders.get(order).direction));

        // Aplique a paginação usando startAfter()
        if (startAfterDoc > 0) {
            q = query(q, startAfter(startAfterDoc));
        }

        // Crie uma nova consulta limitada ao número de itens por página
        q = query(q, limit(itemsPerPage));

        const querySnapshot = await getDocs(q);

        const productsMatchingQueries = [];
        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            productsMatchingQueries.push(productData);
        });

        if (productsMatchingQueries.length > 0) {
            return {
                msg: 'Products matching queries found successfully!',
                products: productsMatchingQueries
            };
        } else {
            return {
                msg: 'No products found matching the queries.',
                products: []
            };
        }
    } catch (error) {
        console.log('Error getting products.', error)
        return {
            msg: 'Error getting products.',
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
        msg: 'All product Printify IDs retrieved successfully!',
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