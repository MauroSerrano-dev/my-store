import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    orderBy,
    limit,
    getFirestore,
    query,
    setDoc,
    where,
    Timestamp,
} from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebase.config"
import Fuse from 'fuse.js'
import { POPULARITY_POINTS, PRODUCTS_TYPES, TAGS_POOL, THEMES_POOL } from "@/consts"
import translate from "translate"
import Error from "next/error"
import { getProductVariantsInfos } from "@/utils"

initializeApp(firebaseConfig)

const db = getFirestore()

async function getAllProducts(props) {
    const {
        order = 'popularity',
        prods_limit = '60',
        p = '1',
    } = props
        || {
            order: 'popularity',
            prods_limit: '60',
            p: '1',
        }
    try {
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)

        let q = query(productsCollection)

        const orders = new Map([
            ['popularity', { value: 'popularity', direction: 'desc' }],
            ['newest', { value: 'create_at', direction: 'desc' }],
            ['lowest-price', { value: 'min_price', direction: 'asc' }],
            ['higher-price', { value: 'min_price', direction: 'desc' }],
        ])

        q = query(q, orderBy(orders.get(order).value, orders.get(order).direction))

        const querySnapshot = await getDocs(q)

        const allProducts = querySnapshot.docs.map(doc => doc.data())

        if (allProducts.length > 0) {
            return {
                status: 200,
                message: 'All products retrieved successfully!',
                products: allProducts.slice((Number(p) - 1) * Number(prods_limit), Number(p) * Number(prods_limit)),
                last_page: Math.ceil(allProducts.length / Number(prods_limit))
            }
        } else {
            return {
                status: 200,
                message: 'No products found.',
                products: [],
                last_page: 1,
            }
        }
    } catch (error) {
        console.log('Error all getting products.', error)
        return {
            status: 500,
            message: 'Error getting all products.',
            products: null,
            error: error,
        }
    }
}

