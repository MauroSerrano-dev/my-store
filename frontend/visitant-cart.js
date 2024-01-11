import MyError from "@/classes/MyError"
import { CART_LOCAL_STORAGE, LIMITS } from "@/consts"
import { isSameProduct, mergeProducts } from "@/utils"

function addProductsToVisitantCart(cart, products) {
    try {
        if (cart.products.reduce((acc, prod) => acc + prod.quantity, 0) + products.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items)
            throw new MyError('max_products', 'warning')

        cart.products = mergeProducts(cart.products, products)

        saveVisitantCart(cart)
    } catch (error) {
        console.error('Error Adding Product to Cart:', error)
        throw error
    }
}

function deleteProductFromVisitantCart(product) {
    const visitantCart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))
    localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify({ ...visitantCart, products: visitantCart.products.filter(prod => !isSameProduct(prod, product)) }))
}

function changeVisitantCartProductField(product, fieldName, newValue) {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))
        const newProducts = cart.products.map(prod =>
            isSameProduct(prod, product)
                ? { ...prod, [fieldName]: newValue }
                : prod
        )

        const newCart = { ...cart, products: newProducts }

        saveVisitantCart(newCart)
    } catch (error) {
        console.error('Error in changeProductField:', error)
        throw error
    }
}

function saveVisitantCart(cart) {
    localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(cart))
}

export {
    addProductsToVisitantCart,
    changeVisitantCartProductField,
    deleteProductFromVisitantCart,
}