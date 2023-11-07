import ProductCart from '@/components/products/ProductCart'
import styles from '@/styles/pages/cart.module.css'
import { Button } from '@mui/material'
import { CART_COOKIE, convertDolarToCurrency, getCurrencyByCode, getShippingOptions } from '../../consts'
import { useEffect, useState } from 'react'
import Selector from '@/components/material-ui/Selector'
import Cookies from 'js-cookie'
import CarouselProducts from '@/components/carousels/CarouselProducts'

export default function Cart(props) {
    const {
        session,
        cart,
        setCart,
        userCurrency,
        handleChangeCurrency,
        supportsHoverAndPointer,
        windowWidth,
    } = props

    const [shippingValue, setShippingValue] = useState(0)
    const [shippingCountry, setShippingCountry] = useState('US')
    const [allProducts, setAllProducts] = useState()

    const ITEMS_TOTAL = (cart?.products.reduce((acc, product) => acc + (convertDolarToCurrency(product.variant.price, userCurrency.code) * product.quantity), 0) / 100).toFixed(2)

    const SHIPPING_CONVERTED = convertDolarToCurrency(shippingValue, userCurrency.code)

    const ORDER_TOTAL = ((SHIPPING_CONVERTED + cart?.products.reduce((acc, product) => acc + (convertDolarToCurrency(product.variant.price, userCurrency.code) * product.quantity), 0)) / 100).toFixed(2)

    useEffect(() => {
        getShippingValue()
    }, [cart, shippingCountry])

    useEffect(() => {
        getAllProducts()
    }, [])

    function handleCheckout() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                cartItems: cart.products.map(prod => {
                    const providerId = getShippingOptions(prod.type_id, shippingCountry).provider_id
                    return {
                        ...prod,
                        id_printify: prod.printify_ids[providerId],
                        variant_id: prod.variant_id,
                        variant_id_printify: typeof prod.variant.id_printify === 'number' ? prod.variant.id_printify : prod.variant.id_printify[providerId],
                        price: convertDolarToCurrency(prod.variant.price, userCurrency.code),
                    }
                }),
                cancel_url: window.location.href,
                success_url: session ? `${process.env.NEXT_PUBLIC_URL}/orders` : process.env.NEXT_PUBLIC_URL,
                customer: session,
                shippingValue: convertDolarToCurrency(shippingValue, userCurrency.code),
                shippingCountry: shippingCountry,
                currency: userCurrency.code,
                cart_id: session ? session.cart_id : Cookies.get(CART_COOKIE),
            })
        }

        fetch('/api/stripe', options)
            .then(response => response.json())
            .then(response => window.location.href = response.url)
            .catch(err => console.error(err))
    }

    async function getAllProducts() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
        }

        const products = await fetch("/api/products/all-products", options)
            .then(response => response.json())
            .then(response => response.products)
            .catch(err => console.error(err))

        setAllProducts(products)
    }

    function getShippingValue() {
        let value = 0
        let typesAlreadyIn = []

        value = cart?.products.reduce((acc, item) => {
            const values = getShippingOptions(item.type_id, shippingCountry)
            const result = acc + (
                typesAlreadyIn.includes(item.type_id)
                    ? values.add_item * item.quantity
                    : values.first_item + values.add_item * (item.quantity - 1)
            )
            typesAlreadyIn.push(item.type_id)
            return result
        }
            , 0
        )

        setShippingValue(value)
    }

    function handleChangeCountrySelector(event) {
        setShippingCountry(event.target.value)
    }

    return (
        <div className={styles.container} >
            <header>
            </header>
            {!cart
                ? <div></div>
                : cart.products.length === 0
                    ? <main
                        className={`${styles.main} ${styles.mainEmpty}`}
                    >
                        <div className={styles.emptyTitle}>
                            <h2><b>Hmmmm....</b> it looks like your cart is empty.</h2>
                            <h2>Explore some of our <b>best products!</b></h2>
                        </div>
                        <div className='fillWidth'>
                            <CarouselProducts
                                products={allProducts}
                                userCurrency={userCurrency}
                                supportsHoverAndPointer={supportsHoverAndPointer}
                                windowWidth={windowWidth}
                            />
                        </div>
                    </main>
                    : <main className={styles.main}>
                        <div
                            className={styles.productsContainer}
                        >
                            <div
                                className={styles.productsHead}
                            >
                                <h1>Your Cart</h1>
                            </div>
                            <div
                                className={styles.productsBody}
                            >
                                {cart.products.map((product, i) =>
                                    <ProductCart
                                        session={session}
                                        setCart={setCart}
                                        product={product}
                                        key={i}
                                        index={i}
                                        userCurrency={userCurrency}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                )}
                            </div>
                        </div>
                        <div
                            className={styles.detailsContainer}
                        >
                            <div
                                className={styles.detailsHead}
                            >
                                <h3>
                                    Order details
                                </h3>
                            </div>
                            <div
                                className={styles.detailsBody}
                            >
                                <div className={styles.detailsItem}>
                                    <p>
                                        Ship To:
                                    </p>
                                    <Selector
                                        label='Country'
                                        value={shippingCountry}
                                        options={[
                                            { value: 'BR', name: 'Brazil' },
                                            { value: 'DE', name: 'Germany' },
                                            { value: 'PL', name: 'Poland' },
                                            { value: 'PT', name: 'Portugal' },
                                            { value: 'UK', name: 'United Kingdom' },
                                            { value: 'US', name: 'United States' },
                                        ]}
                                        width='170px'
                                        dark
                                        onChange={handleChangeCountrySelector}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        Currency:
                                    </p>
                                    <Selector
                                        label='currency'
                                        value={userCurrency.code}
                                        options={[
                                            { value: 'usd', name: 'USD' },
                                            { value: 'eur', name: 'EUR' },
                                            { value: 'gbp', name: 'GBP' },
                                            { value: 'brl', name: 'BRL' },
                                        ]}
                                        width='100px'
                                        dark
                                        onChange={(event) => handleChangeCurrency(getCurrencyByCode(event.target.value))}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        Items Total:
                                    </p>
                                    <p>
                                        {`${userCurrency.symbol} ${ITEMS_TOTAL}`}
                                    </p>
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        Shipping & Taxes:
                                    </p>
                                    <p>
                                        {`${userCurrency.symbol} ${(SHIPPING_CONVERTED / 100).toFixed(2)}`}
                                    </p>
                                </div>
                                <div className={styles.orderTotalContainer}>
                                    <div className={styles.detailsItem}>
                                        <p>
                                            Order Total:
                                        </p>
                                        <p
                                            style={{
                                                fontWeight: '700'
                                            }}
                                        >
                                            {`${userCurrency.symbol} ${ORDER_TOTAL}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.detailsBottom}
                            >
                                <Button
                                    variant='contained'
                                    size='large'
                                    onClick={() => handleCheckout()}
                                    sx={{
                                        width: '100%',
                                        color: 'white',
                                        fontWeight: '700',
                                    }}
                                >
                                    Checkout
                                </Button>
                                <p className={styles.securedText}>
                                    Transaction secured by <a href='https://stripe.com' target='_blank'>Stripe</a>
                                </p>
                            </div>
                        </div>
                    </main>
            }
        </div>
    )
}
