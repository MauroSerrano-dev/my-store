import { hasRepeatedItems } from ".";
import { showToast } from "./toasts";

export function isNewProductValid(product, images) {
    const requiredTextFields = [{ id: 'id', title: 'ID' }, { id: 'title', title: 'Title' }, { id: 'description', title: 'Description' }, { id: 'collection_id', title: 'Collection' }]
    const hasEmptyTextField = requiredTextFields.some(fieldName => {
        if (product[fieldName.id] === '') {
            showToast({ msg: `${fieldName.title} missing.`, type: 'error' })
            return true
        }
        return false
    })
    if (hasEmptyTextField)
        return false
    const requiredArrFields = [{ id: 'themes', title: 'Themes' }, { id: 'tags', title: 'Tags' }]

    const hasEmptyArrField = requiredArrFields.some(fieldName => {
        if (product[fieldName.id].length === 0) {
            showToast({ msg: `${fieldName.title} missing.`, type: 'error' })
            return true
        }
        return false
    })
    if (hasEmptyArrField)
        return false
    if (Object.values(product.printify_ids).some(id => id === '')) {
        showToast({ msg: 'Some printify id missing.', type: 'error' })
        return false
    }
    if (hasRepeatedItems(Object.values(product.printify_ids))) {
        showToast({ msg: 'Printify ids must be unique.', type: 'error' })
        return false
    }
    if (product.colors?.length === 0 || product.colors_ids?.length === 0) {
        showToast({ msg: 'Choose at least one color.', type: 'error' })
        return false
    }
    if (product.sizes?.length === 0 || product.sizes_ids?.length === 0) {
        showToast({ msg: 'Choose at least one size.', type: 'error' })
        return false
    }
    console.log('anal')
    if (Object.values(images).some(imgs => imgs.some(img => img.src === ''))) {
        showToast({ msg: 'Image src missing.', type: 'error' })
        return false
    }
    if (product.variants.some(vari => vari.art.color_id === null)) {
        showToast({ msg: 'Art Color missing.', type: 'error' })
        return false
    }
    if (product.variants.some(vari => vari.art.id === null)) {
        showToast({ msg: 'Art ID missing.', type: 'error' })
        return false
    }
    return true
}