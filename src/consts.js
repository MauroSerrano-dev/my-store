import { IoShirt } from "react-icons/io5"
import { GiHoodie } from "react-icons/gi"
import { PiTShirtFill } from "react-icons/pi"
import { ImMug } from "react-icons/im"

export const languageToCountry = {
    en: 'en',
    es: 'es',
    'pt-BR': 'br',
    'pt': 'pt'
}

export const DEFAULT_LANGUAGE = 'en'

export const COMMON_TRANSLATES = [
    'common',
    'colors',
    'menu',
    'navbar',
    'toasts',
    'languages'
]

export const CART_COOKIE = 'CART'

export const LIMITS = {
    cart_same_item: 10,
    cart_items: 20,
    wishlist_products: 60,
    input_email: 50,
    input_first_name: 30,
    input_last_name: 30,
    input_password: 30,
    input_search_bar: 200,
    input_country: 20,
    input_min_max: 4,
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
    358: { id: 358, id_string: 'sport-grey', colors: ['#cacaca'] },
    362: { id: 362, id_string: 'dark-chocolate', colors: ['#31221d'] },
    364: { id: 364, id_string: 'military-green', colors: ['#585c3b'] },
    367: { id: 367, id_string: 'dark-heather', colors: ['#454545'] },
    369: { id: 369, id_string: 'irish-green', colors: ['#129447'] },
    392: { id: 392, id_string: 'light-blue', colors: ['#d6e6f7'] },
    395: { id: 395, id_string: 'maroon', colors: ['#642838'] },
    416: { id: 416, id_string: 'forest-green', colors: ['#223b26'] },
    418: { id: 418, id_string: 'black', colors: ['#000000'] },
    420: { id: 420, id_string: "orange", colors: ["#ea5f22"] },
    421: { id: 421, id_string: "sand", colors: ["#dcd2be"] },
    423: { id: 423, id_string: 'red', colors: ['#c62A32'] },
    424: { id: 424, id_string: 'charcoal', colors: ['#585559'] },
    425: { id: 425, id_string: 'royal', colors: ['#084f97'] },
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
    { id: 4, color_display: { color: '#cacaca', id_string: 'light-grey' } },
    { id: 5, color_display: { color: '#2b4da4', id_string: 'blue' } },
    { id: 6, color_display: { color: '#1a1f35', id_string: 'navy' } },
    { id: 7, color_display: { color: '#026539', id_string: 'green' } },
    { id: 8, color_display: { color: '#e0824b', id_string: 'orange' } },
    { id: 9, color_display: { color: '#c62A32', id_string: 'red' } },
    { id: 10, color_display: { color: '#31221d', id_string: 'brown' } },
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
    43: { id: 43, title: 'Stoked On Printing' },
    50: { id: 50, title: 'Underground Threads' },
    87: { id: 87, title: 'Print Logistic' },
}

export const COLLECTIONS = [
    { id: 'sound-vibes', title: 'Sound Vibes', color: '#252c5e' },
    { id: 'gamer-life', title: 'Gamer Life', color: null },
]

export const MENU_OPTIONS = [
    { id: 'Home', type: 'link', href: '/' },
    { id: 'Products', type: 'forward', value: 'products' },
    { id: 'Collections', type: 'forward', value: 'collections' },
    { id: 'Support', type: 'link', href: '/support' },
]

export const MENU_FORWARD_OPTIONS = {
    products: [
        { id: 't-shirts', type: 'link', href: '/search?v=t-shirts' },
        { id: 'hoodies', type: 'link', href: '/search?v=hoodies' },
    ],
    possibleProducts: [
        { id: 'T-Shirts', type: 'link', href: '/search?v=t-shirts' },
        { id: 'Hoodies', type: 'link', href: '/search?v=hoodies' },
        { id: 'Long Sleeves', type: 'link', href: '/search?v=long+sleeves' },
        { id: 'Socks', type: 'link', href: '/search?v=socks' },
        { id: 'Mugs', type: 'link', href: '/search?v=mugs' },
        { id: 'Phone Cases', type: 'link', href: '/search?v=phone+cases' },
        { id: 'Pillows', type: 'link', href: '/search?v=pillows' },
        { id: 'Bottles & Tumblers', type: 'link', href: '/search?v=bottles+tumblers' },
        { id: 'Hats', type: 'link', href: '/search?v=hats' },
        { id: 'Blankets', type: 'link', href: '/search?v=blankets' },
        { id: 'Poster', type: 'link', href: '/search?v=poster' },
        { id: 'Apron', type: 'link', href: '/search?v=apron' },
        { id: 'Towels', type: 'link', href: '/search?v=towels' },
        { id: 'Shoes', type: 'link', href: '/search?v=shoes' },
        { id: 'Tank Tops', type: 'link', href: '/search?v=tank+tops' },
        { id: 'Bottoms', type: 'link', href: '/search?v=bottoms' },
    ],
    collections: COLLECTIONS.map(coll => ({ id: coll.title, type: 'link', href: `/search?c=${coll.id}` }))
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
    't-shirts': { id: 't-shirts', color: '#1189c4' },
    'hoodies': { id: 'hoodies', color: '#026539' },
    'raglan-tees': { id: 'raglan-tees', color: '#e0824b' },
    'mugs': { id: 'mugs', color: '#bA2326' },
}

