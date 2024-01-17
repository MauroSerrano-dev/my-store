import {
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore"
import { getProductVariantsInfos } from "@/utils"
import { db } from "../firebaseInit"
import { productInfoModel } from "@/utils/models";
import { DEFAULT_LANGUAGE, LIMITS, PRODUCTS_TYPES, TAGS_POOL, THEMES_POOL } from "@/consts";
import MyError from "@/classes/MyError";
import Translate from "translate";
const Fuse = require('fuse.js');

async function getProductsInfo(products) {
    try {
        if (products.length === 0)
            return []

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

            const visualImage = product.images.filter(img => img.color_id === variant.color_id).length > 0
                ? product.images.filter(img => img.color_id === variant.color_id)[product.image_showcase_index]
                : { src: '/no-image.webp' }

            return productInfoModel(
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
                    image_src: art_position
                        ? visualImage.src[art_position]
                        : visualImage.src,
                }
            )
        })

        return productsOneVariant
    } catch (error) {
        console.error('Error getting Products Info:', error);
        throw error
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
            products = products.filter(prod => y.split(' ').some(type => type === prod.type_id))
        }

        // Filtre by family (se presente)
        if (v) {
            products = products.filter(prod => v.split(' ').some(family_id => family_id === prod.family_id))
        }

        // Filtre by themes (se presente)
        if (h) {
            products = products.filter(prod => prod.themes.some(theme => h.split(' ').includes(theme)))
        }

        // Filtre by tag (se presente)
        if (t) {
            products = products.filter(prod => prod.tags.some(tag => t.split(' ').includes(tag)))
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
                const translation = Translate(word, { from: user_language.slice(0, 2), to: "en", engine: "google" })
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
        throw error
    }
}

async function getAllProducts(props) {
    const {
        order = 'popularity',
        prods_limit = 60,
        p = '1',
        join_disabled,
    } = props
        || {
            order: 'popularity',
            prods_limit: 60,
            p: '1',
        }
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)

        let q = query(productsCollection)

        if (!join_disabled)
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
        throw error
    }
}

async function getAllActivesProducts() {
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS);

        // Filtrar produtos com o campo 'disabled' igual a false
        let q = query(productsCollection, where("disabled", "==", false));

        const querySnapshot = await getDocs(q);

        const activeProducts = querySnapshot.docs.map(doc => doc.data());

        // Retorna um array vazio se não houver produtos ativos
        return activeProducts.length > 0 ? activeProducts : [];
    } catch (error) {
        console.error('Error getting active products:', error);
        throw new MyError('Error retrieving active products');
    }
}

async function getSimilarProducts(product_id, limit = 16) {
    try {

        const productRef = doc(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS, product_id);
        const productSnapshot = await getDoc(productRef);
        if (!productSnapshot.exists()) {
            console.log("Produto não encontrado.");
            return [];
        }
        const product = productSnapshot.data();

        // Obtenha todos os produtos
        let allProducts = await getAllActivesProducts();

        // Filtrar produtos similares com base em temas ou tags
        let similarProducts = allProducts.filter(p => p.id !== product.id &&
            (p.themes.some(theme => product.themes.includes(theme)) ||
                p.tags.some(tag => product.tags.includes(tag))));

        // Completar com produtos de mesmo tipo ou family_type, se necessário
        if (similarProducts.length < limit) {
            let additionalProducts = allProducts.filter(p => p.id !== product.id &&
                !similarProducts.includes(p) &&
                (p.type_id === product.type_id || p.family_id === product.family_id));

            additionalProducts.sort(() => 0.5 - Math.random()); // Embaralhar
            similarProducts = similarProducts.concat(additionalProducts.slice(0, limit - similarProducts.length));
        }

        // Completar com produtos aleatórios, se ainda necessário
        if (similarProducts.length < limit) {
            let randomProducts = allProducts.filter(p => p.id !== product.id &&
                !similarProducts.includes(p));

            randomProducts.sort(() => 0.5 - Math.random()); // Embaralhar
            similarProducts = similarProducts.concat(randomProducts.slice(0, limit - similarProducts.length));
        }

        return similarProducts.slice(0, limit);
    }
    catch (error) {
        console.error('Error getting similar products:', error)
        throw error
    }
}

