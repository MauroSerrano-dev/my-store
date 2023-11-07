export const CART_COOKIE = 'CART'

export const STEPS = [
    { id: 'sending-to-production', title: 'Sending to Production' },
    { id: 'in-production', title: 'In Production' },
    { id: 'shipment-in-transit', title: 'Shipment in Transit' },
    { id: 'shipment-delivered', title: 'Delivered' },
]

export const STEPS_ATTEMPT = [
    { id: 'sending-to-production', title: 'Sending to Production' },
    { id: 'in-production', title: 'In Production' },
    { id: 'shipment-in-transit', title: 'Shipment in Transit' },
    { id: 'shipment-delivery-attempt', title: 'Shipment Delivery Attempt' },
    { id: 'shipment-delivered', title: 'Delivered' },
]

export const ALLOWED_WEBHOOK_STATUS = STEPS.concat(STEPS_ATTEMPT).concat({ id: 'canceled', title: 'Canceled' })

export const DEFAULT_PRODUCTS_TAGS = [
    'music',
    'raglan-tees',
    't-shirts',
    'hoodies',
]

export const SEARCH_FILTERS = {
    categories: {
        id: 'categories',
        title: 'Categories',
        options: [
            { id: 'computer', title: 'Computer' },
            { id: 'games', title: 'Games' },
            { id: 'music', title: 'Music' },
        ]
    },
    'most-searched': {
        id: 'most-searched',
        title: 'Most Searched',
        options: [
            { id: 'funny', title: 'Funny' },
            { id: 'birthday', title: 'Birthday' },
            { id: 'for-couples', title: 'For Couples' },
        ]
    }
}

export const COLORS_POOL = {
    358: { id: 358, id_string: 'sport-grey', colors: ['#cacaca'], title: 'Sport Grey' },
    362: { id: 362, id_string: 'dark-chocolate', colors: ['#31221d'], title: 'Dark Chocolate' },
    364: { id: 364, id_string: 'military-green', colors: ['#585c3b'], title: 'Military Green' },
    367: { id: 367, id_string: 'dark-heather', colors: ['#454545'], title: 'Dark Heather' },
    369: { id: 369, id_string: 'irish-green', colors: ['#129447'], title: 'Irish Green' },
    392: { id: 392, id_string: 'light-blue', colors: ['#d6e6f7'], title: 'Light Blue' },
    395: { id: 395, id_string: 'maroon', colors: ['#642838'], title: 'Maroon' },
    418: { id: 418, id_string: 'black', colors: ['#000000'], title: 'Black' },
    423: { id: 423, id_string: 'red', colors: ['#c62A32'], title: 'Red' },
    424: { id: 424, id_string: 'charcoal', colors: ['#585559'], title: 'Charcoal' },
    425: { id: 425, id_string: 'royal', colors: ['#084f97'], title: 'Royal' },
    511: { id: 511, id_string: 'navy', colors: ['#1a2237'], title: 'Navy' },
    521: { id: 521, id_string: 'white', colors: ['#ffffff'], title: 'White' },
    1058: { id: 1058, id_string: 'royal-white', colors: ['#2b4da4', '#ffffff'], title: 'Royal/White' },
    1062: { id: 1062, id_string: 'black-white', colors: ['#000000', '#ffffff'], title: 'Black/White' },
    1535: { id: 1535, id_string: 'asphalt-white', colors: ['#525455', '#ffffff'], title: 'Asphalt/White' },
    1536: { id: 1536, id_string: 'scarlet-white', colors: ['#bA2326', '#ffffff'], title: 'Scarlet/White' },
    1750: { id: 1750, id_string: 'white-black', colors: ['#ffffff', '#000000'], title: 'White/Black' },
    1792: { id: 1792, id_string: 'green-white', colors: ['#026539', '#ffffff'], title: 'Green/White' },
    1795: { id: 1795, id_string: 'navy-white', colors: ['#1a1f35', '#ffffff'], title: 'Navy/White' },
    2620: { id: 2620, id_string: 'white-m', colors: ['#ffffff'], title: 'White' },
    2621: { id: 2621, id_string: 'black-m', colors: ['#000000'], title: 'Black' },
    2662: { id: 2662, id_string: 'blue-m', colors: ['#313da6'], title: 'Blue' },
    2663: { id: 2663, id_string: 'red-m', colors: ['#cd3f3a'], title: 'Red' },
    2665: { id: 2665, id_string: 'pink-m', colors: ['#daa2a6'], title: 'Pink' },
}

export const SEARCH_PRODUCT_COLORS = [
    { id: 1, color_display: { color: '#000000', title: 'Black', id_string: 'black' }, colors: [COLORS_POOL[418], COLORS_POOL[1750]] },
    { id: 2, color_display: { color: '#ffffff', title: 'White', id_string: 'white' }, colors: [COLORS_POOL[521], COLORS_POOL[1062]] },
    { id: 3, color_display: { color: '#525455', title: 'Grey', id_string: 'grey' }, colors: [COLORS_POOL[367], COLORS_POOL[424], COLORS_POOL[1535]] },
    { id: 4, color_display: { color: '#cacaca', title: 'Light Grey', id_string: 'light-grey' }, colors: [COLORS_POOL[358]] },
    { id: 5, color_display: { color: '#2b4da4', title: 'Blue', id_string: 'blue' }, colors: [COLORS_POOL[425], COLORS_POOL[1058], COLORS_POOL[392]] },
    { id: 6, color_display: { color: '#1a1f35', title: 'Navy', id_string: 'navy' }, colors: [COLORS_POOL[511], COLORS_POOL[1795]] },
    { id: 7, color_display: { color: '#026539', title: 'Green', id_string: 'green' }, colors: [COLORS_POOL[364], COLORS_POOL[369], COLORS_POOL[1792]] },
    { id: 9, color_display: { color: '#c62A32', title: 'Red', id_string: 'red' }, colors: [COLORS_POOL[423], COLORS_POOL[1536], COLORS_POOL[395]] },
    { id: 10, color_display: { color: '#31221d', title: 'Brown', id_string: 'brown' }, colors: [COLORS_POOL[362]] },
]

