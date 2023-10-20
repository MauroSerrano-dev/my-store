import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    orderBy,
    limit,
    startAfter,
    getFirestore,
    query,
    setDoc,
    where,
    Timestamp,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import Fuse from 'fuse.js'
import { TAGS_POOL } from "../consts"
import translate from "translate"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllProducts() {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS)
    const querySnapshot = await getDocs(productsCollection)

    const allProducts = []

    querySnapshot.forEach((doc) => {
        const productData = doc.data()
        allProducts.push(productData)
    })

    if (allProducts.length > 0) {
        return {
            msg: `All products retrieved successfully!`,
            products: allProducts
        }
    } else {
        return {
            msg: `No products found.`,
            products: []
        }
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
            create_at: Timestamp.now(),
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
    const productsCollection = collection(db, process.env.COLL_PRODUCTS)

    let q = query(productsCollection, where("tags", "array-contains-any", [category]))
    q = query(q, orderBy("popularity"))

    const querySnapshot = await getDocs(q)

    const productsInCategory = []

    querySnapshot.forEach((doc) => {
        const productData = doc.data()
        productsInCategory.push(productData)
    })

    if (productsInCategory.length > 0) {
        return {
            msg: `Category ${category} products successfully found!`,
            products: productsInCategory
        }
    } else {
        return {
            msg: `No products found in category ${category}.`,
            products: []
        }
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
        q = query(q, orderBy('title_lower_case'))

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
            }
        }
    } catch (error) {
        console.log('Error getting products.', error)
        return {
            msg: 'Error getting products.',
            products: []
        }
    }
}

async function getProductsByQueries(props) {
    const {
        s, //search
        t, //tags
        h, //theme
        p, //type
        c, //collection
        cl, //product color
        page = 1, //número da página
        min, //preço mínimo
        max, //preço máximo
        order = 'popularity',
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

        // Filtre by tag (se presente)
        if (t) {
            q = query(q, where("tags", "array-contains-any", t.split(' ')))
        }

        // Filtre by theme (se presente)
        if (h) {
            q = query(q, where("theme_id", "==", h))
        }

        // Filtre by collection (se presente)
        if (c) {
            q = query(q, where("collection_id", "==", c))
        }

        // Filtre by color (se presente)
        if (cl) {
            q = query(q, where("colors_ids", "array-contains", cl))
        }

        // Filtre by type (se presente)
        if (p) {
            q = query(q, where("type_id", "==", p))
        }

        // Filtre by max price (se presente)
        if (min) {
            q = query(q, where("min_price", ">=", parseFloat(min.concat('00'))))
        }

        // Filtre by min price (se presente)
        if (max) {
            q = query(q, where("min_price", "<=", parseFloat(max.concat('00'))))
        }

        const orders = new Map([
            ['popularity', { value: 'popularity', direction: 'desc' }],
            ['newest', { value: 'create_at', direction: 'desc' }],
            ['lowest-price', { value: 'min_price', direction: 'asc' }],
            ['higher-price', { value: 'min_price', direction: 'desc' }],
        ])

        // Calcule a página inicial com base no número da página e no tamanho da página
        const startAfterDoc = (parseFloat(page) - 1) * itemsPerPage

        const filterByPrice = (min || max) && order !== 'lowest-price' && order !== 'higher-price'

        // Aplique a ordenação correta
        q = query(q, orderBy(orders.get(filterByPrice ? 'lowest-price' : order).value, orders.get(filterByPrice ? 'lowest-price' : order).direction))

        // Aplique a paginação usando startAfter()
        if (startAfterDoc > 0) {
            q = query(q, startAfter(startAfterDoc))
        }

        // Crie uma nova consulta limitada ao número de itens por página
        q = query(q, limit(itemsPerPage))

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
            }
        }
    } catch (error) {
        console.log('Error getting products.', error)
        return {
            msg: 'Error getting products.',
            products: []
        }
    }
}

async function getProductById(id) {
    const productRef = doc(db, process.env.COLL_PRODUCTS, id)
    try {
        const productDoc = await getDoc(productRef)

        if (productDoc.exists()) {
            const productData = productDoc.data()
            return {
                status: 200,
                message: `Product with ID ${id} found!`,
                product: productData
            }
        } else {
            return {
                status: 204,
                message: `Product with ID ${id} not found.`,
                product: null
            }
        }
    } catch (error) {
        console.log("Error getting product:", error)
        return {
            status: 400,
            message: `Product with ID ${id} not found.`,
            product: null,
            error: error
        }
    }
}

async function getAllProductPrintifyIds() {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS)
    const querySnapshot = await getDocs(productsCollection)

    const productPrintifyIds = []

    querySnapshot.forEach((doc) => {
        const productData = doc.data()
        productPrintifyIds.push(productData.id_printify)
    })

    return {
        msg: 'All product Printify IDs retrieved successfully!',
        printifyIds: productPrintifyIds
    }
}

async function updateProduct(product_id, product_new_fields) {
    if (!product_id || !product_new_fields) {
        return {
            status: 400,
            msg: "Invalid update data",
        }
    }

    if (product_new_fields.variants && product_new_fields.variants.some(vari => vari.price < product_new_fields.variants[0].cost)) {
        return {
            status: 400,
            msg: "Invalid product price.",
        }
    }

    const productRef = doc(db, process.env.COLL_PRODUCTS, product_id)

    try {
        await updateDoc(productRef, product_new_fields)

        return {
            status: 200,
            msg: `Product ${product_id} updated successfully!`,
        }
    } catch (error) {
        console.log("Error updating product:", error)
        return {
            status: 500,
            msg: "An error occurred while updating the product.",
        }
    }
}

async function handleProductsPurchased(line_items) {
    try {
        for (const lineItem of line_items) {
            const { id, variant_id, quantity } = lineItem

            const productRef = doc(db, process.env.COLL_PRODUCTS, id)
            const productDoc = await getDoc(productRef)

            if (productDoc.exists()) {
                const productData = productDoc.data()

                // Atualize o total_sales no produto
                productData.total_sales += quantity

                // Verifique se o produto tem variantes
                if (productData.variants) {
                    const variant = productData.variants.find(v => v.id === variant_id)

                    // Verifique se a variante existe
                    if (variant) {
                        // Atualize as vendas da variante
                        variant.sales += quantity
                    }
                }

                // Atualize o produto no banco de dados
                await updateDoc(productRef, productData)
            }
        }

        return {
            msg: "Products updated successfully!",
        }
    } catch (error) {
        console.error("Error handling purchased products:", error)
        return {
            msg: "An error occurred while updating products.",
        };
    }
}

export {
    createProduct,
    getProductsByCategory,
    getProductsByQueries,
    getProductById,
    getAllProductPrintifyIds,
    getAllProducts,
    getProductsByTitle,
    updateProduct,
    handleProductsPurchased,
}