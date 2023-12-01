export function getItemsTotal(products, userCurrencyRate) {
    if (products && userCurrencyRate)
        return products.reduce((acc, product) => acc + ((Math.round(product.variant.price * userCurrencyRate) * product.quantity)), 0)
    return null
}

export function getProductPriceUnit(product, userCurrencyRate) {
    if (product && userCurrencyRate)
        return Math.round(product.variant.price * userCurrencyRate) * (product.promotion ? 1 - product.promotion.percentage : 1)
    return null
}