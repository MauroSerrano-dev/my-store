import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    Timestamp,
} from "firebase/firestore"
import { isProductInPrintify } from "./printify"
import { db } from "../firebaseInit"
import MyError from "@/classes/MyError"
import { productInfoModel } from "@/utils/models";
const admin = require('../firebaseAdminInit');

/**
 * Creates a new product in the Firestore database.
 * Checks for existing product with the same ID and for validity in Printify.
 * 
 * @param {Object} product - The product object to be created.
 * @returns {Promise<Object>} An object containing the status and message of the operation.
 * @throws {MyError} Throws a MyError if the product creation fails.
 */
async function createProduct(product) {
    const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
    const productRef = productsCollection.doc(product.id);

    try {
        const docSnapshot = await productRef.get();
        if (docSnapshot.exists) {
            throw new MyError(`Product ID ${product.id} already exists.`);
        }

        const existInPrintify = await isProductInPrintify(product);
        if (!existInPrintify) {
            throw new MyError('Invalid printify ID');
        }

        const newProduct = {
            ...product,
            create_at: admin.firestore.Timestamp.now(),
        };

        await productRef.set(newProduct);
        return { status: 200, msg: 'Product created successfully' };
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

async function getProductById(id) {
    try {
        const productRef = doc(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS, id)
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

/**
 * Updates a product in the Firestore database with new fields.
 * 
 * @param {string} product_id - The ID of the product to update.
 * @param {Object} product_new_fields - New fields to update the product with.
 * @returns {Promise<Object>} An object containing the status message of the operation.
 * @throws {MyError} Throws a MyError if the product update fails.
 */
async function updateProduct(product_id, product_new_fields) {
    if (!product_id || !product_new_fields) {
        throw new MyError('Invalid update data', 'warning');
    }

    const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
    const productRef = productsCollection.doc(product_id);

    try {
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            throw new MyError('Product not found to update', 'warning');
        }

        const productData = productDoc.data();
        const existInPrintify = await isProductInPrintify({ ...productData, ...product_new_fields });
        if (!existInPrintify) {
            throw new MyError('Invalid printify ID', 'warning');
        }

        await productRef.update(product_new_fields);
        console.log(`Product ${product_id} updated successfully!`);
        return { message: `Product ${product_id} updated successfully!` };
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

async function cleanPopularityMonth() {
    try {
        const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
        const querySnapshot = await productsCollection.get();

        for (const doc of querySnapshot.docs) {
            await doc.ref.update({ popularity_month: 0 });
        }

        console.log('Popularity month cleaned successfully!');
        return { status: 200, message: 'Popularity month cleaned successfully!' };
    } catch (error) {
        console.error('Error cleaning popularity month:', error);
        throw error;
    }
}

async function cleanPopularityYear() {
    try {
        const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
        const querySnapshot = await productsCollection.get();

        for (const doc of querySnapshot.docs) {
            await doc.ref.update({ popularity_year: 0 });
        }

        console.log('Popularity year cleaned successfully!');
        return { status: 200, message: 'Popularity year cleaned successfully!' };
    } catch (error) {
        console.error('Error cleaning popularity year:', error);
        throw error;
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
    const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)
    const disabledProducts = []

    try {
        if (!products || products.length === 0) {
            throw new MyError('No product IDs provided.')
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
        console.log("Error retrieving disabled products:", error)
        throw new MyError('Error retrieving disabled products', error?.type || 'error')
    }
}

/**
 * Removes expired promotions from all products in Firestore.
 * 
 * This function retrieves all products and sets the 'promotion' field to null
 * for those products whose promotion has expired.
 * 
 * @returns {Promise<object>} An object containing a success or error message.
 * @throws {Error} Throws an error if there is an error during the process.
 */
async function removeExpiredPromotions() {
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS)
        const querySnapshot = await getDocs(productsCollection)

        const updatePromises = []

        querySnapshot.forEach((doc) => {
            const product = doc.data()
            if (product.promotion && product.promotion.expire_at) {
                const now = Timestamp.now()

                if (product.promotion.expire_at.seconds < now.seconds) {
                    updatePromises.push(updateDoc(doc.ref, { min_price: product.promotion.min_price_original, promotion: null }))
                }
            }
        })

        await Promise.all(updatePromises)
        console.log('Expired promotions removed successfully.')
        return { message: 'Expired promotions removed successfully.' }
    } catch (error) {
        console.error('Error removing expired promotions:', error)
        throw new MyError('Error removing expired promotions', error?.type || 'error')
    }
}

async function getProductsInfo(products) {
    try {
        if (products.length === 0)
            return [];

        const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);

        const productIDs = products.map(prod => prod.id);
        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < productIDs.length; i += chunkSize) {
            chunks.push(productIDs.slice(i, i + chunkSize));
        }

        const promises = chunks.map(async chunk => {
            const q = productsCollection.where('id', 'in', chunk);
            const querySnapshot = await q.get();
            return querySnapshot.docs.map(doc => doc.data());
        });

        const chunkResults = await Promise.all(promises);
        const productsResult = chunkResults.flat();

        const productsOneVariant = products.map(prod => {
            const product = productsResult.find(p => p.id === prod.id);

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
        throw error;
    }
}

export {
    createProduct,
    getProductById,
    updateProduct,
    getProductsInfo,
    cleanPopularityMonth,
    cleanPopularityYear,
    getDisabledProducts,
    removeExpiredPromotions,
}