export const SEARCH_ART_COLORS = [
    { id: 1, color_display: { color: '#000000', title: 'Black', id_string: 'black' }, colors: [COLORS_POOL[418], COLORS_POOL[1750]] },
    { id: 2, color_display: { color: '#ffffff', title: 'White', id_string: 'white' }, colors: [COLORS_POOL[521], COLORS_POOL[1062]] },
    { id: 3, color_display: { color: '#525455', title: 'Grey', id_string: 'grey' }, colors: [COLORS_POOL[367], COLORS_POOL[424], COLORS_POOL[1535]] },
    { id: 4, color_display: { color: '#cacaca', title: 'Light Grey', id_string: 'light-grey' }, colors: [COLORS_POOL[358]] },
    { id: 5, color_display: { color: '#2b4da4', title: 'Blue', id_string: 'blue' }, colors: [COLORS_POOL[425], COLORS_POOL[1058], COLORS_POOL[392]] },
    { id: 6, color_display: { color: '#1a1f35', title: 'Navy', id_string: 'navy' }, colors: [COLORS_POOL[511], COLORS_POOL[1795]] },
    { id: 7, color_display: { color: '#026539', title: 'Green', id_string: 'green' }, colors: [COLORS_POOL[364], COLORS_POOL[369], COLORS_POOL[1792]] },
    { id: 8, color_display: { color: '#e0824b', title: 'Orange', id_string: 'orange' }, colors: [] },
    { id: 9, color_display: { color: '#c62A32', title: 'Red', id_string: 'red' }, colors: [COLORS_POOL[423], COLORS_POOL[1536], COLORS_POOL[395]] },
    { id: 10, color_display: { color: '#31221d', title: 'Brown', id_string: 'brown' }, colors: [COLORS_POOL[362]] },
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
    72: { id: 72, title: 'Print Clever' },
    87: { id: 87, title: 'Print Logistic' },
}

export const COLLECTIONS = [
    { id: 'sound-vibes', title: 'Sound Vibes', color: '#252c5e' },
    { id: 'gamer-life', title: 'Gamer Life', color: null },
]

export const MENU_OPTIONS = [
    { title: 'Home', type: 'link', href: '/' },
    { title: 'Products', type: 'forward', value: 'products' },
    { title: 'Collections', type: 'forward', value: 'collections' },
    { title: 'Support', type: 'link', href: '/support' },
    { title: 'About us', type: 'link', href: '/about-us' },
]

export const MENU_FORWARD_OPTIONS = {
    products: [
        { title: 'T-Shirts', type: 'link', href: '/search?v=t-shirts' },
        { title: 'Hoodies', type: 'link', href: '/search?v=hoodies' },
    ],
    possibleProducts: [
        { title: 'T-Shirts', type: 'link', href: '/search?v=t-shirts' },
        { title: 'Hoodies', type: 'link', href: '/search?v=hoodies' },
        { title: 'Long Sleeves', type: 'link', href: '/search?v=long+sleeves' },
        { title: 'Socks', type: 'link', href: '/search?v=socks' },
        { title: 'Mugs', type: 'link', href: '/search?v=mugs' },
        { title: 'Phone Cases', type: 'link', href: '/search?v=phone+cases' },
        { title: 'Pillows', type: 'link', href: '/search?v=pillows' },
        { title: 'Bottles & Tumblers', type: 'link', href: '/search?v=bottles+tumblers' },
        { title: 'Hats', type: 'link', href: '/search?v=hats' },
        { title: 'Blankets', type: 'link', href: '/search?v=blankets' },
        { title: 'Poster', type: 'link', href: '/search?v=poster' },
        { title: 'Apron', type: 'link', href: '/search?v=apron' },
        { title: 'Towels', type: 'link', href: '/search?v=towels' },
        { title: 'Shoes', type: 'link', href: '/search?v=shoes' },
        { title: 'Tank Tops', type: 'link', href: '/search?v=tank+tops' },
        { title: 'Bottoms', type: 'link', href: '/search?v=bottoms' },
    ],
    collections: COLLECTIONS.map(coll => ({ ...coll, type: 'link', href: `/search?c=${coll.id}` }))
}

export const TAGS_POOL = [
    'bed',
    'couples',
    'funny',
    'glitch',
    'guitar',
    'hoodie',
    'pillow',
    'raglan-tee',
    'rock',
]

export const THEMES_POOL = [
    { id: 'computer', title: 'Computer' },
    { id: 'games', title: 'Games' },
    { id: 'halloween', title: 'Halloween' },
    { id: 'home', title: 'Home' },
    { id: 'music', title: 'Music' },
    { id: 'zombies', title: 'Zombies' },
]

export const itemsNavBar = [
    { value: 't-shirts', title: 'T-SHIRTS' },
    { value: 'hoodies', title: 'HOODIES' },
    { value: 'mugs', title: 'MUGS' },
    { value: 'bags', title: 'BAGS' },
    { value: 'accessories', title: 'ACCESSORIES' },
    { value: 'pillows', title: 'PILLOWS' },
    { value: 'socks', title: 'SOCKS' },
]

export const PRODUCTS_FAMILY = {
    't-shirts': { id: 't-shirts', title: 'T-Shirts', color: '#1189C4' },
    'hoodies': { id: 'hoodies', title: 'Hoodies', color: '#026539' },
    'raglan-tees': { id: 'raglan-tees', title: 'Raglan Tees', color: '#e0824b' },
    'mugs': { id: 'mugs', title: 'Mugs', color: '#bA2326' },
}

