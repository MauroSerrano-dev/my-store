import axios from 'axios'

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

function isProductNotInPrintify(printifyProducts, product) {
    return !printifyProducts.some(p => p.id === product.id_printify && p.variants.some(v => v.id === product.variant.id_printify))
}

async function filterNotInPrintify(cartItems) {
    let notInPrintify = [...cartItems];
    let currentPage = 1;
    let lastPage = false;

    while (!lastPage) {
        const { data } = await fetchPrintifyProducts(currentPage);
        notInPrintify = notInPrintify.filter(prod => isProductNotInPrintify(data, prod));
        lastPage = data.length === 0;
        currentPage++;
    }

    return notInPrintify;
}

function isProductInPrintifyData(printifyProducts, product) {
    return Object.values(product.printify_ids).every(printifyId =>
        printifyProducts.some(p => p.id === printifyId)
    );
}

async function isProductInPrintify(product) {
    let currentPage = 1;
    let lastPage = false;

    while (!lastPage) {
        const { data } = await fetchPrintifyProducts(currentPage);
        if (isProductInPrintifyData(data, product)) {
            return true;
        }
        lastPage = data.length === 0;
        currentPage++;
    }

    return false;
}

async function fetchFilteredPrintifyProducts(provider_id, blueprint_id, limit = 30, pageNumber = 1) {
    const allProducts = await fetchAllPrintifyProducts();

    // Filtrando produtos com base no blueprint_id e provider_id
    const filteredProducts = allProducts.filter(product =>
        product.blueprint_id === blueprint_id &&
        product.print_provider_id === provider_id
    )

    // Calculando a última página
    const totalFiltered = filteredProducts.length;
    const lastPageNumber = Math.ceil(totalFiltered / limit);

    // Selecionando produtos para a página atual
    const startIndex = (pageNumber - 1) * limit;
    const selectedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
        data: selectedProducts,
        last_page: lastPageNumber
    };
}

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