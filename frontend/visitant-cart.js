import { LIMITS } from "@/consts"
import { mergeProducts } from "@/utils"
import Error from "next/error"

export function addProductsToVisitantCart(cart, products) {
    try {
        if (cart.products.reduce((acc, prod) => acc + prod.quantity, 0) + products.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw new Error({ title: 'max_products', type: 'warning' })

        cart.products = mergeProducts(cart.products, products)

        return cart
    } catch (error) {
        console.error('Error Adding Product to Cart:', error)
        throw new Error({ title: error?.props?.title || 'default_error', type: error?.props?.type || 'error' })
    }
}