export const PRODUCT_TYPES = [
    {
        id: 't-shirt',
        family_id: 't-shirts',
        title: 'T-Shirt',
        color: '#1189C4',
        providers: [29, 87, 72],
        colors: [521, 418, 358, 362, 364, 369, 392, 424, 425, 511, 423],
        sizes: [14, 15, 16, 17, 18],
        variants: [
            {
                id: "black-s",
                id_printify: 38164,
                cost: 959,
                price: 1598,
                title: "Black / S",
                grams: 111,
                color_id: 418,
                size_id: 14,
            },
            {
                id: "military-green-s",
                id_printify: 38166,
                cost: 959,
                price: 1598,
                title: "Military Green / S",
                grams: 111,
                color_id: 364,
                size_id: 14,
            },
            {
                id: "charcoal-s",
                id_printify: 38153,
                cost: 959,
                price: 1598,
                title: "Charcoal / S",
                grams: 111,
                color_id: 424,
                size_id: 14,
            },
            {
                id: "dark-chocolate-s",
                id_printify: 38155,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / S",
                grams: 111,
                color_id: 362,
                size_id: 14,
            },
            {
                id: "irish-green-s",
                id_printify: 38156,
                cost: 959,
                price: 1598,
                title: "Irish Green / S",
                grams: 111,
                color_id: 369,
                size_id: 14,
            },
            {
                id: "light-blue-s",
                id_printify: 38157,
                cost: 959,
                price: 1598,
                title: "Light Blue / S",
                grams: 111,
                color_id: 392,
                size_id: 14,
            },
            {
                id: "navy-s",
                id_printify: 38158,
                cost: 959,
                price: 1598,
                title: "Navy / S",
                grams: 111,
                color_id: 511,
                size_id: 14,
            },
            {
                id: "red-s",
                id_printify: 38160,
                cost: 959,
                price: 1598,
                title: "Red / S",
                grams: 111,
                color_id: 423,
                size_id: 14,
            },
            {
                id: "royal-s",
                id_printify: 38161,
                cost: 959,
                price: 1598,
                title: "Royal / S",
                grams: 111,
                color_id: 425,
                size_id: 14,
            },
            {
                id: "white-s",
                id_printify: 38163,
                cost: 959,
                price: 1598,
                title: "White / S",
                grams: 111,
                color_id: 521,
                size_id: 14,
            },
            {
                id: "sport-grey-s",
                id_printify: 38162,
                cost: 959,
                price: 1598,
                title: "Sport Grey / S",
                grams: 111,
                color_id: 358,
                size_id: 14,
            },
            {
                id: "black-m",
                id_printify: 38178,
                cost: 959,
                price: 1598,
                title: "Black / M",
                grams: 120,
                color_id: 418,
                size_id: 15,
            },
            {
                id: "military-green-m",
                id_printify: 38180,
                cost: 959,
                price: 1598,
                title: "Military Green / M",
                grams: 120,
                color_id: 364,
                size_id: 15,
            },
            {
                id: "charcoal-m",
                id_printify: 38167,
                cost: 959,
                price: 1598,
                title: "Charcoal / M",
                grams: 120,
                color_id: 424,
                size_id: 15,
            },
            {
                id: "dark-chocolate-m",
                id_printify: 38169,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / M",
                grams: 120,
                color_id: 362,
                size_id: 15,
            },
            {
                id: "irish-green-m",
                id_printify: 38170,
                cost: 959,
                price: 1598,
                title: "Irish Green / M",
                grams: 120,
                color_id: 369,
                size_id: 15,
            },
            {
                id: "light-blue-m",
                id_printify: 38171,
                cost: 959,
                price: 1598,
                title: "Light Blue / M",
                grams: 120,
                color_id: 392,
                size_id: 15,
            },
            {
                id: "navy-m",
                id_printify: 38172,
                cost: 959,
                price: 1598,
                title: "Navy / M",
                grams: 120,
                color_id: 511,
                size_id: 15,
            },
            {
                id: "red-m",
                id_printify: 38174,
                cost: 959,
                price: 1598,
                title: "Red / M",
                grams: 120,
                color_id: 423,
                size_id: 15,
            },
            {
                id: "royal-m",
                id_printify: 38175,
                cost: 959,
                price: 1598,
                title: "Royal / M",
                grams: 120,
                color_id: 425,
                size_id: 15,
            },
            {
                id: "white-m",
                id_printify: 38177,
                cost: 959,
                price: 1598,
                title: "White / M",
                grams: 120,
                color_id: 521,
                size_id: 15,
            },
            {
                id: "sport-grey-m",
                id_printify: 38176,
                cost: 959,
                price: 1598,
                title: "Sport Grey / M",
                grams: 120,
                color_id: 358,
                size_id: 15,
            },
            {
                id: "black-l",
                id_printify: 38192,
                cost: 959,
                price: 1598,
                title: "Black / L",
                grams: 140,
                color_id: 418,
                size_id: 16,
            },
            {
                id: "military-green-l",
                id_printify: 38194,
                cost: 959,
                price: 1598,
                title: "Military Green / L",
                grams: 140,
                color_id: 364,
                size_id: 16,
            },
            {
                id: "charcoal-l",
                id_printify: 38181,
                cost: 959,
                price: 1598,
                title: "Charcoal / L",
                grams: 140,
                color_id: 424,
                size_id: 16,
            },
            {
                id: "dark-chocolate-l",
                id_printify: 38183,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / L",
                grams: 140,
                color_id: 362,
                size_id: 16,
            },
            {
                id: "irish-green-l",
                id_printify: 38184,
                cost: 959,
                price: 1598,
                title: "Irish Green / L",
                grams: 140,
                color_id: 369,
                size_id: 16,
            },
            {
                id: "light-blue-l",
                id_printify: 38185,
                cost: 959,
                price: 1598,
                title: "Light Blue / L",
                grams: 140,
                color_id: 392,
                size_id: 16,
            },
            {
                id: "navy-l",
                id_printify: 38186,
                cost: 959,
                price: 1598,
                title: "Navy / L",
                grams: 140,
                color_id: 511,
                size_id: 16,
            },
            {
                id: "red-l",
                id_printify: 38188,
                cost: 959,
                price: 1598,
                title: "Red / L",
                grams: 140,
                color_id: 423,
                size_id: 16,
            },
            {
                id: "royal-l",
                id_printify: 38189,
                cost: 959,
                price: 1598,
                title: "Royal / L",
                grams: 140,
                color_id: 425,
                size_id: 16,
            },
            {
                id: "white-l",
                id_printify: 38191,
                cost: 959,
                price: 1598,
                title: "White / L",
                grams: 140,
                color_id: 521,
                size_id: 16,
            },
            {
                id: "sport-grey-l",
                id_printify: 38190,
                cost: 959,
                price: 1598,
                title: "Sport Grey / L",
                grams: 140,
                color_id: 358,
                size_id: 16,
            },
            {
                id: "black-xl",
                id_printify: 38206,
                cost: 959,
                price: 1598,
                title: "Black / XL",
                grams: 160,
                color_id: 418,
                size_id: 17,
            },
            {
                id: "military-green-xl",
                id_printify: 38208,
                cost: 959,
                price: 1598,
                title: "Military Green / XL",
                grams: 160,
                color_id: 364,
                size_id: 17,
            },
            {
                id: "charcoal-xl",
                id_printify: 38195,
                cost: 959,
                price: 1598,
                title: "Charcoal / XL",
                grams: 160,
                color_id: 424,
                size_id: 17,
            },
            {
                id: "dark-chocolate-xl",
                id_printify: 38197,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / XL",
                grams: 160,
                color_id: 362,
                size_id: 17,
            },
            {
                id: "irish-green-xl",
                id_printify: 38198,
                cost: 959,
                price: 1598,
                title: "Irish Green / XL",
                grams: 160,
                color_id: 369,
                size_id: 17,
            },
            {
                id: "light-blue-xl",
                id_printify: 38199,
                cost: 959,
                price: 1598,
                title: "Light Blue / XL",
                grams: 160,
                color_id: 392,
                size_id: 17,
            },
            {
                id: "navy-xl",
                id_printify: 38200,
                cost: 959,
                price: 1598,
                title: "Navy / XL",
                grams: 160,
                color_id: 511,
                size_id: 17,
            },
            {
                id: "red-xl",
                id_printify: 38202,
                cost: 959,
                price: 1598,
                title: "Red / XL",
                grams: 160,
                color_id: 423,
                size_id: 17,
            },
            {
                id: "royal-xl",
                id_printify: 38203,
                cost: 959,
                price: 1598,
                title: "Royal / XL",
                grams: 160,
                color_id: 425,
                size_id: 17,
            },
            {
                id: "white-xl",
                id_printify: 38205,
                cost: 959,
                price: 1598,
                title: "White / XL",
                grams: 160,
                color_id: 521,
                size_id: 17,
            },
            {
                id: "sport-grey-xl",
                id_printify: 38204,
                cost: 959,
                price: 1598,
                title: "Sport Grey / XL",
                grams: 160,
                color_id: 358,
                size_id: 17,
            },
            {
                id: "black-2xl",
                id_printify: 38220,
                cost: 1096,
                price: 1827,
                title: "Black / 2XL",
                grams: 180,
                color_id: 418,
                size_id: 18,
            },
            {
                id: "military-green-2xl",
                id_printify: 38222,
                cost: 1096,
                price: 1827,
                title: "Military Green / 2XL",
                grams: 180,
                color_id: 364,
                size_id: 18,
            },
            {
                id: "charcoal-2xl",
                id_printify: 38209,
                cost: 1096,
                price: 1827,
                title: "Charcoal / 2XL",
                grams: 180,
                color_id: 424,
                size_id: 18,
            },
            {
                id: "dark-chocolate-2xl",
                id_printify: 38211,
                cost: 1096,
                price: 1827,
                title: "Dark Chocolate / 2XL",
                grams: 180,
                color_id: 362,
                size_id: 18,
            },
            {
                id: "irish-green-2xl",
                id_printify: 38212,
                cost: 1096,
                price: 1827,
                title: "Irish Green / 2XL",
                grams: 180,
                color_id: 369,
                size_id: 18,
            },
            {
                id: "light-blue-2xl",
                id_printify: 38213,
                cost: 1096,
                price: 1827,
                title: "Light Blue / 2XL",
                grams: 180,
                color_id: 392,
                size_id: 18,
            },
            {
                id: "navy-2xl",
                id_printify: 38214,
                cost: 1096,
                price: 1827,
                title: "Navy / 2XL",
                grams: 180,
                color_id: 511,
                size_id: 18,
            },
            {
                id: "red-2xl",
                id_printify: 38216,
                cost: 1096,
                price: 1827,
                title: "Red / 2XL",
                grams: 180,
                color_id: 423,
                size_id: 18,
            },
            {
                id: "royal-2xl",
                id_printify: 38217,
                cost: 1096,
                price: 1827,
                title: "Royal / 2XL",
                grams: 180,
                color_id: 425,
                size_id: 18,
            },
            {
                id: "white-2xl",
                id_printify: 38219,
                cost: 1096,
                price: 1827,
                title: "White / 2XL",
                grams: 180,
                color_id: 521,
                size_id: 18,
            },
            {
                id: "sport-grey-2xl",
                id_printify: 38218,
                cost: 1096,
                price: 1827,
                title: "Sport Grey / 2XL",
                grams: 180,
                color_id: 358,
                size_id: 18,
            },
        ],
    },
    {
        id: 'hoodie',
        family_id: 'hoodies',
        title: 'Hoodie',
        color: '#026539',
        providers: [29, 26, 72],
        colors: [521, 418, 358, 395, 364, 369, 367, 392, 425, 511, 423],
        sizes: [14, 15, 16, 17, 18],
        variants: [
            {
                id: "charcoal-s",
                id_printify: 42211,
                cost: 2187,
                price: 3645,
                title: "Charcoal / S",
                grams: 482,
                color_id: 424,
                size_id: 14,
            },
            {
                id: "charcoal-m",
                id_printify: 42212,
                cost: 2187,
                price: 3645,
                title: "Charcoal / M",
                grams: 485,
                color_id: 424,
                size_id: 15,
            },
            {
                id: "charcoal-l",
                id_printify: 42213,
                cost: 2187,
                price: 3645,
                title: "Charcoal / L",
                grams: 541,
                color_id: 424,
                size_id: 16,
            },
            {
                id: "charcoal-xl",
                id_printify: 42214,
                cost: 2187,
                price: 3645,
                title: "Charcoal / XL",
                grams: 587,
                color_id: 424,
                size_id: 17,
            },
            {
                id: "charcoal-2xl",
                id_printify: 42215,
                cost: 2396,
                price: 3993,
                title: "Charcoal / 2XL",
                grams: 644,
                color_id: 424,
                size_id: 18,
            },
            {
                id: "heather-navy-s",
                id_printify: 66363,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / S",
                grams: 482,
                color_id: 550,
                size_id: 14,
            },
            {
                id: "heather-navy-m",
                id_printify: 66364,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / M",
                grams: 485,
                color_id: 550,
                size_id: 15,
            },
            {
                id: "heather-navy-l",
                id_printify: 66365,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / L",
                grams: 541,
                color_id: 550,
                size_id: 16,
            },
            {
                id: "heather-navy-xl",
                id_printify: 66366,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / XL",
                grams: 587,
                color_id: 550,
                size_id: 17,
            },
            {
                id: "heather-navy-2xl",
                id_printify: 66367,
                cost: 2396,
                price: 3993,
                title: "Heather Navy / 2XL",
                grams: 644,
                color_id: 550,
                size_id: 18,
            },
            {
                id: "light-blue-s",
                id_printify: 42235,
                cost: 2187,
                price: 3645,
                title: "Light Blue / S",
                grams: 482,
                color_id: 392,
                size_id: 14,
            },
            {
                id: "light-blue-m",
                id_printify: 42236,
                cost: 2187,
                price: 3645,
                title: "Light Blue / M",
                grams: 485,
                color_id: 392,
                size_id: 15,
            },
            {
                id: "light-blue-l",
                id_printify: 42237,
                cost: 2187,
                price: 3645,
                title: "Light Blue / L",
                grams: 541,
                color_id: 392,
                size_id: 16,
            },
            {
                id: "light-blue-xl",
                id_printify: 42238,
                cost: 2187,
                price: 3645,
                title: "Light Blue / XL",
                grams: 587,
                color_id: 392,
                size_id: 17,
            },
            {
                id: "light-blue-2xl",
                id_printify: 42239,
                cost: 2396,
                price: 3993,
                title: "Light Blue / 2XL",
                grams: 644,
                color_id: 392,
                size_id: 18,
            },
            {
                id: "black-s",
                id_printify: 32918,
                cost: 2187,
                price: 3645,
                title: "Black / S",
                grams: 482,
                color_id: 418,
                size_id: 14,
            },
            {
                id: "military-green-s",
                id_printify: 33425,
                cost: 2187,
                price: 3645,
                title: "Military Green / S",
                grams: 482,
                color_id: 364,
                size_id: 14,
            },
            {
                id: "dark-heather-s",
                id_printify: 32878,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / S",
                grams: 482,
                color_id: 367,
                size_id: 14,
            },
            {
                id: "irish-green-s",
                id_printify: 33369,
                cost: 2187,
                price: 3645,
                title: "Irish Green / S",
                grams: 482,
                color_id: 369,
                size_id: 14,
            },
            {
                id: "maroon-s",
                id_printify: 32886,
                cost: 2187,
                price: 3645,
                title: "Maroon / S",
                grams: 482,
                color_id: 395,
                size_id: 14,
            },
            {
                id: "navy-s",
                id_printify: 32894,
                cost: 2187,
                price: 3645,
                title: "Navy / S",
                grams: 482,
                color_id: 511,
                size_id: 14,
            },
            {
                id: "red-s",
                id_printify: 33385,
                cost: 2187,
                price: 3645,
                title: "Red / S",
                grams: 482,
                color_id: 423,
                size_id: 14,
            },
            {
                id: "royal-s",
                id_printify: 33393,
                cost: 2187,
                price: 3645,
                title: "Royal / S",
                grams: 482,
                color_id: 425,
                size_id: 14,
            },
            {
                id: "white-s",
                id_printify: 32910,
                cost: 2187,
                price: 3645,
                title: "White / S",
                grams: 482,
                color_id: 521,
                size_id: 14,
            },
            {
                id: "sport-grey-s",
                id_printify: 32902,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / S",
                grams: 482,
                color_id: 358,
                size_id: 14,
            },
            {
                id: "black-m",
                id_printify: 32919,
                cost: 2187,
                price: 3645,
                title: "Black / M",
                grams: 485,
                color_id: 418,
                size_id: 15,
            },
            {
                id: "military-green-m",
                id_printify: 33426,
                cost: 2187,
                price: 3645,
                title: "Military Green / M",
                grams: 485,
                color_id: 364,
                size_id: 15,
            },
            {
                id: "dark-Heather-m",
                id_printify: 32879,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / M",
                grams: 485,
                color_id: 367,
                size_id: 15,
            },
            {
                id: "irish-green-m",
                id_printify: 33370,
                cost: 2187,
                price: 3645,
                title: "Irish Green / M",
                grams: 485,
                color_id: 369,
                size_id: 15,
            },
            {
                id: "maroon-m",
                id_printify: 32887,
                cost: 2187,
                price: 3645,
                title: "Maroon / M",
                grams: 485,
                color_id: 395,
                size_id: 15,
            },
            {
                id: "navy-m",
                id_printify: 32895,
                cost: 2187,
                price: 3645,
                title: "Navy / M",
                grams: 485,
                color_id: 511,
                size_id: 15,
            },
            {
                id: "red-m",
                id_printify: 33386,
                cost: 2187,
                price: 3645,
                title: "Red / M",
                grams: 485,
                color_id: 423,
                size_id: 15,
            },
            {
                id: "royal-m",
                id_printify: 33394,
                cost: 2187,
                price: 3645,
                title: "Royal / M",
                grams: 485,
                color_id: 425,
                size_id: 15,
            },
            {
                id: "white-m",
                id_printify: 32911,
                cost: 2187,
                price: 3645,
                title: "White / M",
                grams: 485,
                color_id: 521,
                size_id: 15,
            },
            {
                id: "sport-grey-m",
                id_printify: 32903,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / M",
                grams: 485,
                color_id: 358,
                size_id: 15,
            },
            {
                id: "black-l",
                id_printify: 32920,
                cost: 2187,
                price: 3645,
                title: "Black / L",
                grams: 541,
                color_id: 418,
                size_id: 16,
            },
            {
                id: "military-green-l",
                id_printify: 33427,
                cost: 2187,
                price: 3645,
                title: "Military Green / L",
                grams: 541,
                color_id: 364,
                size_id: 16,
            },
            {
                id: "dark-heather-l",
                id_printify: 32880,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / L",
                grams: 541,
                color_id: 367,
                size_id: 16,
            },
            {
                id: "irish-green-l",
                id_printify: 33371,
                cost: 2187,
                price: 3645,
                title: "Irish Green / L",
                grams: 541,
                color_id: 369,
                size_id: 16,
            },
            {
                id: "maroon-l",
                id_printify: 32888,
                cost: 2187,
                price: 3645,
                title: "Maroon / L",
                grams: 541,
                color_id: 395,
                size_id: 16,
            },
            {
                id: "navy-l",
                id_printify: 32896,
                cost: 2187,
                price: 3645,
                title: "Navy / L",
                grams: 541,
                color_id: 511,
                size_id: 16,
            },
            {
                id: "red-l",
                id_printify: 33387,
                cost: 2187,
                price: 3645,
                title: "Red / L",
                grams: 541,
                color_id: 423,
                size_id: 16,
            },
            {
                id: "royal-l",
                id_printify: 33395,
                cost: 2187,
                price: 3645,
                title: "Royal / L",
                grams: 541,
                color_id: 425,
                size_id: 16,
            },
            {
                id: "white-l",
                id_printify: 32912,
                cost: 2187,
                price: 3645,
                title: "White / L",
                grams: 541,
                color_id: 521,
                size_id: 16,
            },
            {
                id: "sport-grey-l",
                id_printify: 32904,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / L",
                grams: 541,
                color_id: 358,
                size_id: 16,
            },
            {
                id: "black-xl",
                id: "black-xl",
                id_printify: 32921,
                cost: 2187,
                price: 3645,
                title: "Black / XL",
                grams: 587,
                color_id: 418,
                size_id: 17,
            },
            {
                id: "military-green-xl",
                id_printify: 33428,
                cost: 2187,
                price: 3645,
                title: "Military Green / XL",
                grams: 587,
                color_id: 364,
                size_id: 17,
            },
            {
                id: "dark-heather-xl",
                id_printify: 32881,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / XL",
                grams: 587,
                color_id: 367,
                size_id: 17,
            },
            {
                id: "irish-green-xl",
                id_printify: 33372,
                cost: 2187,
                price: 3645,
                title: "Irish Green / XL",
                grams: 587,
                color_id: 369,
                size_id: 17,
            },
            {
                id: "maroon-xl",
                id_printify: 32889,
                cost: 2187,
                price: 3645,
                title: "Maroon / XL",
                grams: 587,
                color_id: 395,
                size_id: 17,
            },
            {
                id: "navy-xl",
                id_printify: 32897,
                cost: 2187,
                price: 3645,
                title: "Navy / XL",
                grams: 587,
                color_id: 511,
                size_id: 17,
            },
            {
                id: "red-xl",
                id_printify: 33388,
                cost: 2187,
                price: 3645,
                title: "Red / XL",
                grams: 587,
                color_id: 423,
                size_id: 17,
            },
            {
                id: "royal-xl",
                id_printify: 33396,
                cost: 2187,
                price: 3645,
                title: "Royal / XL",
                grams: 587,
                color_id: 425,
                size_id: 17,
            },
            {
                id: "white-xl",
                id_printify: 32913,
                cost: 2187,
                price: 3645,
                title: "White / XL",
                grams: 587,
                color_id: 521,
                size_id: 17,
            },
            {
                id: "sport-grey-xl",
                id_printify: 32905,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / XL",
                grams: 587,
                color_id: 358,
                size_id: 17,
            },
            {
                id: "black-2xl",
                id_printify: 32922,
                cost: 2396,
                price: 3993,
                title: "Black / 2XL",
                grams: 644,
                color_id: 418,
                size_id: 18,
            },
            {
                id: "military-green-2xl",
                id_printify: 33429,
                cost: 2396,
                price: 3993,
                title: "Military Green / 2XL",
                grams: 644,
                color_id: 364,
                size_id: 18,
            },
            {
                id: "dark-heather-2xl",
                id_printify: 32882,
                cost: 2396,
                price: 3993,
                title: "Dark Heather / 2XL",
                grams: 644,
                color_id: 367,
                size_id: 18,
            },
            {
                id: "irish-green-2xl",
                id_printify: 33373,
                cost: 2396,
                price: 3993,
                title: "Irish Green / 2XL",
                grams: 644,
                color_id: 369,
                size_id: 18,
            },
            {
                id: "maroon-2xl",
                id_printify: 32890,
                cost: 2396,
                price: 3993,
                title: "Maroon / 2XL",
                grams: 644,
                color_id: 395,
                size_id: 18,
            },
            {
                id: "navy-2xl",
                id_printify: 32898,
                cost: 2396,
                price: 3993,
                title: "Navy / 2XL",
                grams: 644,
                color_id: 511,
                size_id: 18,
            },
            {
                id: "red-2xl",
                id_printify: 33389,
                cost: 2396,
                price: 3993,
                title: "Red / 2XL",
                grams: 644,
                color_id: 423,
                size_id: 18,
            },
            {
                id: "royal-2xl",
                id_printify: 33397,
                cost: 2396,
                price: 3993,
                title: "Royal / 2XL",
                grams: 644,
                color_id: 425,
                size_id: 18,
            },
            {
                id: "white-2xl",
                id_printify: 32914,
                cost: 2396,
                price: 3993,
                title: "White / 2XL",
                grams: 644,
                color_id: 521,
                size_id: 18,
            },
            {
                id: "sport-grey-2xl",
                id_printify: 32906,
                cost: 2396,
                price: 3993,
                title: "Sport Grey / 2XL",
                grams: 644,
                color_id: 358,
                size_id: 18,
            },
        ],
    },
    {
        id: 'raglan-tee',
        family_id: 'raglan-tees',
        title: 'Raglan Tee',
        color: '#e0824b',
        providers: [27, 6],
        colors: [1535, 1062, 1792, 1536, 1058, 1795, 1750],
        sizes: [14, 15, 16, 17, 18],
        variants: [
            {
                id: "royal-white-s",
                id_printify: 33522,
                cost: 1782,
                price: 2970,
                title: "Royal/White / S",
                grams: 110,
                color_id: 1058,
                size_id: 14,
            },
            {
                id: "asphalt-white-s",
                id_printify: 36255,
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / S",
                grams: 110,
                color_id: 1535,
                size_id: 14,
            },
            {
                id: "red-white-s",
                id_printify: 36256,
                cost: 1782,
                price: 2970,
                title: "Red/White / S",
                grams: 110,
                color_id: 1536,
                size_id: 14,
            },
            {
                id: "royal-white-m",
                id_printify: 33523,
                cost: 1782,
                price: 2970,
                title: "Royal/White / M",
                grams: 131,
                color_id: 1058,
                size_id: 15,
            },
            {
                id: "asphalt-white-m",
                id_printify: 36257,
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / M",
                grams: 131,
                color_id: 1535,
                size_id: 15,
            },
            {
                id: "red-white-m",
                id_printify: 36258,
                cost: 1782,
                price: 2970,
                title: "Red/White / M",
                grams: 131,
                color_id: 1536,
                size_id: 15,
            },
            {
                id: "royal-white-l",
                id_printify: 33524,
                cost: 1782,
                price: 2970,
                title: "Royal/White / L",
                grams: 158,
                color_id: 1058,
                size_id: 16,
            },
            {
                id: "asphalt-white-l",
                id_printify: 36259,
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / L",
                grams: 158,
                color_id: 1535,
                size_id: 16,
            },
            {
                id: "red-white-l",
                id_printify: 36260,
                cost: 1782,
                price: 2970,
                title: "Red/White / L",
                grams: 158,
                color_id: 1536,
                size_id: 16,
            },
            {
                id: "royal-white-xl",
                id_printify: 33525,
                cost: 1782,
                price: 2970,
                title: "Royal/White / XL",
                grams: 190,
                color_id: 1058,
                size_id: 17,
            },
            {
                id: "asphalt-white-xl",
                id_printify: 36261,
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / XL",
                grams: 190,
                color_id: 1535,
                size_id: 17,
            },
            {
                id: "red-white-xl",
                id_printify: 36262,
                cost: 1782,
                price: 2970,
                title: "Red/White / XL",
                grams: 190,
                color_id: 1536,
                size_id: 17,
            },
            {
                id: "royal-white-2xl",
                id_printify: 33526,
                cost: 1993,
                price: 3322,
                title: "Royal/White / 2XL",
                grams: 228,
                color_id: 1058,
                size_id: 18,
            },
            {
                id: "asphalt-white-2xl",
                id_printify: 36263,
                cost: 1993,
                price: 3322,
                title: "Asphalt/White / 2XL",
                grams: 228,
                color_id: 1535,
                size_id: 18,
            },
            {
                id: "red-white-2xl",
                id_printify: 36264,
                cost: 1993,
                price: 3322,
                title: "Red/White / 2XL",
                grams: 228,
                color_id: 1536,
                size_id: 18,
            },
            {
                id: "white-black-s",
                id_printify: 39151,
                cost: 1782,
                price: 2970,
                title: "White/Black / S",
                grams: 110,
                color_id: 1750,
                size_id: 14,
            },
            {
                id: "green-white-s",
                id_printify: 39193,
                cost: 1782,
                price: 2970,
                title: "Green/White / S",
                grams: 110,
                color_id: 1792,
                size_id: 14,
            },
            {
                id: "navy-white-s",
                id_printify: 39196,
                cost: 1782,
                price: 2970,
                title: "Navy/White / S",
                grams: 110,
                color_id: 1795,
                size_id: 14,
            },
            {
                id: "black-white-s",
                id_printify: 39217,
                cost: 1782,
                price: 2970,
                title: "Black/White / S",
                grams: 110,
                color_id: 1062,
                size_id: 14,
            },
            {
                id: "white-black-m",
                id_printify: 39229,
                cost: 1782,
                price: 2970,
                title: "White/Black / M",
                grams: 131,
                color_id: 1750,
                size_id: 15,
            },
            {
                id: "green-white-m",
                id_printify: 39271,
                cost: 1782,
                price: 2970,
                title: "Green/White / M",
                grams: 131,
                color_id: 1792,
                size_id: 15,
            },
            {
                id: "navy-white-m",
                id_printify: 39274,
                cost: 1782,
                price: 2970,
                title: "Navy/White / M",
                grams: 131,
                color_id: 1795,
                size_id: 15,
            },
            {
                id_printify: 39295,
                cost: 1782,
                price: 2970,
                title: "Black/White / M",
                grams: 131,
                color_id: 1062,
                size_id: 15,
            },
            {
                id: "white-black-l",
                id_printify: 39307,
                cost: 1782,
                price: 2970,
                title: "White/Black / L",
                grams: 158,
                color_id: 1750,
                size_id: 16,
            },
            {
                id: "green-white-l",
                id_printify: 39349,
                cost: 1782,
                price: 2970,
                title: "Green/White / L",
                grams: 158,
                color_id: 1792,
                size_id: 16,
            },
            {
                id: "navy-white-l",
                id_printify: 39352,
                cost: 1782,
                price: 2970,
                title: "Navy/White / L",
                grams: 158,
                color_id: 1795,
                size_id: 16,
            },
            {
                id: "black-white-l",
                id_printify: 39373,
                cost: 1782,
                price: 2970,
                title: "Black/White / L",
                grams: 158,
                color_id: 1062,
                size_id: 16,
            },
            {
                id: "white-black-xl",
                id_printify: 39385,
                cost: 1782,
                price: 2970,
                title: "White/Black / XL",
                grams: 190,
                color_id: 1750,
                size_id: 17,
            },
            {
                id: "green-white-xl",
                id_printify: 39427,
                cost: 1782,
                price: 2970,
                title: "Green/White / XL",
                grams: 190,
                color_id: 1792,
                size_id: 17,
            },
            {
                id: "navy-white-xl",
                id_printify: 39430,
                cost: 1782,
                price: 2970,
                title: "Navy/White / XL",
                grams: 190,
                color_id: 1795,
                size_id: 17,
            },
            {
                id: "black-white-xl",
                id_printify: 39451,
                cost: 1782,
                price: 2970,
                title: "Black/White / XL",
                grams: 190,
                color_id: 1062,
                size_id: 17,
            },
            {
                id: "white-black-2xl",
                id_printify: 39463,
                cost: 1993,
                price: 3322,
                title: "White/Black / 2XL",
                grams: 228,
                color_id: 1750,
                size_id: 18,
            },
            {
                id: "green-white-2xl",
                id_printify: 39505,
                cost: 1993,
                price: 3322,
                title: "Green/White / 2XL",
                grams: 228,
                color_id: 1792,
                size_id: 18,
            },
            {
                id: "navy-white-2xl",
                id_printify: 39508,
                cost: 1993,
                price: 3322,
                title: "Navy/White / 2XL",
                grams: 228,
                color_id: 1795,
                size_id: 18,
            },
            {
                id: "black-white-2xl",
                id_printify: 39529,
                cost: 1993,
                price: 3322,
                title: "Black/White / 2XL",
                grams: 228,
                color_id: 1062,
                size_id: 18,
            }
        ],
    },
    {
        id: 'mug',
        family_id: 'mugs',
        title: 'Mug',
        color: '#bA2326',
        providers: [1, 87],
        sizes: [1189],
        colors: [2620],
        variants: [
            {
                id: 'white-11oz',
                id_printify: {
                    1: 33719,
                    87: 79661,
                },
                cost: 634,
                price: 1057,
                title: 'White / 11oz',
                grams: 460,
                color_id: 2620,
                size_id: 1189,
            }
        ]
    },
    {
        id: 'mug-c',
        family_id: 'mugs',
        title: 'Mug',
        color: '#bA2326',
        providers: [28, 87],
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
                price: 1012,
                title: 'Black / 11oz',
                grams: 390,
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
                price: 1012,
                title: 'Blue / 11oz',
                grams: 390,
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
                price: 1012,
                title: 'Pink / 11oz',
                grams: 390,
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
                price: 1012,
                title: 'Red / 11oz',
                grams: 390,
                color_id: 2663,
                size_id: 1189,
            }
        ]
    },
]

