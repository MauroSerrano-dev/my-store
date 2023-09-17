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

export const T_SHIRTS_COLORS = [
    { id: 521, colors: ['#ffffff'], title: 'White' },
    { id: 418, colors: ['#000000'], title: 'Black' },
    { id: 358, colors: ['#CACACA'], title: 'Sport Grey' },
    { id: 362, colors: ['#31221D'], title: 'Dark Chocolate' },
    { id: 364, colors: ['#585c3b'], title: 'Military Green' },
    { id: 392, colors: ['#d6e6f7'], title: 'Light Blue' },
    { id: 424, colors: ['#585559'], title: 'Charcoal' },
    { id: 425, colors: ['#084f97'], title: 'Royal' },
    { id: 511, colors: ['#1a2237'], title: 'Navy' },
    { id: 423, colors: ['#C62A32'], title: 'Red' }
]

export const HOODIES_COLORS = [
    { id: 521, colors: ['#ffffff'], title: 'White' },
    { id: 418, colors: ['#000000'], title: 'Black' },
    { id: 358, colors: ['#CACACA'], title: 'Sport Grey' },
    { id: 395, colors: ['#642838'], title: 'Maroon' },
    { id: 364, colors: ['#585c3b'], title: 'Military Green' },
    { id: 369, colors: ['#129447'], title: 'Irish Green' },
    { id: 367, colors: ['#454545'], title: 'Dark Heather' },
    { id: 392, colors: ['#d6e6f7'], title: 'Light Blue' },
    { id: 425, colors: ['#084f97'], title: 'Royal' },
    { id: 511, colors: ['#1a2237'], title: 'Navy' },
    { id: 423, colors: ['#C62A32'], title: 'Red' }
]

export const T_SHIRTS_SIZES = [
    { id: 14, title: 'S' },
    { id: 15, title: 'M' },
    { id: 16, title: 'L' },
    { id: 17, title: 'XL' },
    { id: 18, title: '2XL' },
    { id: 19, title: '3XL' }
]
export const HOODIES_SIZES = [
    { id: 14, title: 'S' },
    { id: 15, title: 'M' },
    { id: 16, title: 'L' },
    { id: 17, title: 'XL' },
    { id: 18, title: '2XL' },
    { id: 19, title: '3XL' },
    { id: 20, title: '4XL' },
    { id: 21, title: '5XL' }
]

export const EU_COUNTRIES = ['BV', 'GE', 'SM', 'GI', 'GG', 'AT', 'HU', 'MD', 'HR', 'BE', 'IM', 'GR', 'IT', 'BY', 'GL', 'GP', 'LU', 'VA', 'JE', 'SK', 'BG', 'MK', 'PT', 'RE', 'FR', 'RO', 'TR', 'SI', 'XK', 'CZ', 'RS', 'ES', 'MC', 'ME', 'UA', 'AL', 'AM', 'CY', 'AX', 'AD', 'FO', 'BA', 'NL', 'MT']

export function getShippingOptions(country) {
    switch (EU_COUNTRIES.includes(country) ? 'EU' : country) {
        case 'US':
            return {
                't-shirts': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 475,
                    add_item: 240,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 849,
                    add_item: 209,
                    currency: 'usd'
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
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 1269,
                    add_item: 659,
                    currency: 'usd'
                },
            }
        case 'PL':
            return {
                't-shirts': {
                    provider: {
                        id: 87,
                        title: 'Print Logistic',
                    },
                    first_item: 499,
                    add_item: 119,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 699,
                    add_item: 239,
                    currency: 'usd'
                },
            }
        case 'DE':
            return {
                't-shirts': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 309,
                    add_item: 119,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 499,
                    add_item: 239,
                    currency: 'usd'
                },
            }
        case 'EU':
            return {
                't-shirts': {
                    provider: {
                        id: 87,
                        title: 'Print Logistic',
                    },
                    first_item: 569,
                    add_item: 199,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 26,
                        title: 'Textildruck Europa',
                    },
                    first_item: 699,
                    add_item: 239,
                    currency: 'usd'
                },
            }
        case 'UK':
            return {
                't-shirts': {
                    provider: {
                        id: 72,
                        title: 'Print Clever',
                    },
                    first_item: 429,
                    add_item: 199,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 72,
                        title: 'Print Clever',
                    },
                    first_item: 759,
                    add_item: 299,
                    currency: 'usd'
                },
            }
        case 'NZ':
            return {
                't-shirts': {
                    provider: {
                        id: 34,
                        title: 'The Print Bar',
                    },
                    first_item: 759,
                    add_item: 99,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 1500,
                    add_item: 1000,
                    currency: 'usd'
                },
            }
        case 'AU':
            return {
                't-shirts': {
                    provider: {
                        id: 34,
                        title: 'The Print Bar',
                    },
                    first_item: 609,
                    add_item: 129,
                    currency: 'usd'
                },
                'hoodies': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 2199,
                    add_item: 999,
                    currency: 'usd'
                },
            }
        default: return {
            't-shirts': {
                provider: {
                    id: 29,
                    title: 'Monster Digital',
                },
                first_item: 1000,
                add_item: 400,
                currency: 'usd'
            },
            'hoodies': {
                provider: {
                    id: 29,
                    title: 'Monster Digital',
                },
                first_item: 1500,
                add_item: 1000,
                currency: 'usd'
            },
        }
    }
}

export function convertDolarToCurrency(value, currency) {
    if (currency === 'usd')
        return value
    if (currency === 'gbp')
        return Math.round(value * 0.82)
    if (currency === 'eur')
        return Math.round(value * 0.94)
    if (currency === 'aud')
        return Math.round(value * 1.55)
    if (currency === 'brl')
        return Math.round(value * 4.87)
    if (currency === 'cad')
        return Math.round(value * 1.35)
    console.error('Currency not found')
    return null
}

export function getCurrencyByCode(code) {
    if (code === 'aud')
        return { code: 'aud', symbol: 'AU$' }
    if (code === 'brl')
        return { code: 'brl', symbol: 'R$' }
    if (code === 'cad')
        return { code: 'cad', symbol: 'CA$' }
    if (code === 'gbp')
        return { code: 'gbp', symbol: '£' }
    if (code === 'eur')
        return { code: 'eur', symbol: '€' }
    if (code === 'usd')
        return { code: 'usd', symbol: '$' }
    console.error('Currency not found')
    return null
}