import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    orderBy,
    limit,
    query,
    setDoc,
    where,
    Timestamp,
} from "firebase/firestore"
import Fuse from 'fuse.js'
import { LIMITS, PRODUCTS_TYPES } from "@/consts"
import Error from "next/error"
import { getProductVariantsInfos } from "@/utils"
import { isProductInPrintify } from "./printify"
import { db } from "../firebaseInit"
import { getProductsByIds } from "../frontend/product"

async function getProductsInfo(products) {
    try {
        if (products.length === 0) {
            return {
                status: 200,
                message: 'No products found for the provided Cart.',
                products: [],
            };
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

            return {
                ...prod,
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
    const productRef = doc(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS, product.id)

    try {
        const docSnapshot = await getDoc(productRef)
        if (docSnapshot.exists()) {
            return {
                status: 409,
                msg: `Product ID ${product.id} already exists.`,
            }
        }

        const existInPrintify = await isProductInPrintify(product)

        if (!existInPrintify)
            return {
                status: 400,
                msg: 'Invalid printify id',
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

async function updateProduct(product_id, product_new_fields) {
    if (!product_id || !product_new_fields)
        throw new MyError({ title: 'Invalid update data', statusCode: 400 })

    const productRes = await getProductById(product_id)
    if (!productRes.product)
        throw new MyError({ title: 'Product not found to update', statusCode: 404 })
    const existInPrintify = await isProductInPrintify({ ...productRes.product, ...product_new_fields })
    if (!existInPrintify)
        throw new MyError({ title: 'Invalid printify id', statusCode: 400 })

    if (product_new_fields.variants) {
        const type = PRODUCTS_TYPES.find(type => type.id === productRes.product.type_id)

        const variants = product_new_fields.variants.map(variant => ({
            ...variant,
            cost: type.variants.find(vari => vari.id === variant.id).cost
        }))
        if (variants.some(vari => vari.cost + LIMITS.min_profit >= vari.price * (productRes.product.promotion ? (1 - productRes.product.promotion.percentage) : 1)))
            throw new MyError({ title: 'Invalid product price', statusCode: 400 })
    }

    const productRef = doc(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS, product_id)

    try {
        await updateDoc(productRef, product_new_fields)

        console.log(`Product ${product_id} updated successfully!`)
        return { message: `Product ${product_id} updated successfully!` }
    } catch (error) {
        console.log("Error updating product:", error)
        throw new MyError({ title: 'An error occurred while updating the product.', statusCode: 500 })
    }
}

async function cleanPopularityMonth() {
    try {
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS);
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
        const productsCollection = collection(db, process.env.NEXT_PUBLIC_COLL_PRODUCTS);
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
        throw new MyError(`Error retrieving disabled products: ${error.message}`)
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
        throw new MyError('Error removing expired promotions.')
    }
}

export {
    createProduct,
    getProductById,
    updateProduct,
    getProductsInfo,
    getProductsByIds,
    cleanPopularityMonth,
    cleanPopularityYear,
    getDisabledProducts,
    removeExpiredPromotions,
}