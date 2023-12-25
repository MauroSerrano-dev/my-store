/**
 * Converts properties of an object into a standardized model for a new user.
 * @param {Object} props - Properties of the user.
 * @param {string} props.email - The email of the user.
 * @param {string} props.first_name - The user's first name.
 * @param {string} props.last_name - The user's last name.
 * @param {string} props.cart_id - The user's cart ID.
 * @param {string} props.wishlist_id - The user's wishlist ID.
 * @param {Array<string>} props.quests - Tasks that the user must perform.
 * @param {Object} props.custom_home_page - Home page tags associated with the user.
 * @param {boolean} props.email_verified - Email verification status of the user.
 * @returns {Object} - Returns an object representing the model of the new user with corresponding properties.
 */
export function newUserModel(props) {
    const {
        email,
        first_name,
        last_name,
        cart_id,
        wishlist_id,
        quests = [],
        custom_home_page = {
            tags: [],
            active: false,
        },
        email_verified,
    } = props

    return {
        email: email,
        first_name: first_name,
        last_name: last_name,
        cart_id: cart_id,
        wishlist_id: wishlist_id,
        quests: quests,
        custom_home_page: custom_home_page,
        email_verified: email_verified,
    }
}

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