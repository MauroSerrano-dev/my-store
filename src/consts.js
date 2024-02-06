export const languageToCountry = {
    en: 'en',
    es: 'es',
    'pt-BR': 'br',
    'pt': 'pt'
}

export const INICIAL_VISITANT_CART = { products: [] }

export const DEFAULT_LANGUAGE = 'en'

export const DEFAULT_CURRENCY = 'usd'

export const COMMON_TRANSLATES = [
    'common',
    'colors',
    'menu',
    'navbar',
    'toasts',
    'languages',
    'categories',
    'page-error',
]

export const CART_LOCAL_STORAGE = 'visitant-cart'
export const CURRENCY_LOCAL_STORAGE = 'currency'
export const DONT_SHOW_POS_ADD = 'dont_show_pa_modal'

export const LIMITS = {
    shipping_value: 5,
    cart_same_item: 10,
    cart_items: 20,
    wishlist_products: 60,
    input_email: 50,
    input_first_name: 25,
    input_last_name: 25,
    input_password: 30,
    input_search_bar: 200,
    input_country: 20,
    input_min_max: 4,
    min_profit: 400,
    max_products_in_carousel: 16,
    max_products_in_search_page: 60,
}

export const STEPS = [
    'sending-to-production',
    'in-production',
    'shipment-in-transit',
    'shipment-delivered',
]

export const STEPS_ATTEMPT = [
    'sending-to-production',
    'in-production',
    'shipment-in-transit',
    'shipment-delivery-attempt',
    'shipment-delivered',
]

export const ALLOWED_WEBHOOK_STATUS = STEPS.concat(STEPS_ATTEMPT).concat('canceled')

export const DEFAULT_PRODUCTS_TAGS = [
    't-shirts',
    'hoodies',
    'games',
    'music',
    'japan',
    'rpg',
    'space',
]

export const CURRENCIES = {
    brl: { code: 'brl', symbol: 'R$', search_options: [{ max: '90' }, { min: '90', max: '120' }, { min: '120', max: '160' }, { min: '160' }] },
    gbp: { code: 'gbp', symbol: '£', search_options: [{ max: '20' }, { min: '20', max: '30' }, { min: '30', max: '50' }, { min: '50' }] },
    eur: { code: 'eur', symbol: '€', search_options: [{ max: '20' }, { min: '20', max: '30' }, { min: '30', max: '50' }, { min: '50' }] },
    usd: { code: 'usd', symbol: '$', search_options: [{ max: '20' }, { min: '20', max: '30' }, { min: '30', max: '50' }, { min: '50' }] },
}

export const NAVBAR_ITEMS = [
    { id: 't-shirts', query: 'v' },
    { id: 'hoodies', query: 'v' },
    { id: 'mugs', query: 'v' },
    { id: 'sweatshirts', query: 'v' },
    { id: 'long-sleeve', query: 't' },
    { id: 'promotion', query: 't' },
]

export const TAGS_POOL = [
    'baseball',
    'bed',
    'couples',
    'funny',
    'glitch',
    'guitar',
    'hood',
    'short-sleeve',
    'long-sleeve',
    'pillow',
    'raglan',
    'rock',
    'tee',
    'promotion',
]

export const THEMES_POOL = [
    'computer',
    'games',
    'halloween',
    'home',
    'music',
    'rpg',
    'zombies',
    'japan',
    'animals',
    'space',
]

export const SEARCH_FILTERS = [
    {
        id: 'categories',
        query: 'h',
        options: [
            'computer',
            'games',
            'music',
        ]
    },
    {
        id: 'products',
        query: 'v',
        options: [
            't-shirts',
            'hoodies',
            'raglan-tees',
            'sweatshirts',
            'mugs',
        ]
    },
    {
        id: 'most-searched',
        query: 't',
        options: [
            'promotion',
            'long-sleeve',
            'funny',
            'birthday',
            'for-couples',
        ]
    }
]

export const COLORS_POOL = {
    358: { id: 358, id_string: 'sport-grey', colors: ['#cacaca'] },
    362: { id: 362, id_string: 'dark-chocolate', colors: ['#31221d'] },
    364: { id: 364, id_string: 'military-green', colors: ['#585c3b'] },
    367: { id: 367, id_string: 'dark-heather', colors: ['#454545'] },
    369: { id: 369, id_string: 'irish-green', colors: ['#129447'] },
    392: { id: 392, id_string: 'light-blue', colors: ['#d6e6f7'] },
    395: { id: 395, id_string: 'maroon', colors: ['#642838'] },
    416: { id: 416, id_string: 'forest-green', colors: ['#223b26'] },
    418: { id: 418, id_string: 'black', colors: ['#000000'] },
    420: { id: 420, id_string: 'orange', colors: ['#ea5f22'] },
    421: { id: 421, id_string: 'sand', colors: ['#dcd2be'] },
    423: { id: 423, id_string: 'red', colors: ['#c62A32'] },
    424: { id: 424, id_string: 'charcoal', colors: ['#585559'] },
    425: { id: 425, id_string: 'royal', colors: ['#084f97'] },
    429: { id: 429, id_string: 'heliconia', colors: ['#df5086'] },
    433: { id: 433, id_string: 'light-pink', colors: ['#fee0eb'] },
    451: { id: 451, id_string: 'ash', colors: ['#f6f6f6'] },
    511: { id: 511, id_string: 'navy', colors: ['#1a2237'] },
    521: { id: 521, id_string: 'white', colors: ['#ffffff'] },
    1058: { id: 1058, id_string: 'royal-white', colors: ['#2b4da4', '#ffffff'] },
    1062: { id: 1062, id_string: 'black-white', colors: ['#000000', '#ffffff'] },
    1535: { id: 1535, id_string: 'asphalt-white', colors: ['#525455', '#ffffff'] },
    1536: { id: 1536, id_string: 'scarlet-white', colors: ['#bA2326', '#ffffff'] },
    1750: { id: 1750, id_string: 'white-black', colors: ['#ffffff', '#000000'] },
    1792: { id: 1792, id_string: 'green-white', colors: ['#026539', '#ffffff'] },
    1795: { id: 1795, id_string: 'navy-white', colors: ['#1a1f35', '#ffffff'] },
    2620: { id: 2620, id_string: 'white-m', colors: ['#ffffff'] },
    2621: { id: 2621, id_string: 'black-m', colors: ['#000000'] },
    2662: { id: 2662, id_string: 'blue-m', colors: ['#313da6'] },
    2663: { id: 2663, id_string: 'red-m', colors: ['#cd3f3a'] },
    2665: { id: 2665, id_string: 'pink-m', colors: ['#daa2a6'] },
}

export const SEARCH_PRODUCT_COLORS = [
    { id: 1, color_display: { color: '#000000', id_string: 'black' }, colors: [COLORS_POOL[418], COLORS_POOL[1750]] },
    { id: 2, color_display: { color: '#ffffff', id_string: 'white' }, colors: [COLORS_POOL[521], COLORS_POOL[1062]] },
    { id: 3, color_display: { color: '#525455', id_string: 'grey' }, colors: [COLORS_POOL[367], COLORS_POOL[424], COLORS_POOL[1535]] },
    { id: 4, color_display: { color: '#cacaca', id_string: 'light-grey' }, colors: [COLORS_POOL[358]] },
    { id: 5, color_display: { color: '#2b4da4', id_string: 'blue' }, colors: [COLORS_POOL[425], COLORS_POOL[1058], COLORS_POOL[392]] },
    { id: 6, color_display: { color: '#1a1f35', id_string: 'navy' }, colors: [COLORS_POOL[511], COLORS_POOL[1795]] },
    { id: 7, color_display: { color: '#026539', id_string: 'green' }, colors: [COLORS_POOL[364], COLORS_POOL[369], COLORS_POOL[1792]] },
    { id: 8, color_display: { color: '#e0824b', id_string: 'orange' }, colors: [COLORS_POOL[420]] },
    { id: 9, color_display: { color: '#c62A32', id_string: 'red' }, colors: [COLORS_POOL[423], COLORS_POOL[1536], COLORS_POOL[395]] },
    { id: 10, color_display: { color: '#31221d', id_string: 'brown' }, colors: [COLORS_POOL[362]] },
]

