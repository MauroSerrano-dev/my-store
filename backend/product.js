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
    where,
} from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import Fuse from 'fuse.js'
import { TAGS_POOL } from "../consts"
import translate from "translate";

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
        const docSnapshot = await getDoc(productRef)
        if (docSnapshot.exists()) {
            return {
                status: 409, // Código de status HTTP 409 Conflict
                msg: `Product ID ${product.id} already exists.`,
            }
        }

        const now = new Date()

        const newProduct = {
            ...product,
            create_at: now,
        }

        await setDoc(productRef, newProduct)
        return {
            status: 201, // Código de status HTTP 201 Created
            msg: `Product ${newProduct.id} created successfully!`,
        }
    } catch (error) {
        console.log("Error creating product:", error)
        return {
            status: 500, // Código de status HTTP 500 Internal Server Error
            msg: "An error occurred while creating the product.",
        }
    }
}


async function getProductsByCategory(category) {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS);

    let q = query(productsCollection, where("tags", "array-contains-any", [category]));
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

async function getProductsByTitle(s) {

    try {
        if (s === '') {
            return {
                msg: 'Empty query.',
                products: []
            }
        }
        const searchQuery = s.toLowerCase()
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)
        let q = query(productsCollection)

        q = query(q, where('title_lower_case', ">=", searchQuery))
        q = query(q, where('title_lower_case', "<=", searchQuery + '\uf8ff'))

        // Aplique a ordenação correta
        q = query(q, orderBy('title_lower_case'));

        // Crie uma nova consulta limitada ao número de itens por página
        q = query(q, limit(5))

        const querySnapshot = await getDocs(q)

        const productsMatchingQueries = []
        querySnapshot.forEach((doc) => {
            const productData = doc.data()
            productsMatchingQueries.push(productData)
        })

        if (productsMatchingQueries.length > 0) {
            return {
                msg: 'Products matching queries found successfully!',
                products: productsMatchingQueries
            }
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

async function getProductsByQueries(props) {
    const {
        s, //search
        t, // tags
        c, // type
        page = 1, // número da página
        min, // preço mínimo
        max, // preço máximo
        order = 'popularity', // order
        itemsPerPage = 60,
        userLanguage = 'en'
    } = props

    try {
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)

        let q = query(productsCollection)

        // Filtre por search (se presente)
        if (s) {
            const inicialTags = s.split(' ')

            let searchArr = inicialTags

            const translationPromises = []

            inicialTags.forEach(word => {
                const translation = translate(word, { from: userLanguage, to: "en" })
                translationPromises.push(translation)
            })

            searchArr = inicialTags.concat(await Promise.all(translationPromises))

            const fuse = new Fuse(TAGS_POOL)

            const tags = searchArr.map(tag => {
                const fuseRes = fuse.search(tag)
                return fuseRes.length > 0
                    ? fuseRes[0].item
                    : ''
            })
                .filter(tag => tag !== '')
                .reduce((acc, tag) => acc.includes(tag) ? acc : acc.concat(tag), [])

            if (tags.length === 0) {
                return {
                    msg: 'No products found matching the queries.',
                    products: []
                }
            }

            q = query(q, where(
                'tags',
                "array-contains-any",
                tags
            ))
        }

        // Filtre por tag (se presente)
        if (t) {
            q = query(q, where("tags", "array-contains-any", t.split(' ')))
        }

        // Filtre por tipo (se presente)
        if (c) {
            q = query(q, where("type", "==", c))
        }

        // Filtre por preço mínimo (se presente)
        if (min) {
            q = query(q, where("min_price", ">=", parseFloat(min.concat('00'))))
        }

        // Filtre por preço máximo (se presente)
        if (max) {
            q = query(q, where("min_price", "<=", parseFloat(max.concat('00'))));
        }

        const orders = new Map([
            ['popularity', { value: 'popularity', direction: 'desc' }],
            ['newest', { value: 'create_at', direction: 'desc' }],
            ['lowest-price', { value: 'min_price', direction: 'asc' }],
            ['higher-price', { value: 'min_price', direction: 'desc' }],
        ])

        // Calcule a página inicial com base no número da página e no tamanho da página
        const startAfterDoc = (parseFloat(page) - 1) * itemsPerPage;

        const filterByPrice = (min || max) && order !== 'lowest-price' && order !== 'higher-price'

        // Aplique a ordenação correta
        q = query(q, orderBy(orders.get(filterByPrice ? 'lowest-price' : order).value, orders.get(filterByPrice ? 'lowest-price' : order).direction));

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
    getAllProducts,
    getProductsByTitle
}