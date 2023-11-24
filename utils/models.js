/**
 * Converts the properties of a cart item into a standardized model.
 * @param {Object} props - Properties of the cart item.
 * @param {string} props.id - The ID of the item.
 * @param {number} props.quantity - The quantity of the item.
 * @param {string} props.title - The title/name of the item.
 * @param {string} props.image - The image URL of the item.
 * @param {Array<string>} props.blueprint_ids - The blueprint IDs associated with the item.
 * @param {string} props.description - The description of the item.
 * @param {string} props.id_printify - The Printify ID of the item.
 * @param {string} props.provider_id - The provider ID of the item.
 * @param {Object} props.variant - The variant information of the item.
 * @param {string} props.variant_id - The ID of the variant.
 * @param {string | number} props.variant_id_printify - The Printify ID of the variant.
 * @param {number} props.price - The price of the item.
 * @returns {Object} - Returns an object representing the model of the cart item.
 */
export function cartItemModel(props) {
    const {
        id,
        quantity,
        title,
        image,
        blueprint_ids,
        description,
        id_printify,
        provider_id,
        variant,
        variant_id_printify,
        price
    } = props

    return {
        id: id,
        quantity: quantity,
        title: title,
        image: image,
        blueprint_ids: blueprint_ids,
        description: description,
        id_printify: id_printify,
        provider_id: provider_id,
        variant: variant,
        variant_id_printify: variant_id_printify,
        price: price,
    }
}