async function getProductsAnalytics() {
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)

        // Criando uma consulta para a coleção de produtos
        const q = query(productsCollection);

        // Executando a consulta e obtendo os documentos
        const querySnapshot = await getDocs(q);

        // Inicializando contadores
        let activeCount = 0;
        let disabledCount = 0;

        // Contando os produtos ativos e desativados
        querySnapshot.docs.forEach(doc => {
            if (doc.data().disabled) {
                disabledCount++;
            } else {
                activeCount++;
            }
        });

        return {
            active: activeCount,
            disabled: disabledCount
        };
    } catch (error) {
        console.error('Error getting products analytics:', error);
        throw error
    }
}

async function getProductsByIds(ids) {
    try {
        if (!ids || ids.length === 0)
            return []

        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS);

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
        console.error('Error getting products by IDs:', error)
        throw error
    }
}

/**
 * Updates the promotion for a list of products in Firestore.
 * 
 * This function receives an array of product IDs and a promotion object. It validates the promotion
 * details, such as the promotion percentage and expiration date, and then updates the promotion
 * field for each product in Firestore based on the provided product objects.
 * 
 * @param {string[]} products_ids - Array of product IDs to have the promotion applied.
 * @param {Object} promotion - Promotion object with details such as percentage and expiration date.
 * @returns {Promise<object>} An object containing a success or error message.
 */
async function createPromotionForProducts(products_ids, promotion) {
    try {
        if (!products_ids || products_ids.length === 0)
            throw new MyError('invalid_product_ids_parameters', 'warning')

        // Retrieve full product objects by their IDs
        const products = await getProductsByIds(products_ids)

        // Perform necessary validations
        products.forEach(product => {
            const type = PRODUCTS_TYPES.find(type => type.id === product.type_id)
            const variants = product.variants.map(variant => ({
                ...variant,
                cost: type.variants.find(vari => vari.id === variant.id).cost
            }))
            if (variants.some(vari => vari.cost + LIMITS.min_profit >= vari.price * (1 - promotion.percentage)))
                throw new MyError('invalid_promotion_percentage', 'warning')
        })

        if (new Date(promotion.expire_at).getTime() - new Date().getTime() <= 18 * 60 * 60 * 1000)
            throw new MyError('invalid_expire_date', 'warning')

        // Reference to the products collection in Firestore
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)

        promotion.expire_at = new Timestamp(promotion.expire_at.seconds, promotion.expire_at.nanoseconds)

        // Maps each product object to an update promise
        const updatePromises = products.map(async (product) => {
            const productRef = doc(productsCollection, product.id)
            const min_price_original = product.promotion?.min_price_original ? product.promotion.min_price_original : product.min_price
            if (promotion.percentage === 0)
                await updateDoc(
                    productRef,
                    {
                        min_price: min_price_original,
                        promotion: null,
                        tags: product.tags.filter(tag => tag !== 'promotion')
                    }
                )
            else
                await updateDoc(
                    productRef,
                    {
                        min_price: min_price_original * (1 - promotion.percentage),
                        promotion: { ...promotion, min_price_original: min_price_original },
                        tags: product.tags.concat('promotion')
                    }
                )
        })

        // Waits for all the update promises to complete
        await Promise.all(updatePromises)

        console.log('Promotion updated successfully for specified products.')
    } catch (error) {
        console.error('Error creating promotion for products:', error)
        throw error
    }
}

export {
    getProductsInfo,
    getProductsByQueries,
    getAllProducts,
    getSimilarProducts,
    getAllActivesProducts,
    getProductsAnalytics,
    getProductsByIds,
    createPromotionForProducts,
}