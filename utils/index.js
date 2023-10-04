export function getProductsDiff(obj1, obj2) {
    const differentFields = {};

    for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
            differentFields[key] = obj1[key];
        } else if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
            const nestedDifferences = getProductsDiff(obj1[key], obj2[key]);
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