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
            return { ...p, quantity: p.quantity + exist.quantity }
        else
            return p
    }).concat(prods2.filter(prod => !prods1.some(p => p.id === prod.id && p.variant_id === prod.variant_id)))
}