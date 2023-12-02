export function getProductPriceUnit(product, userCurrencyRate) {
    if (product && userCurrencyRate)
        return Math.round(product.variant.price * userCurrencyRate) * (product.promotion ? 1 - product.promotion.percentage : 1)
    return null
}