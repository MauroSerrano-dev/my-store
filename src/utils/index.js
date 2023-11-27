import { format } from 'date-fns';
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import ptBR from 'date-fns/locale/pt-BR'
import ptPT from 'date-fns/locale/pt'
import { CART_MAX_ITEMS } from '@/consts';


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
        if (exist)
            return { ...p, quantity: Math.min(p.quantity + exist.quantity, CART_MAX_ITEMS) }
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
    else if (locale === 'pt-PT') {
        selectedLocale = ptPT
        model = 'd \'de\' MMMM, yyyy'
    }
    
    return format(date, model, { locale: selectedLocale })
}