export const SEARCH_ART_COLORS = [
    { id: 1, color_display: { color: '#000000', id_string: 'black' } },
    { id: 2, color_display: { color: '#ffffff', id_string: 'white' } },
    { id: 3, color_display: { color: '#525455', id_string: 'grey' } },
    { id: 4, color_display: { color: '#2b4da4', id_string: 'blue' } },
    { id: 5, color_display: { color: '#026539', id_string: 'green' } },
    { id: 6, color_display: { color: '#e0824b', id_string: 'orange' } },
    { id: 7, color_display: { color: '#c62A32', id_string: 'red' } },
    { id: 8, color_display: { color: '#31221d', id_string: 'brown' } },
]

export const SIZES_POOL = [
    { id: 14, title: 'S' },
    { id: 15, title: 'M' },
    { id: 16, title: 'L' },
    { id: 17, title: 'XL' },
    { id: 18, title: '2XL' },
    { id: 1189, title: '11oz' },
]

export const PROVIDERS_POOL = {
    1: { id: 1, title: 'SPOKE Custom Products' },
    6: { id: 6, title: 'T Shirt and Sons' },
    26: { id: 26, title: 'Textildruck Europa' },
    27: { id: 27, title: 'Print Geek' },
    28: { id: 28, title: 'District Photo' },
    29: { id: 29, title: 'Monster Digital' },
    39: { id: 39, title: 'SwiftPOD' },
    43: { id: 43, title: 'Stoked On Printing' },
    50: { id: 50, title: 'Underground Threads' },
    87: { id: 87, title: 'Print Logistic' },
}

export const MENU_OPTIONS = [
    { id: 'home', type: 'link', href: '/' },
    { id: 'products', type: 'forward', value: 'products' },
    { id: 'collections', type: 'forward', value: 'collections' },
    { id: 'most-searched', type: 'forward', value: 'most-searched' },
    { id: 'contacts', type: 'link', href: '/contact' },
    { id: 'support', type: 'link', href: '/support' },
]

export const COLLECTIONS = [
    { id: 'sound-vibes', title: 'Sound Vibes', color: '#252c5e' },
    { id: 'gamer-life', title: 'Gamer Life', color: null },
]

export const MENU_FORWARD_OPTIONS = {
    products: [
        { id: 't-shirts', type: 'link', href: '/search?v=t-shirts' },
        { id: 'raglan-tees', type: 'link', href: '/search?v=raglan-tees' },
        { id: 'hoodies', type: 'link', href: '/search?v=hoodies' },
        { id: 'sweatshirts', type: 'link', href: '/search?v=sweatshirts' },
        { id: 'mugs', type: 'link', href: '/search?v=mugs' },
    ],
    collections: COLLECTIONS.map(coll => ({ id: coll.title, type: 'link', href: `/search?c=${coll.id}` })),
    'most-searched': [
        { id: 'promotion', type: 'link', href: '/search?t=promotion' },
        { id: 'long-sleeve', type: 'link', href: '/search?t=long-sleeve' },
        { id: 'funny', type: 'link', href: '/search?t=funny' },
        { id: 'for-couples', type: 'link', href: '/search?t=for-couples' },
    ]
}

export const PRODUCTS_FAMILY = {
    't-shirts': { id: 't-shirts', color: '#1189c4' },
    'hoodies': { id: 'hoodies', color: '#026539' },
    'mugs': { id: 'mugs', color: '#bA2326' },
    'sweatshirts': { id: 'sweatshirts', color: '#000000' },
    'socks': { id: 'socks', color: '#000000' },
}

export const POPULARITY_POINTS = {
    visit: 1,
    putOnCart: 5,
    share: 20,
    purchase: 100,
}

