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
import { PRODUCT_TYPES, TAGS_POOL, THEMES_POOL } from "../consts"
import translate from "translate"

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

async function getCartProductsInfo(cartProducts) {
    try {
        if (cartProducts.length === 0) {
            return {
                status: 200,
                message: 'No products found for the provided Cart.',
                products: [],
            }
        }
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)

        const q = query(productsCollection, where('id', 'in', cartProducts.map(prod => prod.id)))

        const querySnapshot = await getDocs(q)

        const products = querySnapshot.docs.map((doc) => doc.data())

        const productsOneVariant = cartProducts.map(prod => {
            const product = products.find(p => p.id === prod.id)
            const variant = product.variants.find(vari => vari.id === prod.variant_id)

            return {
                ...prod,
                type_id: product.type_id,
                title: product.title,
                description: product.description,
                sold_out: product.sold_out,
                printify_ids: product.printify_ids,
                variant: variant,
                default_variant: {
                    color_id: product.variants[0].color_id,
                    size_id: product.variants[0].size_id,
                },
                image: product.images.filter(img => img.color_id === variant.color_id)[product.image_showcase_index],
            }

        })

        return {
            status: 200,
            message: 'Products retrieved successfully Cart Products Info!',
            products: productsOneVariant,
        }
    } catch (error) {
        console.log('Error getting Cart Products Info:', error);
        return {
            status: 500,
            message: 'Error getting Cart Products Info.',
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
        v, //family
        c, //collection
        cl, //product color
        ac, //art color
        p = '1', //número da página
        min, //preço mínimo
        max, //preço máximo
        order = 'popularity',
        prods_limit = '60',
        user_language = 'en'
    } = props

    try {
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.COLL_PRODUCTS)

        let q = query(productsCollection)

        // Filtre by themes (se presente)
        if (h) {
            q = query(q, where("themes", "array-contains-any", h.split(' ')))
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
        if (v) {
            products = products.filter(prod => v.includes(prod.family_id))
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

            const fuse = new Fuse(TAGS_POOL.concat(THEMES_POOL.map(theme => theme.id).concat(PRODUCT_TYPES.map(type => type.id))), { threshold: 0.4 })

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
            return {
                status: 200,
                message: 'Products matching queries found successfully!',
                products: products.slice((Number(p) - 1) * Number(prods_limit), Number(p) * Number(prods_limit)),
                last_page: Math.ceil(products.length / Number(prods_limit))
            }
        } else {
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
        if (!ids || ids.length === 0) {
            return {
                status: 400,
                message: 'No product IDs provided.',
                products: [],
            };
        }

        const productsCollection = collection(db, process.env.COLL_PRODUCTS);

        const q = query(productsCollection, where('id', 'in', ids));

        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => doc.data());

        if (products.length > 0) {
            return {
                status: 200,
                message: 'Products retrieved successfully by IDs!',
                products: products,
            };
        } else {
            return {
                status: 200,
                message: 'No products found for the provided IDs.',
                products: [],
            };
        }
    } catch (error) {
        console.log('Error getting products by IDs:', error);
        return {
            status: 500,
            message: 'Error getting products by IDs.',
            products: null,
            error: error,
        };
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
    getCartProductsInfo,
    getAllProductsIds,
    getProductsByIds,
}