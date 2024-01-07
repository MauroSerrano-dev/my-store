import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import { getProductVariantsInfos } from "@/utils"
import { db } from "../firebaseInit"
import Error from "next/error";
import { productInfo } from "@/utils/models";
import { DEFAULT_LANGUAGE } from "@/consts";

async function getProductsInfo(products) {
    try {
        if (products.length === 0) {
            return []
        }

        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS);

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
            const product = productsResult.find(p => p.id === prod.id)
            const variants = getProductVariantsInfos(product)
            const variant = variants.find(vari => vari.id === prod.variant_id)

            const art_position = typeof product.printify_ids[0] === 'string'
                ? null
                : prod.art_position
                    ? prod.art_position
                    : Object.keys(product.printify_ids).reduce((acc, key) =>
                        Object.keys(product.printify_ids[key]).reduce((acc2, a_position) =>
                            product.printify_ids[key][a_position] === prod.id_printify ? a_position : acc2
                            , null
                        )
                            ? Object.keys(product.printify_ids[key]).reduce((acc2, a_position) =>
                                product.printify_ids[key][a_position] === prod.id_printify ? a_position : acc2
                                , null
                            )
                            : acc
                        , null
                    )

            const printify_ids = art_position
                ? Object.keys(product.printify_ids).reduce((acc, key) => ({
                    ...acc,
                    [key]: product.printify_ids[key][art_position]
                }), {})
                : product.printify_ids

            const visualImage = product.images.filter(img => img.color_id === variant.color_id)[product.image_showcase_index]

            const prodImage = art_position
                ? { ...visualImage, src: visualImage.src[art_position] }
                : visualImage

            return productInfo(
                {
                    id: prod.id,
                    art_position: prod.art_position,
                    quantity: prod.quantity,
                    type_id: product.type_id,
                    title: product.title,
                    promotion: product.promotion,
                    printify_ids: printify_ids,
                    variant: variant,
                    default_variant: {
                        color_id: variants[0].color_id,
                        size_id: variants[0].size_id,
                    },
                    image: prodImage,
                }
            )
        });

        return productsOneVariant
    } catch (error) {
        console.log('Error getting Products Info:', error);
        throw new Error(`Error getting Products Info: ${error.message}`);
    }
}

async function getProductsByQueries(props) {
    const {
        i, //id
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
        prods_limit = 60,
        user_language = DEFAULT_LANGUAGE,
        disabled,
        join_disabled
    } = props

    try {
        // Crie uma consulta base
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)

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
            q = query(q, where("min_price", ">=", parseFloat(min) * 100))
        }

        // Filtre by min price (se presente)
        if (max) {
            q = query(q, where("min_price", "<=", parseFloat(max) * 100))
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

        // Filtre by id (se presente)
        if (i) {
            products = products.filter(prod => prod.id.includes(i))
        }

        // Filtre by type (se presente)
        if (y) {
            products = products.filter(prod => y.some(type => type === prod.type_id))
        }

        // Filtre by family (se presente)
        if (v) {
            products = products.filter(prod => v.some(family_id => family_id === prod.family_id))
        }

        // Filtre by themes (se presente)
        if (h) {
            products = products.filter(prod => prod.themes.some(theme => h.includes(theme)))
        }

        // Filtre by tag (se presente)
        if (t) {
            products = products.filter(prod => prod.tags.some(tag => t.includes(tag)))
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

            const translationPromises = []

            inicialTags.forEach(word => {
                const translation = translate(word, { from: user_language.slice(0, 2), to: "en", engine: "google" })
                translationPromises.push(translation)
            })

            const searchArr = inicialTags.concat(await Promise.all(translationPromises))

            const fuse = new Fuse(TAGS_POOL.concat(THEMES_POOL.concat(PRODUCTS_TYPES.map(type => type.id))), { threshold: 0.4 })

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

        if (products.length > 0) {
            return {
                products: products.slice((Number(p) - 1) * prods_limit, Number(p) * prods_limit),
                last_page: Math.ceil(products.length / prods_limit)
            }
        } else {
            console.log('No products found matching the queries')
            return {
                products: [],
                last_page: 1,
            }
        }
    } catch (error) {
        console.error('Error getting products:', error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

async function getAllProducts(props) {
    const {
        order = 'popularity',
        prods_limit = 60,
        p = '1',
    } = props
        || {
            order: 'popularity',
            prods_limit: 60,
            p: '1',
        }
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)

        let q = query(productsCollection)

        q = query(q, where("disabled", "==", false))

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
                products: allProducts.slice((Number(p) - 1) * prods_limit, Number(p) * prods_limit),
                last_page: Math.ceil(allProducts.length / prods_limit)
            }
        } else {
            console.log('No products found')
            return {
                products: [],
                last_page: 1,
            }
        }
    } catch (error) {
        console.error('Error all getting products:', error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}

export {
    getProductsInfo,
    getProductsByQueries,
    getAllProducts,
}