import { hasRepeatedItems } from ".";
import { showToast } from "./toasts";

export function isNewProductValid(product, images) {
    const requiredTextFields = [{ id: 'id', title: 'ID' }, { id: 'title', title: 'Title' }, { id: 'description', title: 'Description' }]
    const hasEmptyTextField = requiredTextFields.some(fieldName => {
        if (product[fieldName.id] === '') {
            showToast({ type: 'error', msg: tToasts('field_name_missing', { field_name: fieldName.title }) })
            return true
        }
        return false
    })
    if (hasEmptyTextField)
        return false

    if (Object.values(product.printify_ids).some(id => id === '')) {
        showToast({ type: 'error', msg: tToasts('some_printify_id_missing') })
        return false
    }
    if (hasRepeatedItems(Object.values(product.printify_ids))) {
        showToast({ type: 'error', msg: 'printify_ids_must_be_unique' })
        return false
    }
    if (product.colors?.length === 0 || product.colors_ids?.length === 0) {
        showToast({ type: 'error', msg: 'choose_at_least_one_color' })
        return false
    }
    if (product.sizes?.length === 0 || product.sizes_ids?.length === 0) {
        showToast({ type: 'error', msg: 'choose_at_least_one_size' })
        return false
    }
    if (Object.values(images).some(imgs => imgs.some(img => typeof img.src === 'string' ? img.src === '' : (img.src.front === '' || img.src.back === '')))) {
        showToast({ type: 'error', msg: 'image_src_missing' })
        return false
    }
    if (product.variants.some(vari => vari.art.color_id === null)) {
        showToast({ type: 'error', msg: 'art_color_missing' })
        return false
    }
    if (product.variants.some(vari => vari.art.id === null)) {
        showToast({ type: 'error', msg: 'art_id_missing' })
        return false
    }
    return true
}