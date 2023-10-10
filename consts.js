export const CART_COOKIE = 'CART'

export const MENU_OPTIONS = [
    { title: 'Home', type: 'link', href: '/' },
    { title: 'Departments', type: 'forward', value: 'departments' },
    { title: 'Collections', type: 'forward', value: 'collections' },
    { title: 'Support', type: 'link', href: '/support' },
    { title: 'About us', type: 'link', href: '/about-us' },
]

export const MENU_FORWARD_OPTIONS = {
    departments: [
        { title: 'Kitchen', type: 'link', href: '/search?c=kitchen' },
    ],
    products: [
        { title: 'T-Shirts', type: 'link', href: '/search?c=t-shirts' },
        { title: 'Hoodies', type: 'link', href: '/search?c=hoodies' },
        { title: 'Long Sleeves', type: 'link', href: '/search?c=long+sleeves' },
        { title: 'Socks', type: 'link', href: '/search?c=socks' },
        { title: 'Mugs', type: 'link', href: '/search?c=mugs' },
        { title: 'Phone Cases', type: 'link', href: '/search?c=phone+cases' },
        { title: 'Pillows', type: 'link', href: '/search?c=pillows' },
        { title: 'Bottles & Tumblers', type: 'link', href: '/search?c=bottles+tumblers' },
        { title: 'Hats', type: 'link', href: '/search?c=hats' },
        { title: 'Blankets', type: 'link', href: '/search?c=blankets' },
        { title: 'Poster', type: 'link', href: '/search?c=poster' },
        { title: 'Apron', type: 'link', href: '/search?c=apron' },
        { title: 'Towels', type: 'link', href: '/search?c=towels' },
        { title: 'Shoes', type: 'link', href: '/search?c=shoes' },
        { title: 'Tank Tops', type: 'link', href: '/search?c=tank+tops' },
        { title: 'Bottoms', type: 'link', href: '/search?c=bottoms' },
    ],
    collections: [
        { title: 'Music', type: 'link', href: '/search?c=music' },
        { title: 'Zombies', type: 'link', href: '/search?c=zombies' },
        { title: 'Games', type: 'link', href: '/search?c=games' }
    ]
}