async function getProductsInfo(products) {
    try {
        if (products.length === 0) {
            return {
                status: 200,
                message: 'No products found for the provided Cart.',
                products: [],
            };
        }

        const productsCollection = collection(db, process.env.COLL_PRODUCTS);

        const productIDs = products.map(prod => prod.id);
        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < productIDs.length; i += chunkSize) {
            chunks.push(productIDs.slice(i, i + chunkSize));
        }

        const promises = chunks.map(async chunk => {
            const q = query(
                productsCollection,
                where('id', 'in', chunk)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data());
        });

        const chunkResults = await Promise.all(promises);
        const productsResult = chunkResults.flat();

        const productsOneVariant = products.map(prod => {
            const product = productsResult.find(p => p.id === prod.id);
            const variants = getProductVariantsInfos(product)
            const variant = variants.find(vari => vari.id === prod.variant_id);

            return {
                ...prod,
                type_id: product.type_id,
                title: product.title,
                promotion: product.promotion,
                printify_ids: product.printify_ids,
                variant: variant,
                default_variant: {
                    color_id: variants[0].color_id,
                    size_id: variants[0].size_id,
                },
                image: product.images.filter(img => img.color_id === variant.color_id)[product.image_showcase_index],
            };
        });

        return {
            status: 200,
            message: 'Products retrieved successfully Products Info!',
            products: productsOneVariant,
        };
    } catch (error) {
        console.log('Error getting Products Info:', error);
        return {
            status: 500,
            message: 'Error getting Products Info.',
            products: null,
            error: error,
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

        const productsMatchingQueries = querySnapshot.docs.map(doc => doc.data())

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
        y, //type
        v, //family
        c, //collection
        cl, //product color
        ac, //art color
        p = '1', //número da página
        min, //preço mínimo
        max, //preço máximo
        order = 'popularity',
        prods_limit = '60',
        user_language = 'en',
        disabled,
        join_disabled
    } = props

    try {
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)

        let q = query(productsCollection)

        if (!join_disabled) {
            if (disabled) {
                q = query(q, where("disabled", "==", true))
            }
            else {
                q = query(q, where("disabled", "==", false))
            }
        }

        // Filtre by collection (se presente)
        if (c) {
            q = query(q, where("collection_id", "==", c))
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

        const filterByPrice = (min || max) && order !== 'lowest-price' && order !== 'higher-price'

        // Aplique a ordenação correta
        q = query(q, orderBy(orders.get(filterByPrice ? 'lowest-price' : order).value, orders.get(filterByPrice ? 'lowest-price' : order).direction))

        const querySnapshot = await getDocs(q)

        let products = querySnapshot.docs.map(doc => doc.data())

        // Filtre by type (se presente)
        if (y) {
            products = products.filter(prod => y.includes(prod.type_id))
        }

        // Filtre by family (se presente)
        if (v) {
            products = products.filter(prod => v.includes(prod.family_id))
        }

        // Filtre by themes (se presente)
        if (h) {
            const themes = h.split(' ')
            products = products.filter(prod => prod.themes.some(theme => themes.includes(theme)))
        }

        // Filtre by product color (se presente)
        if (cl) {
            products = products.filter(prod => prod.variants.some(vari => cl.colors.find(cl => cl.id === vari.color_id)))
        }

        // Filtre by product color (se presente)
        if (ac) {
            products = products.filter(prod => prod.variants.some(vari => vari.art.color_id === ac.id))
        }

        // Filtre by search (se presente)
        if (s) {
            const inicialTags = s.split(' ')

            let searchArr = inicialTags

            const translationPromises = []

            inicialTags.forEach(word => {
                const translation = translate(word, { from: user_language, to: "en", engine: "google" })
                translationPromises.push(translation)
            })

            searchArr = inicialTags.concat(await Promise.all(translationPromises))

            const fuse = new Fuse(TAGS_POOL.concat(THEMES_POOL.map(theme => theme.id).concat(PRODUCTS_TYPES.map(type => type.id))), { threshold: 0.4 })

            const tags = inicialTags.concat(searchArr.map(tag => {
                const fuseRes = fuse.search(tag)
                return fuseRes.length > 0
                    ? fuseRes[0].item
                    : ''
            }))
                .filter(tag => tag !== '')
                .reduce((acc, tag) => acc.includes(tag) ? acc : acc.concat(tag), [])

            products = products.filter(prod =>
                prod.tags.some(tag => tags.includes(tag))
                || prod.themes.some(theme => tags.includes(theme))
                || tags.some(tag => prod.title.toLowerCase().includes(tag))
            )
        }

        // Filtre by tag (se presente)
        if (t) {
            products = products.filter(prod => prod.tags.some(tag => t.includes(tag)))
        }

        if (products.length > 0) {
            console.log('Products matching queries found successfully!')
            return {
                status: 200,
                message: 'Products matching queries found successfully!',
                products: products.slice((Number(p) - 1) * Number(prods_limit), Number(p) * Number(prods_limit)),
                last_page: Math.ceil(products.length / Number(prods_limit))
            }
        } else {
            console.log('No products found matching the queries.')
            return {
                status: 200,
                message: 'No products found matching the queries.',
                products: [],
                last_page: 1,
            }
        }
    } catch (error) {
        console.log('Error getting products.', error)
        return {
            status: 500,
            message: 'Error getting products.',
            products: null,
            error: error,
        }
    }
}

async function getProductById(id) {
    try {
        const productRef = doc(db, process.env.COLL_PRODUCTS, id)
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
                status: 200,
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
    if (!product_id || !product_new_fields)
        throw new Error({ title: 'Invalid update data.', statusCode: 400 })

    if (product_new_fields.variants && product_new_fields.variants.some(vari => vari.price < product_new_fields.variants[0].cost))
        throw new Error({ title: 'Invalid product price.', statusCode: 400 })

    const productRef = doc(db, process.env.COLL_PRODUCTS, product_id)

    try {
        await updateDoc(productRef, product_new_fields)

        console.log(`Product ${product_id} updated successfully!`)
        return { message: `Product ${product_id} updated successfully!` }
    } catch (error) {
        console.log("Error updating product:", error)
        throw new Error({ title: 'An error occurred while updating the product.', statusCode: 500 })
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

                productData.popularity += POPULARITY_POINTS.purchase * quantity

                productData.popularity_year += POPULARITY_POINTS.purchase * quantity

                productData.popularity_month += POPULARITY_POINTS.purchase * quantity

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
        }
    }
}

