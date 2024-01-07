import { LIMITS } from "@/consts"
import { mergeProducts } from "@/utils"

export function addProductsToVisitantCart(cart, products) {
    try {
        if (cart.products.reduce((acc, prod) => acc + prod.quantity, 0) + products.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw 'max_products'

        cart.products = mergeProducts(cart.products, products)

        return cart
    } catch (error) {
        console.error(error)
        throw error
    }
}