export const TAGS_POOL = [
    'games',
    'hoodies',
    't-shirts',
    'home',
    'pillows',
    'socks',
    'bed',
    'computer',
    'zombies',
    'halloween',
    'music',
    'rock',
    'guitar',
    'glitch',
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

export const TYPES_POOL = [
    {
        id: 't-shirts',
        title: 'T-Shirts',
        providers: [
            {
                id: 29,
                title: 'Monster Digital',
            },
            {
                id: 87,
                title: 'Print Logistic',
            },
            {
                id: 72,
                title: 'Print Clever',
            }
        ],
        colors: [
            { id: 521, colors: ['#ffffff'], title: 'White' },
            { id: 418, colors: ['#000000'], title: 'Black' },
            { id: 358, colors: ['#CACACA'], title: 'Sport Grey' },
            { id: 362, colors: ['#31221D'], title: 'Dark Chocolate' },
            { id: 364, colors: ['#585c3b'], title: 'Military Green' },
            { id: 369, colors: ['#129447'], title: 'Irish Green' },
            { id: 392, colors: ['#d6e6f7'], title: 'Light Blue' },
            { id: 424, colors: ['#585559'], title: 'Charcoal' },
            { id: 425, colors: ['#084f97'], title: 'Royal' },
            { id: 511, colors: ['#1a2237'], title: 'Navy' },
            { id: 423, colors: ['#C62A32'], title: 'Red' }
        ],
        sizes: [
            { id: 14, title: 'S' },
            { id: 15, title: 'M' },
            { id: 16, title: 'L' },
            { id: 17, title: 'XL' },
            { id: 18, title: '2XL' },
        ],
        variants: [
            {
                id: 38164,
                cost: 959,
                price: 1598,
                title: "Black / S",
                grams: 111,
                options: [
                    418,
                    14
                ],
            },
            {
                id: 38166,
                cost: 959,
                price: 1598,
                title: "Military Green / S",
                grams: 111,
                options: [
                    364,
                    14
                ],
            },
            {
                id: 38153,
                cost: 959,
                price: 1598,
                title: "Charcoal / S",
                grams: 111,
                options: [
                    424,
                    14
                ],
            },
            {
                id: 38155,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / S",
                grams: 111,
                options: [
                    362,
                    14
                ],
            },
            {
                id: 38156,
                cost: 959,
                price: 1598,
                title: "Irish Green / S",
                grams: 111,
                options: [
                    369,
                    14
                ],
            },
            {
                id: 38157,
                cost: 959,
                price: 1598,
                title: "Light Blue / S",
                grams: 111,
                options: [
                    392,
                    14
                ],
            },
            {
                id: 38158,
                cost: 959,
                price: 1598,
                title: "Navy / S",
                grams: 111,
                options: [
                    511,
                    14
                ],
            },
            {
                id: 38160,
                cost: 959,
                price: 1598,
                title: "Red / S",
                grams: 111,
                options: [
                    423,
                    14
                ],
            },
            {
                id: 38161,
                cost: 959,
                price: 1598,
                title: "Royal / S",
                grams: 111,
                options: [
                    425,
                    14
                ],
            },
            {
                id: 38163,
                cost: 959,
                price: 1598,
                title: "White / S",
                grams: 111,
                options: [
                    521,
                    14
                ],
            },
            {
                id: 38162,
                cost: 959,
                price: 1598,
                title: "Sport Grey / S",
                grams: 111,
                options: [
                    358,
                    14
                ],
            },
            {
                id: 38178,
                cost: 959,
                price: 1598,
                title: "Black / M",
                grams: 120,
                options: [
                    418,
                    15
                ],
            },
            {
                id: 38180,
                cost: 959,
                price: 1598,
                title: "Military Green / M",
                grams: 120,
                options: [
                    364,
                    15
                ],
            },
            {
                id: 38167,
                cost: 959,
                price: 1598,
                title: "Charcoal / M",
                grams: 120,
                options: [
                    424,
                    15
                ],
            },
            {
                id: 38169,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / M",
                grams: 120,
                options: [
                    362,
                    15
                ],
            },
            {
                id: 38170,
                cost: 959,
                price: 1598,
                title: "Irish Green / M",
                grams: 120,
                options: [
                    369,
                    15
                ],
            },
            {
                id: 38171,
                cost: 959,
                price: 1598,
                title: "Light Blue / M",
                grams: 120,
                options: [
                    392,
                    15
                ],
            },
            {
                id: 38172,
                cost: 959,
                price: 1598,
                title: "Navy / M",
                grams: 120,
                options: [
                    511,
                    15
                ],
            },
            {
                id: 38174,
                cost: 959,
                price: 1598,
                title: "Red / M",
                grams: 120,
                options: [
                    423,
                    15
                ],
            },
            {
                id: 38175,
                cost: 959,
                price: 1598,
                title: "Royal / M",
                grams: 120,
                options: [
                    425,
                    15
                ],
            },
            {
                id: 38177,
                cost: 959,
                price: 1598,
                title: "White / M",
                grams: 120,
                options: [
                    521,
                    15
                ],
            },
            {
                id: 38176,
                cost: 959,
                price: 1598,
                title: "Sport Grey / M",
                grams: 120,
                options: [
                    358,
                    15
                ],
            },
            {
                id: 38192,
                cost: 959,
                price: 1598,
                title: "Black / L",
                grams: 140,
                options: [
                    418,
                    16
                ],
            },
            {
                id: 38194,
                cost: 959,
                price: 1598,
                title: "Military Green / L",
                grams: 140,
                options: [
                    364,
                    16
                ],
            },
            {
                id: 38181,
                cost: 959,
                price: 1598,
                title: "Charcoal / L",
                grams: 140,
                options: [
                    424,
                    16
                ],
            },
            {
                id: 38183,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / L",
                grams: 140,
                options: [
                    362,
                    16
                ],
            },
            {
                id: 38184,
                cost: 959,
                price: 1598,
                title: "Irish Green / L",
                grams: 140,
                options: [
                    369,
                    16
                ],
            },
            {
                id: 38185,
                cost: 959,
                price: 1598,
                title: "Light Blue / L",
                grams: 140,
                options: [
                    392,
                    16
                ],
            },
            {
                id: 38186,
                cost: 959,
                price: 1598,
                title: "Navy / L",
                grams: 140,
                options: [
                    511,
                    16
                ],
            },
            {
                id: 38188,
                cost: 959,
                price: 1598,
                title: "Red / L",
                grams: 140,
                options: [
                    423,
                    16
                ],
            },
            {
                id: 38189,
                cost: 959,
                price: 1598,
                title: "Royal / L",
                grams: 140,
                options: [
                    425,
                    16
                ],
            },
            {
                id: 38191,
                cost: 959,
                price: 1598,
                title: "White / L",
                grams: 140,
                options: [
                    521,
                    16
                ],
            },
            {
                id: 38190,
                cost: 959,
                price: 1598,
                title: "Sport Grey / L",
                grams: 140,
                options: [
                    358,
                    16
                ],
            },
            {
                id: 38206,
                cost: 959,
                price: 1598,
                title: "Black / XL",
                grams: 160,
                options: [
                    418,
                    17
                ],
            },
            {
                id: 38208,
                cost: 959,
                price: 1598,
                title: "Military Green / XL",
                grams: 160,
                options: [
                    364,
                    17
                ],
            },
            {
                id: 38195,
                cost: 959,
                price: 1598,
                title: "Charcoal / XL",
                grams: 160,
                options: [
                    424,
                    17
                ],
            },
            {
                id: 38197,
                cost: 959,
                price: 1598,
                title: "Dark Chocolate / XL",
                grams: 160,
                options: [
                    362,
                    17
                ],
            },
            {
                id: 38198,
                cost: 959,
                price: 1598,
                title: "Irish Green / XL",
                grams: 160,
                options: [
                    369,
                    17
                ],
            },
            {
                id: 38199,
                cost: 959,
                price: 1598,
                title: "Light Blue / XL",
                grams: 160,
                options: [
                    392,
                    17
                ],
            },
            {
                id: 38200,
                cost: 959,
                price: 1598,
                title: "Navy / XL",
                grams: 160,
                options: [
                    511,
                    17
                ],
            },
            {
                id: 38202,
                cost: 959,
                price: 1598,
                title: "Red / XL",
                grams: 160,
                options: [
                    423,
                    17
                ],
            },
            {
                id: 38203,
                cost: 959,
                price: 1598,
                title: "Royal / XL",
                grams: 160,
                options: [
                    425,
                    17
                ],
            },
            {
                id: 38205,
                cost: 959,
                price: 1598,
                title: "White / XL",
                grams: 160,
                options: [
                    521,
                    17
                ],
            },
            {
                id: 38204,
                cost: 959,
                price: 1598,
                title: "Sport Grey / XL",
                grams: 160,
                options: [
                    358,
                    17
                ],
            },
            {
                id: 38220,
                cost: 1096,
                price: 1827,
                title: "Black / 2XL",
                grams: 180,
                options: [
                    418,
                    18
                ],
            },
            {
                id: 38222,
                cost: 1096,
                price: 1827,
                title: "Military Green / 2XL",
                grams: 180,
                options: [
                    364,
                    18
                ],
            },
            {
                id: 38209,
                cost: 1096,
                price: 1827,
                title: "Charcoal / 2XL",
                grams: 180,
                options: [
                    424,
                    18
                ],
            },
            {
                id: 38211,
                cost: 1096,
                price: 1827,
                title: "Dark Chocolate / 2XL",
                grams: 180,
                options: [
                    362,
                    18
                ],
            },
            {
                id: 38212,
                cost: 1096,
                price: 1827,
                title: "Irish Green / 2XL",
                grams: 180,
                options: [
                    369,
                    18
                ],
            },
            {
                id: 38213,
                cost: 1096,
                price: 1827,
                title: "Light Blue / 2XL",
                grams: 180,
                options: [
                    392,
                    18
                ],
            },
            {
                id: 38214,
                cost: 1096,
                price: 1827,
                title: "Navy / 2XL",
                grams: 180,
                options: [
                    511,
                    18
                ],
            },
            {
                id: 38216,
                cost: 1096,
                price: 1827,
                title: "Red / 2XL",
                grams: 180,
                options: [
                    423,
                    18
                ],
            },
            {
                id: 38217,
                cost: 1096,
                price: 1827,
                title: "Royal / 2XL",
                grams: 180,
                options: [
                    425,
                    18
                ],
            },
            {
                id: 38219,
                cost: 1096,
                price: 1827,
                title: "White / 2XL",
                grams: 180,
                options: [
                    521,
                    18
                ],
            },
            {
                id: 38218,
                cost: 1096,
                price: 1827,
                title: "Sport Grey / 2XL",
                grams: 180,
                options: [
                    358,
                    18
                ],
            },
        ],
    },
    {
        id: 'hoodies',
        title: 'Hoodies',
        providers: [
            {
                id: 29,
                title: 'Monster Digital',
            },
            {
                id: 26,
                title: 'Textildruck Europa',
            },
            {
                id: 72,
                title: 'Print Clever',
            }
        ],
        colors: [
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
        ],
        sizes: [
            { id: 14, title: 'S' },
            { id: 15, title: 'M' },
            { id: 16, title: 'L' },
            { id: 17, title: 'XL' },
            { id: 18, title: '2XL' },
        ],
        variants: [
            {
                id: 42211,
                cost: 2187,
                price: 3645,
                title: "Charcoal / S",
                grams: 482,
                options: [
                    424,
                    14
                ],
            },
            {
                id: 42212,
                cost: 2187,
                price: 3645,
                title: "Charcoal / M",
                grams: 485,
                options: [
                    424,
                    15
                ],
            },
            {
                id: 42213,
                cost: 2187,
                price: 3645,
                title: "Charcoal / L",
                grams: 541,
                options: [
                    424,
                    16
                ],
            },
            {
                id: 42214,
                cost: 2187,
                price: 3645,
                title: "Charcoal / XL",
                grams: 587,
                options: [
                    424,
                    17
                ],
            },
            {
                id: 42215,
                cost: 2396,
                price: 3993,
                title: "Charcoal / 2XL",
                grams: 644,
                options: [
                    424,
                    18
                ],
            },
            {
                id: 42216,
                cost: 2515,
                price: 4192,
                title: "Charcoal / 3XL",
                grams: 683,
                options: [
                    424,
                    19
                ],
            },
            {
                id: 42217,
                cost: 2575,
                price: 4292,
                title: "Charcoal / 4XL",
                grams: 729,
                options: [
                    424,
                    20
                ],
            },
            {
                id: 42218,
                cost: 2575,
                price: 4292,
                title: "Charcoal / 5XL",
                grams: 729,
                options: [
                    424,
                    21
                ],
            },
            {
                id: 66363,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / S",
                grams: 482,
                options: [
                    550,
                    14
                ],
            },
            {
                id: 66364,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / M",
                grams: 485,
                options: [
                    550,
                    15
                ],
            },
            {
                id: 66365,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / L",
                grams: 541,
                options: [
                    550,
                    16
                ],
            },
            {
                id: 66366,
                cost: 2187,
                price: 3645,
                title: "Heather Navy / XL",
                grams: 587,
                options: [
                    550,
                    17
                ],
            },
            {
                id: 66367,
                cost: 2396,
                price: 3993,
                title: "Heather Navy / 2XL",
                grams: 644,
                options: [
                    550,
                    18
                ],
            },
            {
                id: 66368,
                cost: 2515,
                price: 4192,
                title: "Heather Navy / 3XL",
                grams: 683,
                options: [
                    550,
                    19
                ],
            },
            {
                id: 66369,
                cost: 2575,
                price: 4292,
                title: "Heather Navy / 4XL",
                grams: 729,
                options: [
                    550,
                    20
                ],
            },
            {
                id: 66370,
                cost: 2575,
                price: 4292,
                title: "Heather Navy / 5XL",
                grams: 729,
                options: [
                    550,
                    21
                ],
            },
            {
                id: 42235,
                cost: 2187,
                price: 3645,
                title: "Light Blue / S",
                grams: 482,
                options: [
                    392,
                    14
                ],
            },
            {
                id: 42236,
                cost: 2187,
                price: 3645,
                title: "Light Blue / M",
                grams: 485,
                options: [
                    392,
                    15
                ],
            },
            {
                id: 42237,
                cost: 2187,
                price: 3645,
                title: "Light Blue / L",
                grams: 541,
                options: [
                    392,
                    16
                ],
            },
            {
                id: 42238,
                cost: 2187,
                price: 3645,
                title: "Light Blue / XL",
                grams: 587,
                options: [
                    392,
                    17
                ],
            },
            {
                id: 42239,
                cost: 2396,
                price: 3993,
                title: "Light Blue / 2XL",
                grams: 644,
                options: [
                    392,
                    18
                ],
            },
            {
                id: 42240,
                cost: 2515,
                price: 4192,
                title: "Light Blue / 3XL",
                grams: 683,
                options: [
                    392,
                    19
                ],
            },
            {
                id: 42241,
                cost: 2575,
                price: 4292,
                title: "Light Blue / 4XL",
                grams: 729,
                options: [
                    392,
                    20
                ],
            },
            {
                id: 42242,
                cost: 2575,
                price: 4292,
                title: "Light Blue / 5XL",
                grams: 729,
                options: [
                    392,
                    21
                ],
            },
            {
                id: 32918,
                cost: 2187,
                price: 3645,
                title: "Black / S",
                grams: 482,
                options: [
                    418,
                    14
                ],
            },
            {
                id: 33425,
                cost: 2187,
                price: 3645,
                title: "Military Green / S",
                grams: 482,
                options: [
                    364,
                    14
                ],
            },
            {
                id: 32878,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / S",
                grams: 482,
                options: [
                    367,
                    14
                ],
            },
            {
                id: 33369,
                cost: 2187,
                price: 3645,
                title: "Irish Green / S",
                grams: 482,
                options: [
                    369,
                    14
                ],
            },
            {
                id: 32886,
                cost: 2187,
                price: 3645,
                title: "Maroon / S",
                grams: 482,
                options: [
                    395,
                    14
                ],
            },
            {
                id: 32894,
                cost: 2187,
                price: 3645,
                title: "Navy / S",
                grams: 482,
                options: [
                    511,
                    14
                ],
            },
            {
                id: 33385,
                cost: 2187,
                price: 3645,
                title: "Red / S",
                grams: 482,
                options: [
                    423,
                    14
                ],
            },
            {
                id: 33393,
                cost: 2187,
                price: 3645,
                title: "Royal / S",
                grams: 482,
                options: [
                    425,
                    14
                ],
            },
            {
                id: 32910,
                cost: 2187,
                price: 3645,
                title: "White / S",
                grams: 482,
                options: [
                    521,
                    14
                ],
            },
            {
                id: 32902,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / S",
                grams: 482,
                options: [
                    358,
                    14
                ],
            },
            {
                id: 32919,
                cost: 2187,
                price: 3645,
                title: "Black / M",
                grams: 485,
                options: [
                    418,
                    15
                ],
            },
            {
                id: 33426,
                cost: 2187,
                price: 3645,
                title: "Military Green / M",
                grams: 485,
                options: [
                    364,
                    15
                ],
            },
            {
                id: 32879,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / M",
                grams: 485,
                options: [
                    367,
                    15
                ],
            },
            {
                id: 33370,
                cost: 2187,
                price: 3645,
                title: "Irish Green / M",
                grams: 485,
                options: [
                    369,
                    15
                ],
            },
            {
                id: 32887,
                cost: 2187,
                price: 3645,
                title: "Maroon / M",
                grams: 485,
                options: [
                    395,
                    15
                ],
            },
            {
                id: 32895,
                cost: 2187,
                price: 3645,
                title: "Navy / M",
                grams: 485,
                options: [
                    511,
                    15
                ],
            },
            {
                id: 33386,
                cost: 2187,
                price: 3645,
                title: "Red / M",
                grams: 485,
                options: [
                    423,
                    15
                ],
            },
            {
                id: 33394,
                cost: 2187,
                price: 3645,
                title: "Royal / M",
                grams: 485,
                options: [
                    425,
                    15
                ],
            },
            {
                id: 32911,
                cost: 2187,
                price: 3645,
                title: "White / M",
                grams: 485,
                options: [
                    521,
                    15
                ],
            },
            {
                id: 32903,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / M",
                grams: 485,
                options: [
                    358,
                    15
                ],
            },
            {
                id: 32920,
                cost: 2187,
                price: 3645,
                title: "Black / L",
                grams: 541,
                options: [
                    418,
                    16
                ],
            },
            {
                id: 33427,
                cost: 2187,
                price: 3645,
                title: "Military Green / L",
                grams: 541,
                options: [
                    364,
                    16
                ],
            },
            {
                id: 32880,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / L",
                grams: 541,
                options: [
                    367,
                    16
                ],
            },
            {
                id: 33371,
                cost: 2187,
                price: 3645,
                title: "Irish Green / L",
                grams: 541,
                options: [
                    369,
                    16
                ],
            },
            {
                id: 32888,
                cost: 2187,
                price: 3645,
                title: "Maroon / L",
                grams: 541,
                options: [
                    395,
                    16
                ],
            },
            {
                id: 32896,
                cost: 2187,
                price: 3645,
                title: "Navy / L",
                grams: 541,
                options: [
                    511,
                    16
                ],
            },
            {
                id: 33387,
                cost: 2187,
                price: 3645,
                title: "Red / L",
                grams: 541,
                options: [
                    423,
                    16
                ],
            },
            {
                id: 33395,
                cost: 2187,
                price: 3645,
                title: "Royal / L",
                grams: 541,
                options: [
                    425,
                    16
                ],
            },
            {
                id: 32912,
                cost: 2187,
                price: 3645,
                title: "White / L",
                grams: 541,
                options: [
                    521,
                    16
                ],
            },
            {
                id: 32904,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / L",
                grams: 541,
                options: [
                    358,
                    16
                ],
            },
            {
                id: 32921,
                cost: 2187,
                price: 3645,
                title: "Black / XL",
                grams: 587,
                options: [
                    418,
                    17
                ],
            },
            {
                id: 33428,
                cost: 2187,
                price: 3645,
                title: "Military Green / XL",
                grams: 587,
                options: [
                    364,
                    17
                ],
            },
            {
                id: 32881,
                cost: 2187,
                price: 3645,
                title: "Dark Heather / XL",
                grams: 587,
                options: [
                    367,
                    17
                ],
            },
            {
                id: 33372,
                cost: 2187,
                price: 3645,
                title: "Irish Green / XL",
                grams: 587,
                options: [
                    369,
                    17
                ],
            },
            {
                id: 32889,
                cost: 2187,
                price: 3645,
                title: "Maroon / XL",
                grams: 587,
                options: [
                    395,
                    17
                ],
            },
            {
                id: 32897,
                cost: 2187,
                price: 3645,
                title: "Navy / XL",
                grams: 587,
                options: [
                    511,
                    17
                ],
            },
            {
                id: 33388,
                cost: 2187,
                price: 3645,
                title: "Red / XL",
                grams: 587,
                options: [
                    423,
                    17
                ],
            },
            {
                id: 33396,
                cost: 2187,
                price: 3645,
                title: "Royal / XL",
                grams: 587,
                options: [
                    425,
                    17
                ],
            },
            {
                id: 32913,
                cost: 2187,
                price: 3645,
                title: "White / XL",
                grams: 587,
                options: [
                    521,
                    17
                ],
            },
            {
                id: 32905,
                cost: 2187,
                price: 3645,
                title: "Sport Grey / XL",
                grams: 587,
                options: [
                    358,
                    17
                ],
            },
            {
                id: 32922,
                cost: 2396,
                price: 3993,
                title: "Black / 2XL",
                grams: 644,
                options: [
                    418,
                    18
                ],
            },
            {
                id: 33429,
                cost: 2396,
                price: 3993,
                title: "Military Green / 2XL",
                grams: 644,
                options: [
                    364,
                    18
                ],
            },
            {
                id: 32882,
                cost: 2396,
                price: 3993,
                title: "Dark Heather / 2XL",
                grams: 644,
                options: [
                    367,
                    18
                ],
            },
            {
                id: 33373,
                cost: 2396,
                price: 3993,
                title: "Irish Green / 2XL",
                grams: 644,
                options: [
                    369,
                    18
                ],
            },
            {
                id: 32890,
                cost: 2396,
                price: 3993,
                title: "Maroon / 2XL",
                grams: 644,
                options: [
                    395,
                    18
                ],
            },
            {
                id: 32898,
                cost: 2396,
                price: 3993,
                title: "Navy / 2XL",
                grams: 644,
                options: [
                    511,
                    18
                ],
            },
            {
                id: 33389,
                cost: 2396,
                price: 3993,
                title: "Red / 2XL",
                grams: 644,
                options: [
                    423,
                    18
                ],
            },
            {
                id: 33397,
                cost: 2396,
                price: 3993,
                title: "Royal / 2XL",
                grams: 644,
                options: [
                    425,
                    18
                ],
            },
            {
                id: 32914,
                cost: 2396,
                price: 3993,
                title: "White / 2XL",
                grams: 644,
                options: [
                    521,
                    18
                ],
            },
            {
                id: 32906,
                cost: 2396,
                price: 3993,
                title: "Sport Grey / 2XL",
                grams: 644,
                options: [
                    358,
                    18
                ],
            },
            {
                id: 32923,
                cost: 2515,
                price: 4192,
                title: "Black / 3XL",
                grams: 683,
                options: [
                    418,
                    19
                ],
            },
            {
                id: 33430,
                cost: 2515,
                price: 4192,
                title: "Military Green / 3XL",
                grams: 683,
                options: [
                    364,
                    19
                ],
            },
            {
                id: 32883,
                cost: 2515,
                price: 4192,
                title: "Dark Heather / 3XL",
                grams: 683,
                options: [
                    367,
                    19
                ],
            },
            {
                id: 33374,
                cost: 2515,
                price: 4192,
                title: "Irish Green / 3XL",
                grams: 683,
                options: [
                    369,
                    19
                ],
            },
            {
                id: 32891,
                cost: 2515,
                price: 4192,
                title: "Maroon / 3XL",
                grams: 683,
                options: [
                    395,
                    19
                ],
            },
            {
                id: 32899,
                cost: 2515,
                price: 4192,
                title: "Navy / 3XL",
                grams: 683,
                options: [
                    511,
                    19
                ],
            },
            {
                id: 33390,
                cost: 2515,
                price: 4192,
                title: "Red / 3XL",
                grams: 683,
                options: [
                    423,
                    19
                ],
            },
            {
                id: 33398,
                cost: 2515,
                price: 4192,
                title: "Royal / 3XL",
                grams: 683,
                options: [
                    425,
                    19
                ],
            },
            {
                id: 32915,
                cost: 2515,
                price: 4192,
                title: "White / 3XL",
                grams: 683,
                options: [
                    521,
                    19
                ],
            },
            {
                id: 32907,
                cost: 2515,
                price: 4192,
                title: "Sport Grey / 3XL",
                grams: 683,
                options: [
                    358,
                    19
                ],
            },
            {
                id: 32924,
                cost: 2575,
                price: 4292,
                title: "Black / 4XL",
                grams: 729,
                options: [
                    418,
                    20
                ],
            },
            {
                id: 33431,
                cost: 2575,
                price: 4292,
                title: "Military Green / 4XL",
                grams: 729,
                options: [
                    364,
                    20
                ],
            },
            {
                id: 32884,
                cost: 2575,
                price: 4292,
                title: "Dark Heather / 4XL",
                grams: 729,
                options: [
                    367,
                    20
                ],
            },
            {
                id: 33375,
                cost: 2575,
                price: 4292,
                title: "Irish Green / 4XL",
                grams: 729,
                options: [
                    369,
                    20
                ],
            },
            {
                id: 32892,
                cost: 2575,
                price: 4292,
                title: "Maroon / 4XL",
                grams: 729,
                options: [
                    395,
                    20
                ],
            },
            {
                id: 32900,
                cost: 2575,
                price: 4292,
                title: "Navy / 4XL",
                grams: 729,
                options: [
                    511,
                    20
                ],
            },
            {
                id: 33391,
                cost: 2575,
                price: 4292,
                title: "Red / 4XL",
                grams: 729,
                options: [
                    423,
                    20
                ],
            },
            {
                id: 33399,
                cost: 2575,
                price: 4292,
                title: "Royal / 4XL",
                grams: 729,
                options: [
                    425,
                    20
                ],
            },
            {
                id: 32916,
                cost: 2575,
                price: 4292,
                title: "White / 4XL",
                grams: 729,
                options: [
                    521,
                    20
                ],
            },
            {
                id: 32908,
                cost: 2575,
                price: 4292,
                title: "Sport Grey / 4XL",
                grams: 729,
                options: [
                    358,
                    20
                ],
            },
            {
                id: 32925,
                cost: 2575,
                price: 4292,
                title: "Black / 5XL",
                grams: 729,
                options: [
                    418,
                    21
                ],
            },
            {
                id: 33432,
                cost: 2575,
                price: 4292,
                title: "Military Green / 5XL",
                grams: 729,
                options: [
                    364,
                    21
                ],
            },
            {
                id: 32885,
                cost: 2575,
                price: 4292,
                title: "Dark Heather / 5XL",
                grams: 729,
                options: [
                    367,
                    21
                ],
            },
            {
                id: 33376,
                cost: 2575,
                price: 4292,
                title: "Irish Green / 5XL",
                grams: 729,
                options: [
                    369,
                    21
                ],
            },
            {
                id: 32893,
                cost: 2575,
                price: 4292,
                title: "Maroon / 5XL",
                grams: 729,
                options: [
                    395,
                    21
                ],
            },
            {
                id: 32901,
                cost: 2575,
                price: 4292,
                title: "Navy / 5XL",
                grams: 729,
                options: [
                    511,
                    21
                ],
            },
            {
                id: 33392,
                cost: 2575,
                price: 4292,
                title: "Red / 5XL",
                grams: 729,
                options: [
                    423,
                    21
                ],
            },
            {
                id: 33400,
                cost: 2575,
                price: 4292,
                title: "Royal / 5XL",
                grams: 729,
                options: [
                    425,
                    21
                ],
            },
            {
                id: 32917,
                cost: 2575,
                price: 4292,
                title: "White / 5XL",
                grams: 729,
                options: [
                    521,
                    21
                ],
            },
            {
                id: 32909,
                cost: 2575,
                price: 4292,
                title: "Sport Grey / 5XL",
                grams: 729,
                options: [
                    358,
                    21
                ],
            }
        ],
    },
    {
        id: 'socks',
        title: 'Socks',
        providers: [],
    },
    {
        id: 'pillows',
        title: 'Pillows',
        providers: [],
    },
]

export const EU_COUNTRIES = ['DE', 'BV', 'GE', 'SM', 'GI', 'GG', 'AT', 'HU', 'MD', 'HR', 'BE', 'IM', 'GR', 'IT', 'BY', 'GL', 'GP', 'LU', 'VA', 'JE', 'SK', 'BG', 'MK', 'PT', 'RE', 'FR', 'RO', 'TR', 'SI', 'XK', 'CZ', 'RS', 'ES', 'MC', 'ME', 'UA', 'AL', 'AM', 'CY', 'AX', 'AD', 'FO', 'BA', 'NL', 'MT']

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
                'mugs_white': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 849,
                    add_item: 209,
                    currency: 'usd'
                },
                'mugs_color': {
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
        case 'AU':
            return {
                't-shirts': {
                    provider: {
                        id: 29,
                        title: 'Monster Digital',
                    },
                    first_item: 1249,
                    add_item: 499,
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