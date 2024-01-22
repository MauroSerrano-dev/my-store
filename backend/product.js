import { isProductInPrintify } from "./printify"
import MyError from "@/classes/MyError"
import { productInfoModel } from "@/utils/models";
import { getProductVariantsInfos } from "@/utils";
import { getProductPrintifyIdsUniquePosition } from "@/utils/edit-product";
const admin = require('../firebaseAdminInit');

/**
 * Creates a new product in the Firestore database.
 * Checks for existing product with the same ID and for validity in Printify.
 * 
 * @param {Object} product - The product object to be created.
 * @returns {Promise<Object>} An object containing the status and message of the operation.
 */
async function createProduct(product) {
    const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
    const productRef = productsCollection.doc(product.id);

    try {
        const docSnapshot = await productRef.get();
        if (docSnapshot.exists) {
            throw new MyError({ message: `Product ID ${product.id} already exists.` });
        }

        const existInPrintify = await isProductInPrintify(product);
        if (!existInPrintify) {
            throw new MyError({ message: 'Invalid printify ID' });
        }

        const newProduct = {
            ...product,
            create_at: admin.firestore.Timestamp.now(),
        };

        await productRef.set(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

async function getProductById(id) {
    try {
        const firestore = admin.firestore();
        const productRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_PRODUCTS}/${id}`);
        const productDoc = await productRef.get();

        if (productDoc.exists) {
            const productData = productDoc.data();

            console.log(`Product with ID ${id} found!`);
            return productData;
        } else {
            throw new MyError({ message: `Product with ID ${id} not found` });
        }
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
}

/**
 * Updates a product in the Firestore database with new fields.
 * 
 * @param {Object} product_new_fields - New fields to update the product with.
 * @returns {Promise<Object>} An object containing the status message of the operation.
 */
async function updateProduct(new_product) {
    if (!new_product?.id || !new_product) {
        throw new MyError({ message: 'Invalid update data', type: 'warning' })
    }

    const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS)
    const productRef = productsCollection.doc(new_product.id)

    try {
        const productDoc = await productRef.get()

        if (!productDoc.exists) {
            throw new MyError({ message: 'Product not found to update', type: 'warning' })
        }

        const existInPrintify = await isProductInPrintify(new_product)
        if (!existInPrintify) {
            throw new MyError({ message: 'Invalid printify ID', type: 'warning' })
        }

        await productRef.update(new_product)
    } catch (error) {
        console.error("Error updating product:", error)
        throw error
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
 */
async function getDisabledProducts(productIds) {
    const firestore = admin.firestore();
    const disabledProducts = [];

    try {
        if (!productIds || productIds.length === 0) {
            throw new MyError({ message: 'No product IDs provided' });
        }

        for (const productId of productIds) {
            const productRef = firestore.doc(`${process.env.NEXT_PUBLIC_COLL_PRODUCTS}/${productId}`);
            const productDoc = await productRef.get();

            if (productDoc.exists && productDoc.data().disabled) {
                disabledProducts.push(productId);
            }
        }

        return disabledProducts;
    } catch (error) {
        console.error("Error retrieving disabled products:", error);
        throw error;
    }
}

/**
 * Removes expired promotions from all products in Firestore.
 * 
 * This function retrieves all products and sets the 'promotion' field to null
 * for those products whose promotion has expired.
 * 
 * @returns {Promise<object>} An object containing a success or error message.
 */
async function removeExpiredPromotions() {
    const firestore = admin.firestore();
    try {
        const productsCollection = firestore.collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);
        const querySnapshot = await productsCollection.get();

        const updatePromises = [];

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            if (product.promotion && product.promotion.expire_at) {
                const now = admin.firestore.Timestamp.now();

                if (product.promotion.expire_at.seconds < now.seconds) {
                    updatePromises.push(doc.ref.update({ min_price: product.promotion.min_price_original, promotion: null }));
                }
            }
        });

        await Promise.all(updatePromises);
        console.log('Expired promotions removed successfully.');
        return { message: 'Expired promotions removed successfully.' };
    } catch (error) {
        console.error('Error removing expired promotions:', error);
        throw error;
    }
}

async function getProductsInfo(products) {
    try {
        if (products.length === 0)
            return []

        const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS)

        const productIDs = products.map(prod => prod.id)
        const chunkSize = 30
        const chunks = []

        for (let i = 0; i < productIDs.length; i += chunkSize) {
            chunks.push(productIDs.slice(i, i + chunkSize))
        }

        const promises = chunks.map(async chunk => {
            const q = productsCollection.where('id', 'in', chunk)
            const querySnapshot = await q.get()
            return querySnapshot.docs.map(doc => doc.data())
        })

        const chunkResults = await Promise.all(promises)
        const productsResult = chunkResults.flat()

        const productsOneVariant = products.map(prod => {
            const product = productsResult.find(p => p.id === prod.id)

            const variants = getProductVariantsInfos(product)
            const variant = variants.find(vari => vari.id === prod.variant_id)

            const printify_ids = getProductPrintifyIdsUniquePosition(product.printify_ids, prod.art_position)

            const visualImage = product.images.filter(img => img.color_id === variant.color_id && (!prod.art_position || img.position === prod.art_position)).length > 0
                ? product.images.filter(img => img.color_id === variant.color_id && (!prod.art_position || img.position === prod.art_position))[product.image_showcase_index]
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
                    image_src: visualImage.src,
                }
            )
        })

        return productsOneVariant
    } catch (error) {
        console.error('Error getting Products Info:', error)
        throw error;
    }
}

async function getProductsByIds(ids) {
    try {
        if (!ids || ids.length === 0) {
            return [];
        }

        const productsCollection = admin.firestore().collection(process.env.NEXT_PUBLIC_COLL_PRODUCTS);

        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < ids.length; i += chunkSize) {
            chunks.push(ids.slice(i, i + chunkSize));
        }

        const promises = chunks.map(async chunk => {
            const querySnapshot = await productsCollection.where('id', 'in', chunk).get();
            return querySnapshot.docs.map(doc => doc.data());
        });

        const chunkResults = await Promise.all(promises);
        const mergedResults = chunkResults.flat();

        const products = {};
        mergedResults.forEach(product => {
            products[product.id] = product;
        });

        const orderedProducts = ids.map(id => {
            const foundProduct = products[id];
            if (!foundProduct) {
                throw new MyError({ message: `Product with ID ${id} not found` });
            }
            return foundProduct;
        })

        console.log('Products retrieved successfully by IDs!');
        return orderedProducts;
    } catch (error) {
        console.error('Error getting products by IDs:', error);
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
    getProductsByIds,
}