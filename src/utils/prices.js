export function getProductPriceUnit(product, variant, userCurrencyRate, a) {
    if (product && userCurrencyRate)
        return Math.round(variant.price * userCurrencyRate * (product.promotion ? 1 - product.promotion.percentage : 1))
    return null
}

export function getProductPriceWithoutPromotion(product, variant, userCurrencyRate) {
    if (product && userCurrencyRate)
        return Math.round(variant.price * userCurrencyRate)
    return null
}