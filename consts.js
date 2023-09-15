export const STORE_NAME = 'MKJ'
export const CART_COOKIE = 'CART'

export const TAGS_POOL = [
    'games',
    'hoodies',
    't-shirts',
    'home',
    'pillows',
    'socks',
    'bed',
    'computer'
]

export const TYPES_POOL = [
    'hoodies',
    't-shirts',
    'pillows',
    'socks',
]

export function getShippingOptions(contry) {
    switch (contry) {
        case 'US':
            return {
                't-shirts': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 475,
                    add_item: 240,
                    currency: 'usd',
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 849,
                    add_item: 209,
                    currency: 'usd',
                },
            }
        case 'CA':
            return {
                't-shirts': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 939,
                    add_item: 439,
                    currency: 'usd',
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 1269,
                    add_item: 659,
                    currency: 'usd',
                },
            }
        case 'PL':
            return {
                't-shirts': {
                    provider: {
                        id: 87,
                        title: 'Print Logistic',
                    },
                    first_item: 464,
                    add_item: 111,
                    currency: 'eur',
                },
                'hoodies': {
                    provider: {
                        id: 87,
                        title: 'Print Logistic',
                    },
                    first_item: 612,
                    add_item: 185,
                    currency: 'eur',
                },
            }
        case 'DE':
            return {
                't-shirts': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 287,
                    add_item: 111,
                    currency: 'eur',
                },
                'hoodies': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 464,
                    add_item: 222,
                    currency: 'eur',
                },
            }
        case 'EU':
            return {
                't-shirts': {
                    provider: {
                        id: 87,
                        title: 'Print Logistic',
                    },
                    first_item: 529,
                    add_item: 185,
                    currency: 'eur',
                },
                'hoodies': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 649,
                    add_item: 222,
                    currency: 'eur',
                },
            }
        case 'UK':
            return {
                't-shirts': {
                    provider: {
                        id: 72,
                        title: 'Print Clever',
                    },
                    first_item: 360,
                    add_item: 167,
                    currency: 'gbp',
                },
                'hoodies': {
                    provider: {
                        id: 72,
                        title: 'Print Clever',
                    },
                    first_item: 637,
                    add_item: 251,
                    currency: 'gbp',
                },
            }
        default: return {
            't-shirts': {
                provider: {
                    id: 29,
                    title: 'Monster Digital',
                },
                first_item: 475,
                add_item: 240,
                currency: 'usd',
            },
            'hoodies': {
                provider: {
                    id: 29,
                    title: 'Monster Digital',
                },
                first_item: 849,
                add_item: 209,
                currency: 'usd',
            },
        }
    }
}