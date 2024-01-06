import axios from 'axios'

/**
 * Fetches a specific page of products from Printify.
 * 
 * @param {number} page - The page number to fetch products from.
 * @returns {Promise<Object>} A promise that resolves to the data of the fetched products.
 * @throws {Error} Throws an error if the request fails.
 */
async function fetchPrintifyProducts(page) {
    const url = `${`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`}?page=${page}`;
    try {
        const response = await axios.get(url, { headers: { Authorization: process.env.PRINTIFY_ACCESS_TOKEN } });
        return response.data;
    } catch (error) {
        console.error("Error when searching for Printify products:", error);
        throw error;
    }
}

/**
 * Fetches all products across all pages from Printify.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of all products.
 * @throws {Error} Throws an error if any request fails.
 */
async function fetchAllPrintifyProducts() {
    let currentPage = 1;
    let lastPage = false;
    let allProducts = [];

    while (!lastPage) {
        const url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json?page=${currentPage}`;
        try {
            const response = await axios.get(url, { headers: { Authorization: process.env.PRINTIFY_ACCESS_TOKEN } });
            allProducts = allProducts.concat(response.data.data); // Adiciona os produtos da página atual ao array

            if (response.data.data.length === 0) {
                lastPage = true; // Se a página atual for a última, termina o loop
            } else {
                currentPage++; // Caso contrário, avança para a próxima página
            }
        } catch (error) {
            console.error("Error when searching for Printify products:", error);
            throw error; // Lança o erro se a requisição falhar
        }
    }

    return allProducts; // Retorna todos os produtos de todas as páginas
}

/**
 * Filters out cart items that are not available in Printify products.
 * 
 * @param {Array} cartItems - An array of cart items to be checked against Printify products.
 * @returns {Promise<Array>} A promise that resolves to an array of cart items not available in Printify.
 */
async function filterNotInPrintify(cartItems) {
    let notInPrintify = [...cartItems];
    let currentPage = 1;
    let lastPage = false;

    while (!lastPage) {
        const { data } = await fetchPrintifyProducts(currentPage);
        notInPrintify = notInPrintify.filter(prod => !data.some(p => p.id === prod.id_printify && p.variants.some(v => v.id === prod.variant.id_printify)));
        lastPage = data.length === 0;
        currentPage++;
    }

    return notInPrintify;
}

/**
 * Checks if a product is available in Printify.
 * 
 * @param {Object} product - The product object to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the product is available in Printify.
 */
async function isProductInPrintify(product) {
    let currentPage = 1;
    let lastPage = false;
    let printify_ids = typeof Object.values(product.printify_ids)[0] === 'string'
        ? Object.values(product.printify_ids)
        : Object.values(product.printify_ids).reduce((acc, ids) => acc.concat(Object.values(ids)), [])

    while (!lastPage) {
        const { data } = await fetchPrintifyProducts(currentPage);
        printify_ids = printify_ids.filter(id => !data.map(print_prod => print_prod.id).includes(id))
        if (printify_ids.length === 0)
            return true
        lastPage = data.length === 0;
        currentPage++;
    }

    return false;
}

/**
 * Fetches filtered Printify products based on provider and blueprint IDs.
 * 
 * @param {string} provider_id - The provider ID to filter products by.
 * @param {string} blueprint_id - The blueprint ID to filter products by.
 * @param {number} limit - The maximum number of products to return. `Default: 30`
 * @param {number} pageNumber - The page number to fetch products from. `Default: 1`
 * @returns {Promise<Object>} A promise that resolves to an object containing filtered products and pagination data.
 */
async function fetchFilteredPrintifyProducts(provider_id, blueprint_id, limit = 30, pageNumber = 1) {
    const allProducts = await fetchAllPrintifyProducts();

    const filteredProducts = allProducts.filter(product =>
        product.blueprint_id === blueprint_id &&
        product.print_provider_id === provider_id
    )

    const totalFiltered = filteredProducts.length;
    const lastPageNumber = Math.ceil(totalFiltered / limit);

    const startIndex = (pageNumber - 1) * limit;
    const selectedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
        data: selectedProducts,
        last_page: lastPageNumber
    };
}

/**
 * Fetches a specific product from Printify by its product ID.
 * 
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the product object if found, or null if not found.
 */
async function getProductFromPrintify(productId) {
    const allProducts = await fetchAllPrintifyProducts()

    const product = allProducts.find(p => p.id === productId)

    return product || null
}

export {
    filterNotInPrintify,
    isProductInPrintify,
    fetchFilteredPrintifyProducts,
    getProductFromPrintify,
}