export function getShippingOptions(product_type, country) {
    const EU_COUNTRIES = ['PL', 'DE', 'BV', 'GE', 'SM', 'GI', 'GG', 'AT', 'HU', 'MD', 'HR', 'BE', 'IM', 'GR', 'IT', 'BY', 'GL', 'GP', 'LU', 'VA', 'JE', 'SK', 'BG', 'MK', 'PT', 'RE', 'FR', 'RO', 'TR', 'SI', 'XK', 'CZ', 'RS', 'ES', 'MC', 'ME', 'UA', 'AL', 'AM', 'CY', 'AX', 'AD', 'FO', 'BA', 'NL', 'MT']

    const EU_NORTH_COUNTRIES = ['LV', 'LT', 'NO', 'FI', 'SE', 'EE', 'IS', 'DK', 'CH', 'LI']

    const countryCode = EU_COUNTRIES.includes(country)
        ? 'EU'
        : EU_NORTH_COUNTRIES.includes(country)
            ? 'EUN'
            : country

    if (product_type === 't-shirt') {
        if (countryCode === 'US') {
            return {
                provider_id: 29,
                first_item: 475,
                add_item: 240,
                currency: 'usd'
            }
        }
        if (countryCode === 'CA') {
            return {
                provider_id: 29,
                first_item: 939,
                add_item: 439,
                currency: 'usd'
            }
        }
        if (countryCode === 'PL') {
            return {
                provider_id: 87,
                first_item: 499,
                add_item: 119,
                currency: 'usd'
            }
        }
        if (countryCode === 'UK') {
            return {
                provider_id: 72,
                first_item: 429,
                add_item: 199,
                currency: 'usd'
            }
        }
        if (countryCode === 'AU') {
            return {
                provider_id: 29,
                first_item: 1249,
                add_item: 499,
                currency: 'usd'
            }
        }
        if (countryCode === 'EU') {
            return {
                provider_id: 87,
                first_item: 569,
                add_item: 199,
                currency: 'usd'
            }
        }
        return {
            provider_id: 29,
            first_item: 1000,
            add_item: 400,
            currency: 'usd'
        }
    }
    if (product_type === 'hoodie') {
        if (countryCode === 'US') {
            return {
                provider_id: 29,
                first_item: 849,
                add_item: 209,
                currency: 'usd'
            }
        }
        if (countryCode === 'CA') {
            return {
                provider_id: 29,
                first_item: 1269,
                add_item: 659,
                currency: 'usd'
            }
        }
        if (countryCode === 'PL') {
            return {
                provider_id: 26,
                first_item: 699,
                add_item: 239,
                currency: 'usd'
            }
        }
        if (countryCode === 'UK') {
            return {
                provider_id: 72,
                first_item: 759,
                add_item: 299,
                currency: 'usd'
            }
        }
        if (countryCode === 'AU') {
            return {
                provider_id: 29,
                first_item: 2199,
                add_item: 999,
                currency: 'usd'
            }
        }
        if (countryCode === 'EU') {
            return {
                provider_id: 26,
                first_item: 699,
                add_item: 239,
                currency: 'usd'
            }
        }
        return {
            provider_id: 29,
            first_item: 1500,
            add_item: 1000,
            currency: 'usd'
        }
    }
    if (product_type === 'raglan-tee') {
        if (countryCode === 'US') {
            return {
                provider_id: 27,
                first_item: 849,
                add_item: 330,
                currency: 'usd'
            }
        }
        if (countryCode === 'CA') {
            return {
                provider_id: 27,
                first_item: 679,
                add_item: 219,
                currency: 'usd'
            }
        }
        if (countryCode === 'PL') {
            return {
                provider_id: 6,
                first_item: 749,
                add_item: 129,
                currency: 'usd'
            }
        }
        if (countryCode === 'UK') {
            return {
                provider_id: 6,
                first_item: 398,
                add_item: 129,
                currency: 'usd'
            }
        }
        if (countryCode === 'EU') {
            return {
                provider_id: 6,
                first_item: 749,
                add_item: 129,
                currency: 'usd'
            }
        }
        return {
            provider_id: 27,
            first_item: 1099,
            add_item: 549,
            currency: 'usd'
        }
    }
    if (product_type === 'mug') {
        if (countryCode === 'US') {
            return {
                provider_id: 1,
                first_item: 639,
                add_item: 400,
                currency: 'usd'
            }
        }
        if (countryCode === 'CA') {
            return {
                provider_id: 1,
                first_item: 1489,
                add_item: 609,
                currency: 'usd'
            }
        }
        if (countryCode === 'PL') {
            return {
                provider_id: 87,
                first_item: 659,
                add_item: 199,
                currency: 'usd'
            }
        }
        if (countryCode === 'UK') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                currency: 'usd'
            }
        }
        if (countryCode === 'IE') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                currency: 'usd'
            }
        }
        if (countryCode === 'EU') {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 179,
                currency: 'usd'
            }
        }
        if (countryCode === 'EUN') {
            return {
                provider_id: 87,
                first_item: 1029,
                add_item: 199,
                currency: 'usd'
            }
        }
        return {
            provider_id: 87,
            first_item: 1359,
            add_item: 699,
            currency: 'usd'
        }
    }
    if (product_type === 'mug-c') {
        if (countryCode === 'US') {
            return {
                provider_id: 28,
                first_item: 639,
                add_item: 359,
                currency: 'usd'
            }
        }
        if (countryCode === 'CA') {
            return {
                provider_id: 28,
                first_item: 1149,
                add_item: 599,
                currency: 'usd'
            }
        }
        if (countryCode === 'PL') {
            return {
                provider_id: 87,
                first_item: 659,
                add_item: 199,
                currency: 'usd'
            }
        }
        if (countryCode === 'UK') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                currency: 'usd'
            }
        }
        if (countryCode === 'IE') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                currency: 'usd'
            }
        }
        if (countryCode === 'EU') {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 179,
                currency: 'usd'
            }
        }
        if (countryCode === 'EUN') {
            return {
                provider_id: 87,
                first_item: 1029,
                add_item: 199,
                currency: 'usd'
            }
        }
        return {
            provider_id: 87,
            first_item: 1359,
            add_item: 699,
            currency: 'usd'
        }
    }
}

export const USER_CUSTOMIZE_HOME_PAGE = THEMES_POOL.map(theme => ({ ...theme, query: 'h' })).concat(Object.keys(PRODUCTS_FAMILY).map(id => ({ id: id, title: PRODUCTS_FAMILY[id].title, query: 'v' }))).sort((a, b) => b.id < a.id ? 1 : -1)

export function convertDolarToCurrency(value, currency) {
    if (currency === 'usd')
        return value
    if (currency === 'gbp')
        return Math.round(value * 0.82)
    if (currency === 'eur')
        return Math.round(value * 0.94)
    if (currency === 'brl')
        return Math.round(value * 4.87)
    console.error('Currency not found')
    return null
}

export function getCurrencyByCode(code) {
    if (code === 'brl')
        return { code: 'brl', symbol: 'R$' }
    if (code === 'gbp')
        return { code: 'gbp', symbol: '£' }
    if (code === 'eur')
        return { code: 'eur', symbol: '€' }
    if (code === 'usd')
        return { code: 'usd', symbol: '$' }
    console.error('Currency not found')
    return null
}