async function getAllProductsIds() {
    try {
        const productsCollection = collection(db, process.env.COLL_PRODUCTS);
        const q = query(productsCollection);

        const querySnapshot = await getDocs(q);
        const productIds = querySnapshot.docs.map(doc => doc.id);

        return {
            status: 200,
            message: 'All product IDs retrieved successfully!',
            productIds: productIds,
        };
    } catch (error) {
        console.log('Error getting product IDs.', error);
        return {
            status: 500,
            message: 'Error getting all product IDs.',
            productIds: null,
            error: error,
        };
    }
}

async function getProductsByIds(ids) {
    try {
        if (!ids || ids.length === 0)
            return []

        const productsCollection = collection(db, process.env.COLL_PRODUCTS);

        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < ids.length; i += chunkSize) {
            chunks.push(ids.slice(i, i + chunkSize));
        }

        const promises = chunks.map(async chunk => {
            const q = query(
                productsCollection,
                where('id', 'in', chunk)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data());
        });

        const chunkResults = await Promise.all(promises);
        const mergedResults = chunkResults.flat();

        const products = {};
        mergedResults.forEach(product => {
            products[product.id] = product;
        })

        const orderedProducts = ids.map(id => products[id] || null);

        console.log('Products retrieved successfully by IDs!')
        return orderedProducts
    } catch (error) {
        console.log('Error getting products by IDs:', error);
        throw new Error({ title: 'Error getting products by IDs.', statusCode: 500 })
    }
}

async function cleanPopularityMonth() {
    try {
        const productsCollection = collection(db, process.env.COLL_PRODUCTS);
        const querySnapshot = await getDocs(productsCollection);

        for (const doc of querySnapshot.docs) {
            const productRef = doc.ref;
            const productDoc = await getDoc(productRef);

            if (productDoc.exists()) {
                const productData = productDoc.data();
                productData.popularity_month = 0;

                await updateDoc(productRef, productData);
            }
        }

        console.log('Popularity month cleaned successfully!')
        return {
            status: 200,
            message: 'Popularity month cleaned successfully!',
        };
    } catch (error) {
        console.error('Error cleaning popularity month:', error);
        return {
            status: 500,
            message: 'Error cleaning popularity month.',
            error: error,
        };
    }
}

async function cleanPopularityYear() {
    try {
        const productsCollection = collection(db, process.env.COLL_PRODUCTS);
        const querySnapshot = await getDocs(productsCollection);

        for (const doc of querySnapshot.docs) {
            const productRef = doc.ref;
            const productDoc = await getDoc(productRef);

            if (productDoc.exists()) {
                const productData = productDoc.data();
                productData.popularity_year = 0;

                await updateDoc(productRef, productData);
            }
        }

        console.log('Popularity year cleaned successfully!')
        return {
            status: 200,
            message: 'Popularity year cleaned successfully!',
        };
    } catch (error) {
        console.error('Error cleaning popularity year:', error);
        return {
            status: 500,
            message: 'Error cleaning popularity year.',
            error: error,
        };
    }
}

/**
 * Retorna uma lista de produtos desabilitados com base em seus IDs.
 * 
 * Esta função recebe um array de IDs de produtos e verifica no banco de dados
 * quais produtos estão desabilitados. Retorna um array contendo os IDs dos
 * produtos desabilitados.
 * 
 * @param {string[]} productIds - Array de IDs de produtos a serem verificados.
 * @returns {Promise<string[]>} Um array contendo os IDs dos produtos desabilitados.
 * @throws {Error} Lança um erro se ocorrer um problema durante a consulta ao banco de dados.
 */
async function getDisabledProducts(products) {
    const productsCollection = collection(db, process.env.COLL_PRODUCTS)
    const disabledProducts = []

    try {
        if (!products || products.length === 0) {
            throw new Error('No product IDs provided.')
        }

        for (const product of products) {
            const productRef = doc(productsCollection, product.id)
            const productDoc = await getDoc(productRef)

            if (productDoc.exists() && productDoc.data().disabled) {
                disabledProducts.push(product)
            }
        }

        return disabledProducts
    } catch (error) {
        throw new Error(`Error retrieving disabled products: ${error.message}`)
    }
}

export {
    createProduct,
    getProductsByQueries,
    getProductById,
    getAllProductPrintifyIds,
    getAllProducts,
    getProductsByTitle,
    updateProduct,
    handleProductsPurchased,
    getProductsInfo,
    getAllProductsIds,
    getProductsByIds,
    cleanPopularityMonth,
    cleanPopularityYear,
    getDisabledProducts,
}