export const PRODUCTS_TYPES = [
    {
        id: 't-shirt',
        family_id: 't-shirts',
        color: '#1189c4',
        allow_back_variant: true,
        providers: [29, 87],
        blueprint_ids: {
            29: 145,
            87: 145,
        },
        icon: '/svgs/products-types/t-shirt_icon.svg',
        inicial_tags: ['short-sleeve'],
        key_features: ['without-side', 'ribbed-knit', 'shoulder-tape', 'fabric'],
        care_instructions: ['machine-wash-cold', 'not-dryclean', 'not-bleach', 'tumble-dry-low', 'iron-low'],
        metrics: { width: [45.72, 50.8, 55.88, 60.96, 66.04], length: [71.12, 73.66, 76.2, 78.74, 81.28], sleeve: [20.9, 21.6, 22.2, 22.9, 23.5] },
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 418, 358, 362, 364, 369, 392, 424, 425, 511, 423],
        variants: [
            {
                id: 'black-s',
                id_printify: {
                    29: 38164,
                    87: 38164,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 418,
                size_id: 14,
            },
            {
                id: 'military-green-s',
                id_printify: {
                    29: 38166,
                    87: 38166,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 364,
                size_id: 14,
            },
            {
                id: 'charcoal-s',
                id_printify: {
                    29: 38153,
                    87: 38153,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 424,
                size_id: 14,
            },
            {
                id: 'dark-chocolate-s',
                id_printify: {
                    29: 38155,
                    87: 38155,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 362,
                size_id: 14,
            },
            {
                id: 'irish-green-s',
                id_printify: {
                    29: 38156,
                    87: 38156,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 369,
                size_id: 14,
            },
            {
                id: 'light-blue-s',
                id_printify: {
                    29: 38157,
                    87: 38157,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 392,
                size_id: 14,
            },
            {
                id: 'navy-s',
                id_printify: {
                    29: 38158,
                    87: 38158,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 511,
                size_id: 14,
            },
            {
                id: 'red-s',
                id_printify: {
                    29: 38160,
                    87: 38160,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 423,
                size_id: 14,
            },
            {
                id: 'royal-s',
                id_printify: {
                    29: 38161,
                    87: 38161,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 425,
                size_id: 14,
            },
            {
                id: 'white-s',
                id_printify: {
                    29: 38163,
                    87: 38163,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 521,
                size_id: 14,
            },
            {
                id: 'sport-grey-s',
                id_printify: {
                    29: 38162,
                    87: 38162,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 358,
                size_id: 14,
            },
            {
                id: 'black-m',
                id_printify: {
                    29: 38178,
                    87: 38178,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 418,
                size_id: 15,
            },
            {
                id: 'military-green-m',
                id_printify: {
                    29: 38180,
                    87: 38180,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 364,
                size_id: 15,
            },
            {
                id: 'charcoal-m',
                id_printify: {
                    29: 38167,
                    87: 38167,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 424,
                size_id: 15,
            },
            {
                id: 'dark-chocolate-m',
                id_printify: {
                    29: 38169,
                    87: 38169,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 362,
                size_id: 15,
            },
            {
                id: 'irish-green-m',
                id_printify: {
                    29: 38170,
                    87: 38170,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 369,
                size_id: 15,
            },
            {
                id: 'light-blue-m',
                id_printify: {
                    29: 38171,
                    87: 38171,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 392,
                size_id: 15,
            },
            {
                id: 'navy-m',
                id_printify: {
                    29: 38172,
                    87: 38172,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 511,
                size_id: 15,
            },
            {
                id: 'red-m',
                id_printify: {
                    29: 38174,
                    87: 38174,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 423,
                size_id: 15,
            },
            {
                id: 'royal-m',
                id_printify: {
                    29: 38175,
                    87: 38175,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 425,
                size_id: 15,
            },
            {
                id: 'white-m',
                id_printify: {
                    29: 38177,
                    87: 38177,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 521,
                size_id: 15,
            },
            {
                id: 'sport-grey-m',
                id_printify: {
                    29: 38176,
                    87: 38176,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 358,
                size_id: 15,
            },
            {
                id: 'black-l',
                id_printify: {
                    29: 38192,
                    87: 38192,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 418,
                size_id: 16,
            },
            {
                id: 'military-green-l',
                id_printify: {
                    29: 38194,
                    87: 38194,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 364,
                size_id: 16,
            },
            {
                id: 'charcoal-l',
                id_printify: {
                    29: 38181,
                    87: 38181,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 424,
                size_id: 16,
            },
            {
                id: 'dark-chocolate-l',
                id_printify: {
                    29: 38183,
                    87: 38183,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 362,
                size_id: 16,
            },
            {
                id: 'irish-green-l',
                id_printify: {
                    29: 38184,
                    87: 38184,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 369,
                size_id: 16,
            },
            {
                id: 'light-blue-l',
                id_printify: {
                    29: 38185,
                    87: 38185,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 392,
                size_id: 16,
            },
            {
                id: 'navy-l',
                id_printify: {
                    29: 38186,
                    87: 38186,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 511,
                size_id: 16,
            },
            {
                id: 'red-l',
                id_printify: {
                    29: 38188,
                    87: 38188,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 423,
                size_id: 16,
            },
            {
                id: 'royal-l',
                id_printify: {
                    29: 38189,
                    87: 38189,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 425,
                size_id: 16,
            },
            {
                id: 'white-l',
                id_printify: {
                    29: 38191,
                    87: 38191,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 521,
                size_id: 16,
            },
            {
                id: 'sport-grey-l',
                id_printify: {
                    29: 38190,
                    87: 38190,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 358,
                size_id: 16,
            },
            {
                id: 'black-xl',
                id_printify: {
                    29: 38206,
                    87: 38206,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 418,
                size_id: 17,
            },
            {
                id: 'military-green-xl',
                id_printify: {
                    29: 38208,
                    87: 38208,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 364,
                size_id: 17,
            },
            {
                id: 'charcoal-xl',
                id_printify: {
                    29: 38195,
                    87: 38195,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 424,
                size_id: 17,
            },
            {
                id: 'dark-chocolate-xl',
                id_printify: {
                    29: 38197,
                    87: 38197,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 362,
                size_id: 17,
            },
            {
                id: 'irish-green-xl',
                id_printify: {
                    29: 38198,
                    87: 38198,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 369,
                size_id: 17,
            },
            {
                id: 'light-blue-xl',
                id_printify: {
                    29: 38199,
                    87: 38199,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 392,
                size_id: 17,
            },
            {
                id: 'navy-xl',
                id_printify: {
                    29: 38200,
                    87: 38200,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 511,
                size_id: 17,
            },
            {
                id: 'red-xl',
                id_printify: {
                    29: 38202,
                    87: 38202,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 423,
                size_id: 17,
            },
            {
                id: 'royal-xl',
                id_printify: {
                    29: 38203,
                    87: 38203,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 425,
                size_id: 17,
            },
            {
                id: 'white-xl',
                id_printify: {
                    29: 38205,
                    87: 38205,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 521,
                size_id: 17,
            },
            {
                id: 'sport-grey-xl',
                id_printify: {
                    29: 38204,
                    87: 38204,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1598,
                color_id: 358,
                size_id: 17,
            },
            {
                id: 'black-2xl',
                id_printify: {
                    29: 38220,
                    87: 38220,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 418,
                size_id: 18,
            },
            {
                id: 'military-green-2xl',
                id_printify: {
                    29: 38222,
                    87: 38222,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 364,
                size_id: 18,
            },
            {
                id: 'charcoal-2xl',
                id_printify: {
                    29: 38209,
                    87: 38209,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 424,
                size_id: 18,
            },
            {
                id: 'dark-chocolate-2xl',
                id_printify: {
                    29: 38211,
                    87: 38211,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 362,
                size_id: 18,
            },
            {
                id: 'irish-green-2xl',
                id_printify: {
                    29: 38212,
                    87: 38212,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 369,
                size_id: 18,
            },
            {
                id: 'light-blue-2xl',
                id_printify: {
                    29: 38213,
                    87: 38213,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 392,
                size_id: 18,
            },
            {
                id: 'navy-2xl',
                id_printify: {
                    29: 38214,
                    87: 38214,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 511,
                size_id: 18,
            },
            {
                id: 'red-2xl',
                id_printify: {
                    29: 38216,
                    87: 38216,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 423,
                size_id: 18,
            },
            {
                id: 'royal-2xl',
                id_printify: {
                    29: 38217,
                    87: 38217,
                },
                cost: {
                    29: 1096,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 425,
                size_id: 18,
            },
            {
                id: 'white-2xl',
                id_printify: {
                    29: 38219,
                    87: 38219,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 521,
                size_id: 18,
            },
            {
                id: 'sport-grey-2xl',
                id_printify: {
                    29: 38218,
                    87: 38218,
                },
                cost: {
                    29: 959,
                    87: 796,
                },
                inicial_price: 1827,
                color_id: 358,
                size_id: 18,
            },
        ],
    },
    {
        id: 't-shirt-long-sleeve',
        family_id: 't-shirts',
        color: '#365486',
        allow_back_variant: true,
        providers: [39, 87],
        blueprint_ids: {
            39: 80,
            87: 80,
        },
        icon: '/svgs/products-types/t-shirt-long-sleeve_icon.svg',
        inicial_tags: ['long-sleeve'],
        key_features: ['without-side', 'ribbed-knit', 'shoulder-tape', 'fiber-composition', 'fabric'],
        care_instructions: ['machine-wash-cold', 'not-dryclean', 'bleach', 'tumble-dry-medium', 'not-iron'],
        metrics: { width: [45.70, 50.80, 55.90, 60.90, 66.00], length: [71.10, 73.60, 76.20, 78.70, 81.30], sleeve: [63.50, 64.80, 66.00, 67.30, 68.60] },
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 418, 358, 392, 511, 433],
        variants: [
            {
                id: 'white-s',
                id_printify: {
                    39: 33791,
                    87: 33791,
                },
                cost: {
                    39: 1225,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 521,
                size_id: 14,
            },
            {
                id: 'white-m',
                id_printify: {
                    39: 33792,
                    87: 33792,
                },
                cost: {
                    39: 1333,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 521,
                size_id: 15,
            },
            {
                id: 'white-l',
                id_printify: {
                    39: 33793,
                    87: 33793,
                },
                cost: {
                    39: 1422,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 521,
                size_id: 16,
            },
            {
                id: 'white-xl',
                id_printify: {
                    39: 33794,
                    87: 33794,
                },
                cost: {
                    39: 1443,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 521,
                size_id: 17,
            },
            {
                id: 'white-2xl',
                id_printify: {
                    39: 33795,
                    87: 33795,
                },
                cost: {
                    39: 1663,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 521,
                size_id: 18,
            },
            {
                id: 'black-s',
                id_printify: {
                    39: 33796,
                    87: 33796,
                },
                cost: {
                    39: 1515,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 418,
                size_id: 14,
            },
            {
                id: 'black-m',
                id_printify: {
                    39: 33797,
                    87: 33797,
                },
                cost: {
                    39: 1624,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 418,
                size_id: 15,
            },
            {
                id: 'black-l',
                id_printify: {
                    39: 33798,
                    87: 33798,
                },
                cost: {
                    39: 1713,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 418,
                size_id: 16,
            },
            {
                id: 'black-xl',
                id_printify: {
                    39: 33799,
                    87: 33799,
                },
                cost: {
                    39: 1734,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 418,
                size_id: 17,
            },
            {
                id: 'black-2xl',
                id_printify: {
                    39: 33800,
                    87: 33800,
                },
                cost: {
                    39: 2003,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 418,
                size_id: 18,
            },
            {
                id: 'sport-grey-s',
                id_printify: {
                    39: 33987,
                    87: 33987,
                },
                cost: {
                    39: 1470,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 358,
                size_id: 14,
            },
            {
                id: 'sport-grey-m',
                id_printify: {
                    39: 33988,
                    87: 33988,
                },
                cost: {
                    39: 1579,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 358,
                size_id: 15,
            },
            {
                id: 'sport-grey-l',
                id_printify: {
                    39: 33989,
                    87: 33989,
                },
                cost: {
                    39: 1670,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 358,
                size_id: 16,
            },
            {
                id: 'sport-grey-xl',
                id_printify: {
                    39: 33990,
                    87: 33990,
                },
                cost: {
                    39: 1691,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 358,
                size_id: 17,
            },
            {
                id: 'sport-grey-2xl',
                id_printify: {
                    39: 33991,
                    87: 33991,
                },
                cost: {
                    39: 1919,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 358,
                size_id: 18,
            },
            {
                id: 'light-blue-s',
                id_printify: {
                    39: 42661,
                    87: 42661,
                },
                cost: {
                    39: 1531,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 392,
                size_id: 14,
            },
            {
                id: 'light-blue-m',
                id_printify: {
                    39: 42662,
                    87: 42662,
                },
                cost: {
                    39: 1640,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 392,
                size_id: 15,
            },
            {
                id: 'light-blue-l',
                id_printify: {
                    39: 42663,
                    87: 42663,
                },
                cost: {
                    39: 1731,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 392,
                size_id: 16,
            },
            {
                id: 'light-blue-xl',
                id_printify: {
                    39: 42664,
                    87: 42664,
                },
                cost: {
                    39: 1752,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 392,
                size_id: 17,
            },
            {
                id: 'light-blue-2xl',
                id_printify: {
                    39: 42665,
                    87: 42665,
                },
                cost: {
                    39: 2024,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 392,
                size_id: 18,
            },
            {
                id: 'light-pink-s',
                id_printify: {
                    39: 42666,
                    87: 42666,
                },
                cost: {
                    39: 1531,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 433,
                size_id: 14,
            },
            {
                id: 'light-pink-m',
                id_printify: {
                    39: 42667,
                    87: 42667,
                },
                cost: {
                    39: 1640,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 433,
                size_id: 15,
            },
            {
                id: 'light-pink-l',
                id_printify: {
                    39: 42668,
                    87: 42668,
                },
                cost: {
                    39: 1731,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 433,
                size_id: 16,
            },
            {
                id: 'light-pink-xl',
                id_printify: {
                    39: 42669,
                    87: 42669,
                },
                cost: {
                    39: 1752,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 433,
                size_id: 17,
            },
            {
                id: 'light-pink-2xl',
                id_printify: {
                    39: 42670,
                    87: 42670,
                },
                cost: {
                    39: 2024,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 433,
                size_id: 18,
            },
            {
                id: 'navy-s',
                id_printify: {
                    39: 42711,
                    87: 42711,
                },
                cost: {
                    39: 1531,
                    87: 1425,
                },
                inicial_price: 2552,
                color_id: 511,
                size_id: 14,
            },
            {
                id: 'navy-m',
                id_printify: {
                    39: 42712,
                    87: 42712,
                },
                cost: {
                    39: 1640,
                    87: 1425,
                },
                inicial_price: 2733,
                color_id: 511,
                size_id: 15,
            },
            {
                id: 'navy-l',
                id_printify: {
                    39: 42713,
                    87: 42713,
                },
                cost: {
                    39: 1731,
                    87: 1425,
                },
                inicial_price: 2885,
                color_id: 511,
                size_id: 16,
            },
            {
                id: 'navy-xl',
                id_printify: {
                    39: 42714,
                    87: 42714,
                },
                cost: {
                    39: 1752,
                    87: 1425,
                },
                inicial_price: 2920,
                color_id: 511,
                size_id: 17,
            },
            {
                id: 'navy-2xl',
                id_printify: {
                    39: 42715,
                    87: 42715,
                },
                cost: {
                    39: 2024,
                    87: 1425,
                },
                inicial_price: 3373,
                color_id: 511,
                size_id: 18,
            },
        ],
    },
    {
        id: 'raglan-tee-long-sleeve',
        family_id: 'raglan-tees',
        color: '#e0824b',
        allow_back_variant: false,
        providers: [27, 6],
        blueprint_ids: {
            27: 79,
            6: 79,
        },
        icon: '/svgs/products-types/raglan-tee-long-sleeve_icon.svg',
        inicial_tags: ['long-sleeve', 'raglan', 'tee', 'baseball'],
        key_features: ['with-side', 'polyester', 'ribbed-knit', 'fiber-composition'],
        care_instructions: ['machine-wash-warm', 'not-dryclean', 'not-bleach', 'tumble-dry-low', 'iron-low'],
        metrics: { width: [44.8, 49.8, 54.9, 60, 65.1], length: [68.9, 71.4, 74, 76.5, 79.1], sleeve: [60.2, 62.1, 64, 65.9, 67.8] },
        sizes: [14, 15, 16, 17, 18],
        colors: [1535, 1062, 1792, 1536, 1058, 1795, 1750],
        variants: [
            {
                id: 'royal-white-s',
                id_printify: {
                    27: 33522,
                    6: 33522,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1058,
                size_id: 14,
            },
            {
                id: 'asphalt-white-s',
                id_printify: {
                    27: 36255,
                    6: 39175,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1535,
                size_id: 14,
            },
            {
                id: 'red-white-s',
                id_printify: {
                    27: 36256,
                    6: 39211,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1536,
                size_id: 14,
            },
            {
                id: 'white-black-s',
                id_printify: {
                    27: 39151,
                    6: 39151,
                },
                cost: {
                    27: 1782,
                    6: 1742,
                },
                inicial_price: 2970,
                color_id: 1750,
                size_id: 14,
            },
            {
                id: 'green-white-s',
                id_printify: {
                    27: 39193,
                    6: 39193,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1792,
                size_id: 14,
            },
            {
                id: 'navy-white-s',
                id_printify: {
                    27: 39196,
                    6: 39196,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1795,
                size_id: 14,
            },
            {
                id: 'black-white-s',
                id_printify: {
                    27: 39217,
                    6: 39178,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1062,
                size_id: 14,
            },
            {
                id: 'royal-white-m',
                id_printify: {
                    27: 33523,
                    6: 33523,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1058,
                size_id: 15,
            },
            {
                id: 'asphalt-white-m',
                id_printify: {
                    27: 36257,
                    6: 39253,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1535,
                size_id: 15,
            },
            {
                id: 'red-white-m',
                id_printify: {
                    27: 36258,
                    6: 39289,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1536,
                size_id: 15,
            },
            {
                id: 'white-black-m',
                id_printify: {
                    27: 39229,
                    6: 39229,
                },
                cost: {
                    27: 1782,
                    6: 1742,
                },
                inicial_price: 2970,
                color_id: 1750,
                size_id: 15,
            },
            {
                id: 'green-white-m',
                id_printify: {
                    27: 39271,
                    6: 39271,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1792,
                size_id: 15,
            },
            {
                id: 'navy-white-m',
                id_printify: {
                    27: 39274,
                    6: 39274,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1795,
                size_id: 15,
            },
            {
                id: 'black-white-m',
                id_printify: {
                    27: 39295,
                    6: 39256,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1062,
                size_id: 15,
            },
            {
                id: 'royal-white-l',
                id_printify: {
                    27: 33524,
                    6: 33524,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1058,
                size_id: 16,
            },
            {
                id: 'asphalt-white-l',
                id_printify: {
                    27: 36259,
                    6: 39331,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1535,
                size_id: 16,
            },
            {
                id: 'red-white-l',
                id_printify: {
                    27: 36260,
                    6: 39367,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1536,
                size_id: 16,
            },
            {
                id: 'white-black-l',
                id_printify: {
                    27: 39307,
                    6: 39307,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1750,
                size_id: 16,
            },
            {
                id: 'green-white-l',
                id_printify: {
                    27: 39349,
                    6: 39349,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1792,
                size_id: 16,
            },
            {
                id: 'navy-white-l',
                id_printify: {
                    27: 39352,
                    6: 39352,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1795,
                size_id: 16,
            },
            {
                id: 'black-white-l',
                id_printify: {
                    27: 39373,
                    6: 39334,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1062,
                size_id: 16,
            },
            {
                id: 'royal-white-xl',
                id_printify: {
                    27: 33525,
                    6: 33525,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1058,
                size_id: 17,
            },
            {
                id: 'asphalt-white-xl',
                id_printify: {
                    27: 36261,
                    6: 39409,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1535,
                size_id: 17,
            },
            {
                id: 'red-white-xl',
                id_printify: {
                    27: 36262,
                    6: 39445,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1536,
                size_id: 17,
            },
            {
                id: 'white-black-xl',
                id_printify: {
                    27: 39385,
                    6: 39385,
                },
                cost: {
                    27: 1782,
                    6: 1742,
                },
                inicial_price: 2970,
                color_id: 1750,
                size_id: 17,
            },
            {
                id: 'green-white-xl',
                id_printify: {
                    27: 39427,
                    6: 39427,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1792,
                size_id: 17,
            },
            {
                id: 'navy-white-xl',
                id_printify: {
                    27: 39430,
                    6: 39430,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1795,
                size_id: 17,
            },
            {
                id: 'black-white-xl',
                id_printify: {
                    27: 39451,
                    6: 39412,
                },
                cost: {
                    27: 1782,
                    6: 1645,
                },
                inicial_price: 2970,
                color_id: 1062,
                size_id: 17,
            },
            {
                id: 'royal-white-2xl',
                id_printify: {
                    27: 33526,
                    6: 33526,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1058,
                size_id: 18,
            },
            {
                id: 'asphalt-white-2xl',
                id_printify: {
                    27: 36263,
                    6: 39487,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1535,
                size_id: 18,
            },
            {
                id: 'red-white-2xl',
                id_printify: {
                    27: 36264,
                    6: 39523,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1536,
                size_id: 18,
            },
            {
                id: 'white-black-2xl',
                id_printify: {
                    27: 39463,
                    6: 39463,
                },
                cost: {
                    27: 1993,
                    6: 1904,
                },
                inicial_price: 3322,
                color_id: 1750,
                size_id: 18,
            },
            {
                id: 'green-white-2xl',
                id_printify: {
                    27: 39505,
                    6: 39505,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1792,
                size_id: 18,
            },
            {
                id: 'navy-white-2xl',
                id_printify: {
                    27: 39508,
                    6: 39508,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1795,
                size_id: 18,
            },
            {
                id: 'black-white-2xl',
                id_printify: {
                    27: 39529,
                    6: 39490,
                },
                cost: {
                    27: 1993,
                    6: 1807,
                },
                inicial_price: 3322,
                color_id: 1062,
                size_id: 18,
            },
        ],
    },
    {
        id: 'sweatshirt',
        family_id: 'sweatshirts',
        color: '#009c75',
        allow_back_variant: true,
        providers: [39, 87],
        blueprint_ids: {
            39: 49,
            87: 49,
        },
        icon: '/svgs/products-types/sweatshirt_icon.svg',
        inicial_tags: ['long-sleeve'],
        metrics: { width: [50.8, 55.9, 60.96, 66.04, 71.12], length: [68.58, 71.12, 73.66, 76.2, 78.74], 'sleeve-from': [85.09, 87.63, 90.17, 92.71, 95.25] },
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 451, 418, 421, 358, 416, 369, 367, 392, 511, 433, 429, 423],
        key_features: ['without-side', 'ribbed-knit'],
        care_instructions: ['machine-wash-cold', 'not-dryclean', 'non-chlorine', 'tumble-dry-low', 'not-iron'],
        variants: [
            {
                id: 'ash-s',
                id_printify: {
                    39: 25377,
                    87: 25377,
                },
                cost: {
                    39: 1904,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 451,
                size_id: 14,
            },
            {
                id: 'dark-heather-s',
                id_printify: {
                    39: 25381,
                    87: 25381,
                },
                cost: {
                    39: 1912,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 367,
                size_id: 14,
            },
            {
                id: 'heliconia-s',
                id_printify: {
                    39: 25383,
                    87: 25383,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 429,
                size_id: 14,
            },
            {
                id: 'irish-green-s',
                id_printify: {
                    39: 25384,
                    87: 25384,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 369,
                size_id: 14,
            },
            {
                id: 'light-blue-s',
                id_printify: {
                    39: 25385,
                    87: 25385,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 392,
                size_id: 14,
            },
            {
                id: 'light-pink-s',
                id_printify: {
                    39: 25386,
                    87: 25386,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 433,
                size_id: 14,
            },
            {
                id: 'navy-s',
                id_printify: {
                    39: 25388,
                    87: 25388,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 511,
                size_id: 14,
            },
            {
                id: 'red-s',
                id_printify: {
                    39: 25391,
                    87: 25391,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 423,
                size_id: 14,
            },
            {
                id: 'sand-s',
                id_printify: {
                    39: 25394,
                    87: 25394,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 421,
                size_id: 14,
            },
            {
                id: 'sport-grey-s',
                id_printify: {
                    39: 25395,
                    87: 25395,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 358,
                size_id: 14,
            },
            {
                id: 'white-s',
                id_printify: {
                    39: 25396,
                    87: 25396,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 521,
                size_id: 14,
            },
            {
                id: 'black-s',
                id_printify: {
                    39: 25397,
                    87: 25397,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 418,
                size_id: 14,
            },
            {
                id: 'forest-green-s',
                id_printify: {
                    39: 25400,
                    87: 25400,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 416,
                size_id: 14,
            },
            {
                id: 'ash-m',
                id_printify: {
                    39: 25408,
                    87: 25408,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 451,
                size_id: 15,
            },
            {
                id: 'dark-heather-m',
                id_printify: {
                    39: 25412,
                    87: 25412,
                },
                cost: {
                    39: 1912,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 367,
                size_id: 15,
            },
            {
                id: 'heliconia-m',
                id_printify: {
                    39: 25414,
                    87: 25414,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 429,
                size_id: 15,
            },
            {
                id: 'irish-green-m',
                id_printify: {
                    39: 25415,
                    87: 25415,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 369,
                size_id: 15,
            },
            {
                id: 'light-blue-m',
                id_printify: {
                    39: 25416,
                    87: 25416,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 392,
                size_id: 15,
            },
            {
                id: 'light-pink-m',
                id_printify: {
                    39: 25417,
                    87: 25417,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 433,
                size_id: 15,
            },
            {
                id: 'navy-m',
                id_printify: {
                    39: 25419,
                    87: 25419,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 511,
                size_id: 15,
            },
            {
                id: 'red-m',
                id_printify: {
                    39: 25422,
                    87: 25422,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 423,
                size_id: 15,
            },
            {
                id: 'sand-m',
                id_printify: {
                    39: 25425,
                    87: 25425,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 421,
                size_id: 15,
            },
            {
                id: 'sport-grey-m',
                id_printify: {
                    39: 25426,
                    87: 25426,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 358,
                size_id: 15,
            },
            {
                id: 'white-m',
                id_printify: {
                    39: 25427,
                    87: 25427,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 521,
                size_id: 15,
            },
            {
                id: 'black-m',
                id_printify: {
                    39: 25428,
                    87: 25428,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 418,
                size_id: 15,
            },
            {
                id: 'forest-green-m',
                id_printify: {
                    39: 25431,
                    87: 25431,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 416,
                size_id: 15,
            },
            {
                id: 'ash-l',
                id_printify: {
                    39: 25439,
                    87: 25439,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 451,
                size_id: 16,
            },
            {
                id: 'dark-heather-l',
                id_printify: {
                    39: 25443,
                    87: 25443,
                },
                cost: {
                    39: 1912,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 367,
                size_id: 16,
            },
            {
                id: 'heliconia-l',
                id_printify: {
                    39: 25445,
                    87: 25445,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 429,
                size_id: 16,
            },
            {
                id: 'irish-green-l',
                id_printify: {
                    39: 25446,
                    87: 25446,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 369,
                size_id: 16,
            },
            {
                id: 'light-blue-l',
                id_printify: {
                    39: 25447,
                    87: 25447,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 392,
                size_id: 16,
            },
            {
                id: 'light-pink-l',
                id_printify: {
                    39: 25448,
                    87: 25448,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 433,
                size_id: 16,
            },
            {
                id: 'navy-l',
                id_printify: {
                    39: 25450,
                    87: 25450,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 511,
                size_id: 16,
            },
            {
                id: 'red-l',
                id_printify: {
                    39: 25453,
                    87: 25453,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 423,
                size_id: 16,
            },
            {
                id: 'sand-l',
                id_printify: {
                    39: 25456,
                    87: 25456,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 421,
                size_id: 16,
            },
            {
                id: 'sport-grey-l',
                id_printify: {
                    39: 25457,
                    87: 25457,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 358,
                size_id: 16,
            },
            {
                id: 'white-l',
                id_printify: {
                    39: 25458,
                    87: 25458,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 521,
                size_id: 16,
            },
            {
                id: 'black-l',
                id_printify: {
                    39: 25459,
                    87: 25459,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 418,
                size_id: 16,
            },
            {
                id: 'forest-green-l',
                id_printify: {
                    39: 25462,
                    87: 25462,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 416,
                size_id: 16,
            },
            {
                id: 'ash-xl',
                id_printify: {
                    39: 25470,
                    87: 25470,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 451,
                size_id: 17,
            },
            {
                id: 'dark-heather-xl',
                id_printify: {
                    39: 25474,
                    87: 25474,
                },
                cost: {
                    39: 1912,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 367,
                size_id: 17,
            },
            {
                id: 'heliconia-xl',
                id_printify: {
                    39: 25476,
                    87: 25476,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 429,
                size_id: 17,
            },
            {
                id: 'irish-green-xl',
                id_printify: {
                    39: 25477,
                    87: 25477,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 369,
                size_id: 17,
            },
            {
                id: 'light-blue-xl',
                id_printify: {
                    39: 25478,
                    87: 25478,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 392,
                size_id: 17,
            },
            {
                id: 'light-pink-xl',
                id_printify: {
                    39: 25479,
                    87: 25479,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 433,
                size_id: 17,
            },
            {
                id: 'navy-xl',
                id_printify: {
                    39: 25481,
                    87: 25481,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 511,
                size_id: 17,
            },
            {
                id: 'red-xl',
                id_printify: {
                    39: 25484,
                    87: 25484,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 423,
                size_id: 17,
            },
            {
                id: 'sand-xl',
                id_printify: {
                    39: 25487,
                    87: 25487,
                },
                cost: {
                    39: 1912,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 421,
                size_id: 17,
            },
            {
                id: 'sport-grey-xl',
                id_printify: {
                    39: 25488,
                    87: 25488,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 358,
                size_id: 17,
            },
            {
                id: 'white-xl',
                id_printify: {
                    39: 25489,
                    87: 25489,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 521,
                size_id: 17,
            },
            {
                id: 'black-xl',
                id_printify: {
                    39: 25490,
                    87: 25490,
                },
                cost: {
                    39: 1739,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 418,
                size_id: 17,
            },
            {
                id: 'forest-green-xl',
                id_printify: {
                    39: 25493,
                    87: 25493,
                },
                cost: {
                    39: 2118,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 416,
                size_id: 17,
            },
            {
                id: 'ash-2xl',
                id_printify: {
                    39: 25501,
                    87: 25501,
                },
                cost: {
                    39: 2455,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 451,
                size_id: 18,
            },
            {
                id: 'dark-heather-2xl',
                id_printify: {
                    39: 25505,
                    87: 25505,
                },
                cost: {
                    39: 2121,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 367,
                size_id: 18,
            },
            {
                id: 'heliconia-2xl',
                id_printify: {
                    39: 25507,
                    87: 25507,
                },
                cost: {
                    39: 2455,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 429,
                size_id: 18,
            },
            {
                id: 'irish-green-2xl',
                id_printify: {
                    39: 25508,
                    87: 25508,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 369,
                size_id: 18,
            },
            {
                id: 'light-blue-2xl',
                id_printify: {
                    39: 25509,
                    87: 25509,
                },
                cost: {
                    39: 2121,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 392,
                size_id: 18,
            },
            {
                id: 'light-pink-2xl',
                id_printify: {
                    39: 25510,
                    87: 25510,
                },
                cost: {
                    39: 2121,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 433,
                size_id: 18,
            },
            {
                id: 'navy-2xl',
                id_printify: {
                    39: 25512,
                    87: 25512,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 511,
                size_id: 18,
            },
            {
                id: 'red-2xl',
                id_printify: {
                    39: 25515,
                    87: 25515,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 423,
                size_id: 18,
            },
            {
                id: 'sand-2xl',
                id_printify: {
                    39: 25518,
                    87: 25518,
                },
                cost: {
                    39: 2121,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 421,
                size_id: 18,
            },
            {
                id: 'sport-grey-2xl',
                id_printify: {
                    39: 25519,
                    87: 25519,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 358,
                size_id: 18,
            },
            {
                id: 'white-2xl',
                id_printify: {
                    39: 25520,
                    87: 25520,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 521,
                size_id: 18,
            },
            {
                id: 'black-2xl',
                id_printify: {
                    39: 25521,
                    87: 25521,
                },
                cost: {
                    39: 1997,
                    87: 1681,
                },
                inicial_price: 2802,
                color_id: 418,
                size_id: 18,
            },
            {
                id: 'forest-green-2xl',
                id_printify: {
                    39: 25524,
                    87: 25524,
                },
                cost: {
                    39: 2455,
                    87: 1573,
                },
                inicial_price: 2802,
                color_id: 416,
                size_id: 18,
            },
        ],
    },
    {
        id: 'hoodie',
        family_id: 'hoodies',
        color: '#026539',
        allow_back_variant: true,
        providers: [50, 26],
        blueprint_ids: {
            50: 77,
            26: 77,
        },
        icon: '/svgs/products-types/hoodie_icon.svg',
        inicial_tags: ['long-sleeve', 'hood'],
        key_features: ['without-side', 'spacious-pockets', 'drawstring-hood', 'cotton-polyester'],
        care_instructions: ['machine-wash-warm', 'not-dryclean', 'bleach', 'tumble-dry-medium', 'iron-low'],
        metrics: { width: [51, 56, 61, 66, 71.1], length: [69, 71, 74, 76, 79], 'sleeve-from': [85.09, 87.63, 90.17, 92.71, 95.25] },
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 418, 358, 367, 425, 511, 423],
        variants: [
            {
                id: 'black-s',
                id_printify: {
                    50: 32918,
                    26: 32918,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 418,
                size_id: 14,
            },
            {
                id: 'dark-heather-s',
                id_printify: {
                    50: 32878,
                    26: 32878,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 367,
                size_id: 14,
            },
            {
                id: 'navy-s',
                id_printify: {
                    50: 32894,
                    26: 32894,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 511,
                size_id: 14,
            },
            {
                id: 'red-s',
                id_printify: {
                    50: 33385,
                    26: 33385,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 423,
                size_id: 14,
            },
            {
                id: 'royal-s',
                id_printify: {
                    50: 33393,
                    26: 33393,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 425,
                size_id: 14,
            },
            {
                id: 'white-s',
                id_printify: {
                    50: 32910,
                    26: 32910,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 521,
                size_id: 14,
            },
            {
                id: 'sport-grey-s',
                id_printify: {
                    50: 32902,
                    26: 32902,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 358,
                size_id: 14,
            },
            {
                id: 'black-m',
                id_printify: {
                    50: 32919,
                    26: 32919,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 418,
                size_id: 15,
            },
            {
                id: 'dark-heather-m',
                id_printify: {
                    50: 32879,
                    26: 32879,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 367,
                size_id: 15,
            },
            {
                id: 'navy-m',
                id_printify: {
                    50: 32895,
                    26: 32895,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 511,
                size_id: 15,
            },
            {
                id: 'red-m',
                id_printify: {
                    50: 33386,
                    26: 33386,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 423,
                size_id: 15,
            },
            {
                id: 'royal-m',
                id_printify: {
                    50: 33394,
                    26: 33394,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 425,
                size_id: 15,
            },
            {
                id: 'white-m',
                id_printify: {
                    50: 32911,
                    26: 32911,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 521,
                size_id: 15,
            },
            {
                id: 'sport-grey-m',
                id_printify: {
                    50: 32903,
                    26: 32903,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 358,
                size_id: 15,
            },
            {
                id: 'black-l',
                id_printify: {
                    50: 32920,
                    26: 32920,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 418,
                size_id: 16,
            },
            {
                id: 'dark-heather-l',
                id_printify: {
                    50: 32880,
                    26: 32880,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 367,
                size_id: 16,
            },
            {
                id: 'navy-l',
                id_printify: {
                    50: 32896,
                    26: 32896,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 511,
                size_id: 16,
            },
            {
                id: 'red-l',
                id_printify: {
                    50: 33387,
                    26: 33387,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 423,
                size_id: 16,
            },
            {
                id: 'royal-l',
                id_printify: {
                    50: 33395,
                    26: 33395,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 425,
                size_id: 16,
            },
            {
                id: 'white-l',
                id_printify: {
                    50: 32912,
                    26: 32912,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 521,
                size_id: 16,
            },
            {
                id: 'sport-grey-l',
                id_printify: {
                    50: 32904,
                    26: 32904,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 358,
                size_id: 16,
            },
            {
                id: 'black-xl',
                id_printify: {
                    50: 32921,
                    26: 32921,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 418,
                size_id: 17,
            },
            {
                id: 'dark-heather-xl',
                id_printify: {
                    50: 32881,
                    26: 32881,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 367,
                size_id: 17,
            },
            {
                id: 'navy-xl',
                id_printify: {
                    50: 32897,
                    26: 32897,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 511,
                size_id: 17,
            },
            {
                id: 'red-xl',
                id_printify: {
                    50: 33388,
                    26: 33388,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 423,
                size_id: 17,
            },
            {
                id: 'royal-xl',
                id_printify: {
                    50: 33396,
                    26: 33396,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 425,
                size_id: 17,
            },
            {
                id: 'white-xl',
                id_printify: {
                    50: 32913,
                    26: 32913,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 521,
                size_id: 17,
            },
            {
                id: 'sport-grey-xl',
                id_printify: {
                    50: 32905,
                    26: 32905,
                },
                cost: 2360,
                inicial_price: 3645,
                color_id: 358,
                size_id: 17,
            },
            {
                id: 'black-2xl',
                id_printify: {
                    50: 32922,
                    26: 32922,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 418,
                size_id: 18,
            },
            {
                id: 'dark-heather-2xl',
                id_printify: {
                    50: 32882,
                    26: 32882,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 367,
                size_id: 18,
            },
            {
                id: 'navy-2xl',
                id_printify: {
                    50: 32898,
                    26: 32898,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 511,
                size_id: 18,
            },
            {
                id: 'red-2xl',
                id_printify: {
                    50: 33389,
                    26: 33389,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 423,
                size_id: 18,
            },
            {
                id: 'royal-2xl',
                id_printify: {
                    50: 33397,
                    26: 33397,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 425,
                size_id: 18,
            },
            {
                id: 'white-2xl',
                id_printify: {
                    50: 32914,
                    26: 32914,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 521,
                size_id: 18,
            },
            {
                id: 'sport-grey-2xl',
                id_printify: {
                    50: 32906,
                    26: 32906,
                },
                cost: 2782,
                inicial_price: 3993,
                color_id: 358,
                size_id: 18,
            },
        ],
    },
    {
        id: 'socks',
        family_id: 'socks',
        color: '#96305a',
        allow_back_variant: false,
        providers: [1],
        blueprint_ids: {
            1: 376,
        },
        icon: '/svgs/products-types/socks_icon.svg',
        inicial_tags: [],
        key_features: ['fleece-lining', 'crew-length'],
        care_instructions: ['machine-wash-cold', 'not-dryclean', 'not-bleach', 'dry-flat', 'not-iron'],
        metrics: { total_length: [33, 39, 41], width: [10, 10, 10] },
        sizes: [14, 15, 16],
        colors: [521],
        variants: [
            {
                id: 's',
                id_printify: {
                    1: 45134,
                },
                cost: 769,
                inicial_price: 1300,
                title: 'S',
                color_id: 521,
                size_id: 14,
            },
            {
                id: 'm',
                id_printify: {
                    1: 45133,
                },
                cost: 769,
                inicial_price: 1300,
                title: 'M',
                color_id: 521,
                size_id: 15,
            },
            {
                id: 'l',
                id_printify: {
                    1: 45132,
                },
                cost: 769,
                inicial_price: 1300,
                title: 'L',
                color_id: 521,
                size_id: 16,
            },
        ]
    },
    {
        id: 'mug',
        family_id: 'mugs',
        color: '#bA2326',
        allow_back_variant: false,
        providers: [1, 87],
        blueprint_ids: {
            1: 68,
            87: 1020,
        },
        icon: '/svgs/products-types/mug_icon.svg',
        inicial_tags: [],
        key_features: ['microwave-safe', 'dishwasher-safe'],
        care_instructions: ['clean'],
        metrics: { height: [9.7], diameter: [8.1] },
        sizes: [1189],
        colors: [2620],
        variants: [
            {
                id: 'white-11oz',
                id_printify: {
                    1: 33719,
                    87: 79661,
                },
                cost: 639,
                inicial_price: 1057,
                title: 'White / 11oz',
                color_id: 2620,
                size_id: 1189,
            }
        ]
    },
    {
        id: 'mug-c',
        family_id: 'mugs',
        color: '#bA2326',
        allow_back_variant: false,
        providers: [28, 87],
        blueprint_ids: {
            28: 635,
            87: 1019,
        },
        icon: '/svgs/products-types/mug-c_icon.svg',
        inicial_tags: [],
        key_features: ['microwave-safe', 'dishwasher-safe'],
        care_instructions: ['clean'],
        metrics: { height: [9.7], diameter: [8.5] },
        sizes: [1189],
        colors: [2621, 2662, 2663, 2665],
        variants: [
            {
                id: 'black-11oz',
                id_printify: {
                    28: 72180,
                    87: 79654,
                },
                cost: 607,
                inicial_price: 1012,
                title: 'Black / 11oz',
                color_id: 2621,
                size_id: 1189,
            },
            {
                id: 'blue-11oz',
                id_printify: {
                    28: 72181,
                    87: 79655,
                },
                cost: 607,
                inicial_price: 1012,
                title: 'Blue / 11oz',
                color_id: 2662,
                size_id: 1189,
            },
            {
                id: 'pink-11oz',
                id_printify: {
                    28: 72183,
                    87: 79657,
                },
                cost: 607,
                inicial_price: 1012,
                title: 'Pink / 11oz',
                color_id: 2665,
                size_id: 1189,
            },
            {
                id: 'red-11oz',
                id_printify: {
                    28: 72184,
                    87: 79658,
                },
                cost: 607,
                inicial_price: 1012,
                title: 'Red / 11oz',
                color_id: 2663,
                size_id: 1189,
            }
        ]
    },
]

export const COUNTRIES = {
    AL: {
        continent: 'EU',
        tax: 0.2,
    },
    AD: {
        continent: 'EU',
        tax: 0.045,
    },
    AO: {
        continent: 'AF',
        tax: 0.14,
    },
    AR: {
        continent: 'AMS',
        tax: 0.21,
    },
    AU: {
        continent: 'OC',
        tax: 0.1,
    },
    AT: {
        continent: 'EU',
        tax: 0.2,
    },
    BE: {
        continent: 'EU',
        tax: 0.21,
    },
    BO: {
        continent: 'AMS',
        tax: 0.13,
    },
    BR: {
        continent: 'AMS',
        tax: 0.17,
    },
    BG: {
        continent: 'EU',
        tax: 0.2,
    },
    CM: {
        continent: 'AF',
        tax: 0.195,
    },
    CA: {
        continent: 'AMN',
        tax: 0.05,
    },
    CV: {
        continent: 'AF',
        tax: 0.15,
    },
    CL: {
        continent: 'AMS',
        tax: 0.19,
    },
    CO: {
        continent: 'AMS',
        tax: 0.19,
    },
    CR: {
        continent: 'AMN',
        tax: 0.13,
    },
    HR: {
        continent: 'EU',
        tax: 0.25,
    },
    DK: {
        continent: 'EUN',
        tax: 0.25,
    },
    EC: {
        continent: 'AMS',
        tax: 0.12,
    },
    FI: {
        continent: 'EUN',
        tax: 0.24,
    },
    FR: {
        continent: 'EU',
        tax: 0.2,
    },
    GE: {
        continent: 'EU',
        tax: 0.18,
    },
    DE: {
        continent: 'EU',
        tax: 0.19,
    },
    GB: {
        continent: 'EU',
        tax: 0.2,
    },
    GI: {
        continent: 'EU',
        tax: 0,
    },
    GR: {
        continent: 'EU',
        tax: 0.24,
    },
    GL: {
        continent: 'EU', // Printify interpreta como se fosse da Europa em vez da América do Norte
        tax: 0,
    },
    GT: {
        continent: 'AMN',
        tax: 0.12,
    },
    HN: {
        continent: 'AMN',
        tax: 0.15,
    },
    HU: {
        continent: 'EU',
        tax: 0.27,
    },
    IS: {
        continent: 'EUN',
        tax: 0.24,
    },
    ID: {
        continent: 'AS',
        tax: 0.11,
    },
    IE: {
        continent: 'EU',
        tax: 0.23,
    },
    IT: {
        continent: 'EU',
        tax: 0.22,
    },
    JM: {
        continent: 'AMN',
        tax: 0.15,
    },
    LR: {
        continent: 'AF',
        tax: 0.1,
    },
    LI: {
        continent: 'EUN',
        tax: 0.081,
    },
    LU: {
        continent: 'EU',
        tax: 0.17,
    },
    MX: {
        continent: 'AMN',
        tax: 0.16,
    },
    MC: {
        continent: 'EU',
        tax: 0.2,
    },
    ME: {
        continent: 'EU',
        tax: 0.21,
    },
    MA: {
        continent: 'AF',
        tax: 0.2,
    },
    MZ: {
        continent: 'AF',
        tax: 0.16,
    },
    NL: {
        continent: 'EU',
        tax: 0.21,
    },
    NZ: {
        continent: 'OC',
        tax: 0.15,
    },
    NG: {
        continent: 'AF',
        tax: 0.075,
    },
    NO: {
        continent: 'EUN',
        tax: 0.25,
    },
    PA: {
        continent: 'AMN',
        tax: 0.07,
    },
    PY: {
        continent: 'AMS',
        tax: 0.1,
    },
    PE: {
        continent: 'AMS',
        tax: 0.18,
    },
    PH: {
        continent: 'AS',
        tax: 0.12,
    },
    PL: {
        continent: 'EU',
        tax: 0.23,
    },
    PT: {
        continent: 'EU',
        tax: 0.23,
    },
    RO: {
        continent: 'EU',
        tax: 0.19,
    },
    ZA: {
        continent: 'AF',
        tax: 0.15,
    },
    ES: {
        continent: 'EU',
        tax: 0.21,
    },
    SE: {
        continent: 'EUN',
        tax: 0.25,
    },
    CH: {
        continent: 'EUN',
        tax: 0.081,
    },
    TR: {
        continent: 'EU',
        tax: 0.2,
    },
    US: {
        continent: 'AMN',
        tax: 0.073,
    },
    UY: {
        continent: 'AMS',
        tax: 0.22,
    },
    VE: {
        continent: 'AMS',
        tax: 0.16,
    },
}

export function getCurrencyByLocation(country, zone) {
    if (zone === 'Europe')
        return 'eur'
    if (country === 'BR')
        return 'brl'
    return 'usd'
}

export const USER_CUSTOMIZE_HOME_PAGE = THEMES_POOL.map(theme => ({ id: theme, query: 'h' })).concat(Object.keys(PRODUCTS_FAMILY).map(id => ({ id: id, query: 'v' })))