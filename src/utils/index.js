import { format } from 'date-fns';
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import ptBR from 'date-fns/locale/pt-BR'
import ptPT from 'date-fns/locale/pt'
import { LIMITS, PRODUCTS_TYPES } from '@/consts';
import Error from 'next/error';


export function getObjectsDiff(obj1, obj2) {
    const differentFields = {};

    for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
            differentFields[key] = obj1[key];
        } else if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
            const nestedDifferences = getObjectsDiff(obj1[key], obj2[key]);
            if (Object.keys(nestedDifferences).length > 0) {
                differentFields[key] = nestedDifferences;
            }
        } else if (obj1[key] !== obj2[key]) {
            differentFields[key] = obj1[key];
        }
    }

    for (const key in obj2) {
        if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
            differentFields[key] = obj2[key];
        }
    }

    return differentFields;
}

export function hasRepeatedItems(arr) {
    const values = new Set()
    for (const item of arr) {
        if (values.has(item)) {
            return true
        }
        values.add(item)
    }
    return false
}

export function mergeProducts(prods1, prods2) {
    return prods1.map(p => {
        const exist = prods2.find(prod => prod.id === p.id && prod.variant_id === p.variant_id)
        if (exist) {
            const newQuantity = p.quantity + exist.quantity
            if (newQuantity > LIMITS.cart_same_item)
                throw new Error({ code: 'max_same_products' })
            return { ...p, quantity: newQuantity }
        }
        else
            return p
    }).concat(prods2.filter(prod => !prods1.some(p => p.id === prod.id && p.variant_id === prod.variant_id)))
}

export function convertTimestampToFormatDate(timestamp, locale) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds * 0.000001)

    let selectedLocale = en
    let model = 'MMMM d, yyyy'

    if (locale === 'es') {
        selectedLocale = es
        model = 'd \'de\' MMMM, yyyy'
    }
    else if (locale === 'pt-BR') {
        selectedLocale = ptBR
        model = 'd \'de\' MMMM, yyyy'
    }
    else if (locale === 'pt') {
        selectedLocale = ptPT
        model = 'd \'de\' MMMM, yyyy'
    }

    return format(date, model, { locale: selectedLocale })
}

export function convertTimestampToFormatDateNoYear(timestamp, locale) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds * 0.000001)

    let selectedLocale = en
    let model = 'MMMM d'

    if (locale === 'es') {
        selectedLocale = es
        model = 'd \'de\' MMMM'
    }
    else if (locale === 'pt-BR') {
        selectedLocale = ptBR
        model = 'd \'de\' MMMM'
    }
    else if (locale === 'pt') {
        selectedLocale = ptPT
        model = 'd \'de\' MMMM'
    }

    return format(date, model, { locale: selectedLocale })
}

export function getDateFormat(country) {
    let model = "DD/MM/YYYY"

    if (country === 'US') {
        model = "MM/DD/YYYY"
    }

    return model
}

export function getProductVariantsInfos(product) {
    return product.variants.map(vari => ({ ...PRODUCTS_TYPES.find(type => type.id === product?.type_id).variants.find(va => va.id === vari.id), ...vari }))
}

export function getProductVariantInfo(variant, productType) {
    return { ...PRODUCTS_TYPES.find(type => type.id === productType).variants.find(va => va.id === variant.id), ...variant }
}

export function handleOpenModal(view, opacity, custom_value) {
    view(custom_value || true)
    opacity(true)
}

export function handleCloseModal(view, opacity, custom_value) {
    opacity(false)
    setTimeout(() => {
        view(custom_value || false)
        opacity(true)
    }, 300)
}

export function getVariantProfitBySizeId(product, sizeId, productType) {
    const futurePrice = product.variants.find(vari => vari.size_id === sizeId).price
    return ((futurePrice - PRODUCTS_TYPES.find(type => type.id === productType).variants.find(vari => vari.size_id === sizeId).cost) / 100).toFixed(2)
}

export function getVariantProfitBySizeIdPromotion(product, sizeId, productType) {
    const futurePrice = product.variants.find(vari => vari.size_id === sizeId).price * (product.promotion ? (1 - product.promotion.percentage) : 1)
    return ((futurePrice - PRODUCTS_TYPES.find(type => type.id === productType).variants.find(vari => vari.size_id === sizeId).cost) / 100).toFixed(2)
}