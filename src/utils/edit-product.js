import MyError from "@/classes/MyError";
import { hasRepeatedItems } from ".";
import { showToast } from "./toasts";
import { LIMITS, PRODUCTS_TYPES, getShippingOptions } from "@/consts";

export function isNewProductValid(product, images, translate) {
    const requiredTextFields = [{ id: 'id', title: 'ID' }, { id: 'title', title: 'Title' }, { id: 'description', title: 'Description' }]
    const hasEmptyTextField = requiredTextFields.some(fieldName => {
        if (product[fieldName.id] === '') {
            showToast({ type: 'error', msg: translate('field_name_missing', { field_name: fieldName.title }) })
            return true
        }
        return false
    })
    if (hasEmptyTextField)
        return false

    if (Object.values(product.printify_ids).some(id => id === '')) {
        showToast({ type: 'error', msg: translate('some_printify_id_missing') })
        return false
    }
    if (hasRepeatedItems(Object.values(product.printify_ids))) {
        showToast({ type: 'error', msg: translate('printify_ids_must_be_unique') })
        return false
    }
    if (product.colors?.length === 0 || product.colors_ids?.length === 0) {
        showToast({ type: 'error', msg: translate('choose_at_least_one_color') })
        return false
    }
    if (product.sizes?.length === 0 || product.sizes_ids?.length === 0) {
        showToast({ type: 'error', msg: translate('choose_at_least_one_size') })
        return false
    }
    if (Object.values(images).some(imgs => imgs.some(img => img.src === ''))) {
        showToast({ type: 'error', msg: translate('image_src_missing') })
        return false
    }
    if (product.variants.some(vari => vari.art.color_id === null)) {
        showToast({ type: 'error', msg: translate('art_color_missing') })
        return false
    }
    if (product.variants.some(vari => vari.art.id === null)) {
        showToast({ type: 'error', msg: translate('art_id_missing') })
        return false
    }

    return true
}
export function isProductValid(product) {
    const requiredTextFields = [{ id: 'id', title: 'ID' }, { id: 'title', title: 'Title' }, { id: 'description', title: 'Description' }]
    requiredTextFields.forEach(fieldName => {
        if (product[fieldName.id] === '')
            throw new MyError({ message: 'field_name_missing', options: { field_name: fieldName.title } })
    })

    if (Object.values(product.printify_ids).some(id => id === ''))
        throw new MyError({ message: 'some_printify_id_missing' })

    if (hasRepeatedItems(Object.values(product.printify_ids)))
        throw new MyError({ message: 'printify_ids_must_be_unique' })

    if (product.colors?.length === 0 || product.colors_ids?.length === 0)
        throw new MyError({ message: 'choose_at_least_one_color' })

    if (product.sizes?.length === 0 || product.sizes_ids?.length === 0)
        throw new MyError({ message: 'choose_at_least_one_size' })

    if (product.images.some(img => img.src === ''))
        throw new MyError({ message: 'image_src_missing' })

    if (product.variants.some(vari => vari.art.color_id === null))
        throw new MyError({ message: 'art_color_missing' })

    if (product.variants.some(vari => vari.art.id === null))
        throw new MyError({ message: 'art_id_missing' })

    const type = PRODUCTS_TYPES.find(type => type.id === product.type_id)
    const variants = product.variants.map(variant => ({
        ...variant,
        cost: type.variants.find(vari => vari.id === variant.id).cost
    }))

    if (variants.some(vari => vari.cost + LIMITS.min_profit >= vari.price * (product.promotion ? 1 - product.promotion.percentage : 1)))
        throw new MyError({ message: 'invalid_price' })
}

export function getProductPrintifyIdsUniquePosition(printify_ids, position) {
    return Object.keys(printify_ids).reduce((acc, provider_id) => ({ ...acc, [provider_id]: typeof printify_ids[provider_id] === 'string' ? printify_ids[provider_id] : printify_ids[provider_id][position || 'front'] }), {})
}

export function getShippingValue(products, country, currencyRate) {
    let value = 0
    let typesAlreadyIn = []

    value = products.reduce((acc, item) => {
        const values = getShippingOptions(item.type_id, country)
        const result = acc + (
            typesAlreadyIn.includes(item.type_id)
                ? ((values.add_item + values.add_tax) * item.quantity)
                : ((values.first_item + values.tax) + ((values.add_item + values.add_tax) * (item.quantity - 1)))
        )
        typesAlreadyIn.push(item.type_id)
        return result
    }
        , 0
    )

    return Math.round(value * currencyRate)
}