export const POPULARITY_POINTS = {
    'visit': 1,
    'putOnCart': 5,
    'share': 20,
    'purchase': 100,
}

export const PRODUCTS_TYPES = [
    {
        id: 't-shirt',
        family_id: 't-shirts',
        title: 'T-Shirt',
        color: '#1189c4',
        providers: [29, 87],
        blueprint_ids: {
            29: 145,
            87: 145,
        },
        icon: IoShirt,
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 418, 358, 362, 364, 369, 392, 424, 425, 511, 420, 423],
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
        providers: [29, 26],
        blueprint_ids: {
            29: 77,
            26: 77,
        },
        icon: GiHoodie,
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 418, 358, 395, 364, 369, 367, 392, 425, 511, 423],
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
        providers: [43, 6],
        blueprint_ids: {
            43: 79,
            6: 79,
        },
        icon: PiTShirtFill,
        sizes: [14, 15, 16, 17, 18],
        colors: [1535, 1062, 1792, 1536, 1058, 1795, 1750],
        variants: [
            {
                id: "royal-white-s",
                id_printify: {
                    43: 33522,
                    6: 33522,
                },
                cost: 1782,
                price: 2970,
                title: "Royal/White / S",
                grams: 110,
                color_id: 1058,
                size_id: 14,
            },
            {
                id: "asphalt-white-s",
                id_printify: {
                    43: 39175,
                    6: 39175,
                },
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / S",
                grams: 110,
                color_id: 1535,
                size_id: 14,
            },
            {
                id: "red-white-s",
                id_printify: {
                    43: 36256,
                    6: 39211,
                },
                cost: 1782,
                price: 2970,
                title: "Red/White / S",
                grams: 110,
                color_id: 1536,
                size_id: 14,
            },
            {
                id: "royal-white-m",
                id_printify: {
                    43: 33523,
                    6: 33523,
                },
                cost: 1782,
                price: 2970,
                title: "Royal/White / M",
                grams: 131,
                color_id: 1058,
                size_id: 15,
            },
            {
                id: "asphalt-white-m",
                id_printify: {
                    43: 39253,
                    6: 39253,
                },
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / M",
                grams: 131,
                color_id: 1535,
                size_id: 15,
            },
            {
                id: "red-white-m",
                id_printify: {
                    43: 36258,
                    6: 39289,
                },
                cost: 1782,
                price: 2970,
                title: "Red/White / M",
                grams: 131,
                color_id: 1536,
                size_id: 15,
            },
            {
                id: "royal-white-l",
                id_printify: {
                    43: 33524,
                    6: 33524,
                },
                cost: 1782,
                price: 2970,
                title: "Royal/White / L",
                grams: 158,
                color_id: 1058,
                size_id: 16,
            },
            {
                id: "asphalt-white-l",
                id_printify: {
                    43: 39331,
                    6: 39331,
                },
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / L",
                grams: 158,
                color_id: 1535,
                size_id: 16,
            },
            {
                id: "red-white-l",
                id_printify: {
                    43: 36260,
                    6: 39367,
                },
                cost: 1782,
                price: 2970,
                title: "Red/White / L",
                grams: 158,
                color_id: 1536,
                size_id: 16,
            },
            {
                id: "royal-white-xl",
                id_printify: {
                    43: 33525,
                    6: 33525,
                },
                cost: 1782,
                price: 2970,
                title: "Royal/White / XL",
                grams: 190,
                color_id: 1058,
                size_id: 17,
            },
            {
                id: "asphalt-white-xl",
                id_printify: {
                    43: 39409,
                    6: 39409,
                },
                cost: 1782,
                price: 2970,
                title: "Asphalt/White / XL",
                grams: 190,
                color_id: 1535,
                size_id: 17,
            },
            {
                id: "red-white-xl",
                id_printify: {
                    43: 36264,
                    6: 39523,
                },
                cost: 1782,
                price: 2970,
                title: "Red/White / XL",
                grams: 190,
                color_id: 1536,
                size_id: 17,
            },
            {
                id: "royal-white-2xl",
                id_printify: {
                    43: 33526,
                    6: 33526,
                },
                cost: 1993,
                price: 3322,
                title: "Royal/White / 2XL",
                grams: 228,
                color_id: 1058,
                size_id: 18,
            },
            {
                id: "asphalt-white-2xl",
                id_printify: {
                    43: 39487,
                    6: 39487,
                },
                cost: 1993,
                price: 3322,
                title: "Asphalt/White / 2XL",
                grams: 228,
                color_id: 1535,
                size_id: 18,
            },
            {
                id: "red-white-2xl",
                id_printify: {
                    43: 36264,
                    6: 39523,
                },
                cost: 1993,
                price: 3322,
                title: "Red/White / 2XL",
                grams: 228,
                color_id: 1536,
                size_id: 18,
            },
            {
                id: "white-black-s",
                id_printify: {
                    43: 39151,
                    6: 39151,
                },
                cost: 1782,
                price: 2970,
                title: "White/Black / S",
                grams: 110,
                color_id: 1750,
                size_id: 14,
            },
            {
                id: "green-white-s",
                id_printify: {
                    43: 39193,
                    6: 39193,
                },
                cost: 1782,
                price: 2970,
                title: "Green/White / S",
                grams: 110,
                color_id: 1792,
                size_id: 14,
            },
            {
                id: "navy-white-s",
                id_printify: {
                    43: 39196,
                    6: 39196,
                },
                cost: 1782,
                price: 2970,
                title: "Navy/White / S",
                grams: 110,
                color_id: 1795,
                size_id: 14,
            },
            {
                id: "black-white-s",
                id_printify: {
                    43: 39178,
                    6: 39178,
                },
                cost: 1782,
                price: 2970,
                title: "Black/White / S",
                grams: 110,
                color_id: 1062,
                size_id: 14,
            },
            {
                id: "white-black-m",
                id_printify: {
                    43: 39229,
                    6: 39229,
                },
                cost: 1782,
                price: 2970,
                title: "White/Black / M",
                grams: 131,
                color_id: 1750,
                size_id: 15,
            },
            {
                id: "green-white-m",
                id_printify: {
                    43: 39271,
                    6: 39271,
                },
                cost: 1782,
                price: 2970,
                title: "Green/White / M",
                grams: 131,
                color_id: 1792,
                size_id: 15,
            },
            {
                id: "navy-white-m",
                id_printify: {
                    43: 39274,
                    6: 39274,
                },
                cost: 1782,
                price: 2970,
                title: "Navy/White / M",
                grams: 131,
                color_id: 1795,
                size_id: 15,
            },
            {
                id_printify: {
                    43: 39256,
                    6: 39256,
                },
                cost: 1782,
                price: 2970,
                title: "Black/White / M",
                grams: 131,
                color_id: 1062,
                size_id: 15,
            },
            {
                id: "white-black-l",
                id_printify: {
                    43: 39307,
                    6: 39307,
                },
                cost: 1782,
                price: 2970,
                title: "White/Black / L",
                grams: 158,
                color_id: 1750,
                size_id: 16,
            },
            {
                id: "green-white-l",
                id_printify: {
                    43: 39349,
                    6: 39349,
                },
                cost: 1782,
                price: 2970,
                title: "Green/White / L",
                grams: 158,
                color_id: 1792,
                size_id: 16,
            },
            {
                id: "navy-white-l",
                id_printify: {
                    43: 39352,
                    6: 39352,
                },
                cost: 1782,
                price: 2970,
                title: "Navy/White / L",
                grams: 158,
                color_id: 1795,
                size_id: 16,
            },
            {
                id: "black-white-l",
                id_printify: {
                    43: 39334,
                    6: 39334,
                },
                cost: 1782,
                price: 2970,
                title: "Black/White / L",
                grams: 158,
                color_id: 1062,
                size_id: 16,
            },
            {
                id: "white-black-xl",
                id_printify: {
                    43: 39385,
                    6: 39385,
                },
                cost: 1782,
                price: 2970,
                title: "White/Black / XL",
                grams: 190,
                color_id: 1750,
                size_id: 17,
            },
            {
                id: "green-white-xl",
                id_printify: {
                    43: 39427,
                    6: 39427,
                },
                cost: 1782,
                price: 2970,
                title: "Green/White / XL",
                grams: 190,
                color_id: 1792,
                size_id: 17,
            },
            {
                id: "navy-white-xl",
                id_printify: {
                    43: 39430,
                    6: 39430,
                },
                cost: 1782,
                price: 2970,
                title: "Navy/White / XL",
                grams: 190,
                color_id: 1795,
                size_id: 17,
            },
            {
                id: "black-white-xl",
                id_printify: {
                    43: 39412,
                    6: 39412,
                },
                cost: 1782,
                price: 2970,
                title: "Black/White / XL",
                grams: 190,
                color_id: 1062,
                size_id: 17,
            },
            {
                id: "white-black-2xl",
                id_printify: {
                    43: 39463,
                    6: 39463,
                },
                cost: 1993,
                price: 3322,
                title: "White/Black / 2XL",
                grams: 228,
                color_id: 1750,
                size_id: 18,
            },
            {
                id: "green-white-2xl",
                id_printify: {
                    43: 39505,
                    6: 39505,
                },
                cost: 1993,
                price: 3322,
                title: "Green/White / 2XL",
                grams: 228,
                color_id: 1792,
                size_id: 18,
            },
            {
                id: "navy-white-2xl",
                id_printify: {
                    43: 39508,
                    6: 39508,
                },
                cost: 1993,
                price: 3322,
                title: "Navy/White / 2XL",
                grams: 228,
                color_id: 1795,
                size_id: 18,
            },
            {
                id: "black-white-2xl",
                id_printify: {
                    43: 39490,
                    6: 39490,
                },
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
        id: 'sweatshirt',
        family_id: 'sweatshirts',
        title: 'Sweatshirt',
        color: '#009c75',
        providers: [50, 87],
        blueprint_ids: {
            50: 49,
            87: 49,
        },
        icon: PiTShirtFill,
        sizes: [14, 15, 16, 17, 18],
        colors: [521, 451, 418, 421, 358, 416, 367, 392, 425, 511, 433, 423],
        variants: [
            {
                id: "ash-s",
                id_printify: {
                    50: 25377,
                    87: 25377,
                },
                cost: 1681,
                price: 2802,
                title: "Ash / S",
                grams: 318,
                color_id: 451,
                size_id: 14,
            },
            {
                id: "dark-heather-s",
                id_printify: {
                    50: 25381,
                    87: 25381,
                },
                cost: 1681,
                price: 2802,
                title: "Dark Heather / S",
                grams: 318,
                color_id: 367,
                size_id: 14,
            },
            {
                id: "light-blue-s",
                id_printify: {
                    50: 25385,
                    87: 25385,
                },
                cost: 1681,
                price: 2802,
                title: "Light Blue / S",
                grams: 318,
                color_id: 392,
                size_id: 14,
            },
            {
                id: "light-pink-s",
                id_printify: {
                    50: 25386,
                    87: 25386,
                },
                cost: 1681,
                price: 2802,
                title: "Light Pink / S",
                grams: 318,
                color_id: 433,
                size_id: 14,
            },
            {
                id: "navy-s",
                id_printify: {
                    50: 25388,
                    87: 25388,
                },
                cost: 1681,
                price: 2802,
                title: "Navy / S",
                grams: 131,
                color_id: 511,
                size_id: 14,
            },
            {
                id: "royal-s",
                id_printify: {
                    50: 25625,
                    87: 25625,
                },
                cost: 1681,
                price: 2802,
                title: "Royal / S",
                grams: 318,
                color_id: 425,
                size_id: 14,
            },
            {
                id: "red-s",
                id_printify: {
                    50: 25391,
                    87: 25391,
                },
                cost: 1681,
                price: 2802,
                title: "Red / S",
                grams: 318,
                color_id: 423,
                size_id: 14,
            },
            {
                id: "sand-s",
                id_printify: {
                    50: 25394,
                    87: 25394,
                },
                cost: 1681,
                price: 2802,
                title: "Sand / S",
                grams: 318,
                color_id: 421,
                size_id: 14,
            },
            {
                id: "sport-grey-s",
                id_printify: {
                    50: 25395,
                    87: 25395,
                },
                cost: 1681,
                price: 2802,
                title: "Sport Grey / S",
                grams: 318,
                color_id: 358,
                size_id: 14,
            },
            {
                id: "white-s",
                id_printify: {
                    50: 25396,
                    87: 25396,
                },
                cost: 1681,
                price: 2802,
                title: "White / S",
                grams: 318,
                color_id: 521,
                size_id: 14,
            },
            {
                id: "black-s",
                id_printify: {
                    50: 25397,
                    87: 25397,
                },
                cost: 1681,
                price: 2802,
                title: "Black / S",
                grams: 158,
                color_id: 418,
                size_id: 14,
            },
            {
                id: "forest-green-s",
                id_printify: {
                    50: 25400,
                    87: 25400,
                },
                cost: 1681,
                price: 2802,
                title: "Forest Green / S",
                grams: 318,
                color_id: 416,
                size_id: 14,
            },
            {
                id: "ash-m",
                id_printify: {
                    50: 25408,
                    87: 25408,
                },
                cost: 1681,
                price: 2802,
                title: "Ash / M",
                grams: 349,
                color_id: 451,
                size_id: 15,
            },
            {
                id: "dark-heather-m",
                id_printify: {
                    50: 25412,
                    87: 25412,
                },
                cost: 1681,
                price: 2802,
                title: "Dark Heather / M",
                grams: 349,
                color_id: 367,
                size_id: 15,
            },
            {
                id: "light-blue-m",
                id_printify: {
                    50: 25416,
                    87: 25416,
                },
                cost: 1681,
                price: 2802,
                title: "Light Blue / M",
                grams: 349,
                color_id: 392,
                size_id: 15,
            },
            {
                id: "light-pink-m",
                id_printify: {
                    50: 25417,
                    87: 25417,
                },
                cost: 1681,
                price: 2802,
                title: "Light Pink / M",
                grams: 349,
                color_id: 433,
                size_id: 15,
            },
            {
                id: "navy-m",
                id_printify: {
                    50: 25419,
                    87: 25419,
                },
                cost: 1681,
                price: 2802,
                title: "Navy / M",
                grams: 349,
                color_id: 511,
                size_id: 15,
            },
            {
                id: "royal-m",
                id_printify: {
                    50: 25624,
                    87: 25624,
                },
                cost: 1681,
                price: 2802,
                title: "Royal / M",
                grams: 349,
                color_id: 425,
                size_id: 15,
            },
            {
                id: "red-m",
                id_printify: {
                    50: 25422,
                    87: 25422,
                },
                cost: 1681,
                price: 2802,
                title: "Red / M",
                grams: 349,
                color_id: 423,
                size_id: 15,
            },
            {
                id: "sand-m",
                id_printify: {
                    50: 25425,
                    87: 25425,
                },
                cost: 1681,
                price: 2802,
                title: "Sand / M",
                grams: 349,
                color_id: 421,
                size_id: 15,
            },
            {
                id: "sport-grey-m",
                id_printify: {
                    50: 25426,
                    87: 25426,
                },
                cost: 1681,
                price: 2802,
                title: "Sport Grey / M",
                grams: 349,
                color_id: 358,
                size_id: 15,
            },
            {
                id: "white-m",
                id_printify: {
                    50: 25427,
                    87: 25427,
                },
                cost: 1681,
                price: 2802,
                title: "White / M",
                grams: 349,
                color_id: 521,
                size_id: 15,
            },
            {
                id: "black-m",
                id_printify: {
                    50: 25428,
                    87: 25428,
                },
                cost: 1681,
                price: 2802,
                title: "Black / M",
                grams: 349,
                color_id: 418,
                size_id: 15,
            },
            {
                id: "forest-green-m",
                id_printify: {
                    50: 25431,
                    87: 25431,
                },
                cost: 1681,
                price: 2802,
                title: "Forest Green / M",
                grams: 349,
                color_id: 416,
                size_id: 15,
            },
            {
                id: "ash-l",
                id_printify: {
                    50: 25439,
                    87: 25439,
                },
                cost: 1681,
                price: 2802,
                title: "Ash / L",
                grams: 391,
                color_id: 451,
                size_id: 16,
            },
            {
                id: "dark-heather-l",
                id_printify: {
                    50: 25443,
                    87: 25443,
                },
                cost: 1681,
                price: 2802,
                title: "Dark Heather / L",
                grams: 391,
                color_id: 367,
                size_id: 16,
            },
            {
                id: "light-blue-l",
                id_printify: {
                    50: 25447,
                    87: 25447,
                },
                cost: 1681,
                price: 2802,
                title: "Light Blue / L",
                grams: 391,
                color_id: 392,
                size_id: 16,
            },
            {
                id: "light-pink-l",
                id_printify: {
                    50: 25448,
                    87: 25448,
                },
                cost: 1681,
                price: 2802,
                title: "Light Pink / L",
                grams: 391,
                color_id: 433,
                size_id: 16,
            },
            {
                id: "navy-l",
                id_printify: {
                    50: 25450,
                    87: 25450,
                },
                cost: 1681,
                price: 2802,
                title: "Navy / L",
                grams: 391,
                color_id: 511,
                size_id: 16,
            },
            {
                id: "royal-l",
                id_printify: {
                    50: 25623,
                    87: 25623,
                },
                cost: 1681,
                price: 2802,
                title: "Royal / L",
                grams: 391,
                color_id: 425,
                size_id: 16,
            },
            {
                id: "red-l",
                id_printify: {
                    50: 25453,
                    87: 25453,
                },
                cost: 1681,
                price: 2802,
                title: "Red / L",
                grams: 391,
                color_id: 423,
                size_id: 16,
            },
            {
                id: "sand-l",
                id_printify: {
                    50: 25456,
                    87: 25456,
                },
                cost: 1681,
                price: 2802,
                title: "Sand / L",
                grams: 391,
                color_id: 421,
                size_id: 16,
            },
            {
                id: "sport-grey-l",
                id_printify: {
                    50: 25457,
                    87: 25457,
                },
                cost: 1681,
                price: 2802,
                title: "Sport Grey / L",
                grams: 391,
                color_id: 358,
                size_id: 16,
            },
            {
                id: "white-l",
                id_printify: {
                    50: 25458,
                    87: 25458,
                },
                cost: 1681,
                price: 2802,
                title: "White / L",
                grams: 391,
                color_id: 521,
                size_id: 16,
            },
            {
                id: "black-l",
                id_printify: {
                    50: 25459,
                    87: 25459,
                },
                cost: 1681,
                price: 2802,
                title: "Black / L",
                grams: 391,
                color_id: 418,
                size_id: 16,
            },
            {
                id: "forest-green-l",
                id_printify: {
                    50: 25462,
                    87: 25462,
                },
                cost: 1681,
                price: 2802,
                title: "Forest Green / L",
                grams: 391,
                color_id: 416,
                size_id: 16,
            },
            {
                id: "ash-xl",
                id_printify: {
                    50: 25470,
                    87: 25470,
                },
                cost: 1681,
                price: 2802,
                title: "Ash / XL",
                grams: 454,
                color_id: 451,
                size_id: 17,
            },
            {
                id: "dark-heather-xl",
                id_printify: {
                    50: 25474,
                    87: 25474,
                },
                cost: 1681,
                price: 2802,
                title: "Dark Heather / XL",
                grams: 454,
                color_id: 367,
                size_id: 17,
            },
            {
                id: "light-blue-xl",
                id_printify: {
                    50: 25478,
                    87: 25478,
                },
                cost: 1681,
                price: 2802,
                title: "Light Blue / XL",
                grams: 454,
                color_id: 392,
                size_id: 17,
            },
            {
                id: "light-pink-xl",
                id_printify: {
                    50: 25479,
                    87: 25479,
                },
                cost: 1681,
                price: 2802,
                title: "Light Pink / XL",
                grams: 454,
                color_id: 433,
                size_id: 17,
            },
            {
                id: "navy-xl",
                id_printify: {
                    50: 25481,
                    87: 25481,
                },
                cost: 1681,
                price: 2802,
                title: "Navy / XL",
                grams: 454,
                color_id: 511,
                size_id: 17,
            },
            {
                id: "royal-xl",
                id_printify: {
                    50: 25626,
                    87: 25626,
                },
                cost: 1681,
                price: 2802,
                title: "Royal / XL",
                grams: 454,
                color_id: 425,
                size_id: 17,
            },
            {
                id: "red-xl",
                id_printify: {
                    50: 25484,
                    87: 25484,
                },
                cost: 1681,
                price: 2802,
                title: "Red / XL",
                grams: 454,
                color_id: 423,
                size_id: 17,
            },
            {
                id: "sand-xl",
                id_printify: {
                    50: 25487,
                    87: 25487,
                },
                cost: 1681,
                price: 2802,
                title: "Sand / XL",
                grams: 454,
                color_id: 421,
                size_id: 17,
            },
            {
                id: "sport-grey-xl",
                id_printify: {
                    50: 25488,
                    87: 25488,
                },
                cost: 1681,
                price: 2802,
                title: "Sport Grey / XL",
                grams: 454,
                color_id: 358,
                size_id: 17,
            },
            {
                id: "white-xl",
                id_printify: {
                    50: 25489,
                    87: 25489,
                },
                cost: 1681,
                price: 2802,
                title: "White / XL",
                grams: 454,
                color_id: 521,
                size_id: 17,
            },
            {
                id: "black-xl",
                id_printify: {
                    50: 25490,
                    87: 25490,
                },
                cost: 1681,
                price: 2802,
                title: "Black / XL",
                grams: 454,
                color_id: 418,
                size_id: 17,
            },
            {
                id: "forest-green-xl",
                id_printify: {
                    50: 25493,
                    87: 25493,
                },
                cost: 1681,
                price: 2802,
                title: "Forest Green / XL",
                grams: 454,
                color_id: 416,
                size_id: 17,
            },
            {
                id: "ash-2xl",
                id_printify: {
                    50: 25501,
                    87: 25501,
                },
                cost: 1681,
                price: 2802,
                title: "Ash / 2XL",
                grams: 496,
                color_id: 451,
                size_id: 18,
            },
            {
                id: "dark-heather-2xl",
                id_printify: {
                    50: 25505,
                    87: 25505,
                },
                cost: 1681,
                price: 2802,
                title: "Dark Heather / 2XL",
                grams: 496,
                color_id: 367,
                size_id: 18,
            },
            {
                id: "light-blue-2xl",
                id_printify: {
                    50: 25509,
                    87: 25509,
                },
                cost: 1681,
                price: 2802,
                title: "Light Blue / 2XL",
                grams: 496,
                color_id: 392,
                size_id: 18,
            },
            {
                id: "light-pink-2xl",
                id_printify: {
                    50: 25510,
                    87: 25510,
                },
                cost: 1681,
                price: 2802,
                title: "Light Pink / 2XL",
                grams: 496,
                color_id: 433,
                size_id: 18,
            },
            {
                id: "navy-2xl",
                id_printify: {
                    50: 25512,
                    87: 25512,
                },
                cost: 1681,
                price: 2802,
                title: "Navy / 2XL",
                grams: 496,
                color_id: 511,
                size_id: 18,
            },
            {
                id: "royal-2xl",
                id_printify: {
                    50: 25627,
                    87: 25627,
                },
                cost: 1681,
                price: 2802,
                title: "Royal / 2XL",
                grams: 496,
                color_id: 425,
                size_id: 18,
            },
            {
                id: "red-2xl",
                id_printify: {
                    50: 25515,
                    87: 25515,
                },
                cost: 1681,
                price: 2802,
                title: "Red / 2XL",
                grams: 496,
                color_id: 423,
                size_id: 18,
            },
            {
                id: "sand-2xl",
                id_printify: {
                    50: 25518,
                    87: 25518,
                },
                cost: 1681,
                price: 2802,
                title: "Sand / 2XL",
                grams: 496,
                color_id: 421,
                size_id: 18,
            },
            {
                id: "sport-grey-2xl",
                id_printify: {
                    50: 25519,
                    87: 25519,
                },
                cost: 1681,
                price: 2802,
                title: "Sport Grey / 2XL",
                grams: 496,
                color_id: 358,
                size_id: 18,
            },
            {
                id: "white-2xl",
                id_printify: {
                    50: 25520,
                    87: 25520,
                },
                cost: 1681,
                price: 2802,
                title: "White / 2XL",
                grams: 496,
                color_id: 521,
                size_id: 18,
            },
            {
                id: "black-2xl",
                id_printify: {
                    50: 25521,
                    87: 25521,
                },
                cost: 1681,
                price: 2802,
                title: "Black / 2XL",
                grams: 496,
                color_id: 418,
                size_id: 18,
            },
            {
                id: "forest-green-2xl",
                id_printify: {
                    50: 25524,
                    87: 25524,
                },
                cost: 1681,
                price: 2802,
                title: "Forest Green / 2XL",
                grams: 496,
                color_id: 416,
                size_id: 18,
            },
        ],
    },
    {
        id: 'mug',
        family_id: 'mugs',
        title: 'Mug',
        color: '#bA2326',
        providers: [1, 87],
        blueprint_ids: {
            1: 68,
            87: 1020,
        },
        icon: ImMug,
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
        blueprint_ids: {
            28: 635,
            87: 1019,
        },
        icon: ImMug,
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

    if (product_type === 't-shirt') {
        if (country === 'US') {
            return {
                provider_id: 29,
                first_item: 475,
                add_item: 240,
                tax: 114,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 29,
                first_item: 939,
                add_item: 439,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'PL') {
            return {
                provider_id: 87,
                first_item: 499,
                add_item: 119,
                tax: 302,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 199,
                tax: 298,
                currency: 'usd'
            }
        }
        if (country === 'AU') {
            return {
                provider_id: 29,
                first_item: 1249,
                add_item: 499,
                tax: 0,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 569,
                add_item: 199,
                tax: 314,
                currency: 'usd'
            }
        }
        return {
            provider_id: 29,
            first_item: 1000,
            add_item: 400,
            tax: 0,
            currency: 'usd'
        }
    }
    if (product_type === 'hoodie') {
        if (country === 'US') {
            return {
                provider_id: 29,
                first_item: 849,
                add_item: 209,
                tax: 162,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 29,
                first_item: 1269,
                add_item: 659,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'PL') {
            return {
                provider_id: 26,
                first_item: 699,
                add_item: 239,
                tax: 679,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 26,
                first_item: 729,
                add_item: 239,
                tax: 587,
                currency: 'usd'
            }
        }
        if (country === 'AU') {
            return {
                provider_id: 29,
                first_item: 2199,
                add_item: 999,
                tax: 0,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 26,
                first_item: 699,
                add_item: 239,
                tax: 669,
                currency: 'usd'
            }
        }
        return {
            provider_id: 29,
            first_item: 1500,
            add_item: 1000,
            tax: 0,
            currency: 'usd'
        }
    }
    if (product_type === 'raglan-tee') {
        if (country === 'US') {
            return {
                provider_id: 43,
                first_item: 519,
                add_item: 219,
                tax: 171,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 43,
                first_item: 939,
                add_item: 439,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 6,
                first_item: 479,
                add_item: 99,
                tax: 424,
                currency: 'usd'
            }
        }
        if (country === 'DE') {
            return {
                provider_id: 6,
                first_item: 629,
                add_item: 119,
                tax: 550,
                currency: 'usd'
            }
        }
        if (country === 'AU') {
            return {
                provider_id: 43,
                first_item: 1249,
                add_item: 499,
                tax: 0,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 6,
                first_item: 749,
                add_item: 129,
                tax: 550,
                currency: 'usd'
            }
        }
        return {
            provider_id: 43,
            first_item: 1000,
            add_item: 400,
            tax: 0,
            currency: 'usd'
        }
    }
    if (product_type === 'sweatshirt') {
        if (country === 'US') {
            return {
                provider_id: 50,
                first_item: 999,
                add_item: 249,
                tax: 191,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 50,
                first_item: 1269,
                add_item: 659,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 239,
                tax: 460,
                currency: 'usd'
            }
        }
        if (country === 'IE') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 239,
                tax: 529,
                currency: 'usd'
            }
        }
        if (country === 'AU') {
            return {
                provider_id: 50,
                first_item: 2199,
                add_item: 999,
                tax: 0,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 239,
                tax: 547,
                currency: 'usd'
            }
        }
        if (EU_NORTH_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 999,
                add_item: 239,
                tax: 642,
                currency: 'usd'
            }
        }
        return {
            provider_id: 50,
            first_item: 1500,
            add_item: 1000,
            tax: 0,
            currency: 'usd'
        }
    }
    if (product_type === 'mug') {
        if (country === 'US') {
            return {
                provider_id: 1,
                first_item: 639,
                add_item: 400,
                tax: 92,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 1,
                first_item: 1489,
                add_item: 609,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'PL') {
            return {
                provider_id: 87,
                first_item: 659,
                add_item: 199,
                tax: 272,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                tax: 250,
                currency: 'usd'
            }
        }
        if (country === 'IE') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                tax: 288,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 179,
                tax: 281,
                currency: 'usd'
            }
        }
        if (EU_NORTH_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 1029,
                add_item: 199,
                tax: 372,
                currency: 'usd'
            }
        }
        return {
            provider_id: 87,
            first_item: 1359,
            add_item: 699,
            tax: 0,
            currency: 'usd'
        }
    }
    if (product_type === 'mug-c') {
        if (country === 'US') {
            return {
                provider_id: 28,
                first_item: 639,
                add_item: 359,
                tax: 86,
                currency: 'usd'
            }
        }
        if (country === 'CA') {
            return {
                provider_id: 28,
                first_item: 1149,
                add_item: 599,
                tax: 0,
                currency: 'usd'
            }
        }
        if (country === 'PL') {
            return {
                provider_id: 87,
                first_item: 659,
                add_item: 199,
                tax: 291,
                currency: 'usd'
            }
        }
        if (country === 'GB') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                tax: 266,
                currency: 'usd'
            }
        }
        if (country === 'IE') {
            return {
                provider_id: 87,
                first_item: 729,
                add_item: 169,
                tax: 307,
                currency: 'usd'
            }
        }
        if (EU_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 699,
                add_item: 179,
                tax: 300,
                currency: 'usd'
            }
        }
        if (EU_NORTH_COUNTRIES.includes(country)) {
            return {
                provider_id: 87,
                first_item: 1029,
                add_item: 199,
                tax: 392,
                currency: 'usd'
            }
        }
        return {
            provider_id: 87,
            first_item: 1359,
            add_item: 699,
            tax: 0,
            currency: 'usd'
        }
    }
}

export function getCurrencyByLocation(country, zone) {
    if (zone === 'Europe')
        return 'eur'
    if (country === 'BR')
        return 'brl'
    return 'usd'
}

export const USER_CUSTOMIZE_HOME_PAGE = THEMES_POOL.map(theme => ({ ...theme, query: 'h' })).concat(Object.keys(PRODUCTS_FAMILY).map(id => ({ id: id, query: 'v' }))).sort((a, b) => b.id.toLowerCase() < a.id.toLowerCase() ? 1 : -1)