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
    const [allProducts, setAllProducts] = useState([])

    const ITEMS_TOTAL = (cart?.reduce((acc, product) => acc + (convertDolarToCurrency(product.price, userCurrency.code) * product.quantity), 0) / 100).toFixed(2)

    const SHIPPING_CONVERTED = convertDolarToCurrency(shippingValue, userCurrency.code)

    const ORDER_TOTAL = ((SHIPPING_CONVERTED + cart?.reduce((acc, product) => acc + (convertDolarToCurrency(product.price, userCurrency.code) * product.quantity), 0)) / 100).toFixed(2)

    function handleCheckout(cart) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartItems: cart.map(item => (
                    {
                        ...item,
                        id_printify: item.printify_ids[getShippingOptions(shippingCountry)[item.type].provider.id]
                            ? item.printify_ids[getShippingOptions(shippingCountry)[item.type].provider.id]
                            : item.printify_id_default,
                        price: convertDolarToCurrency(item.price, userCurrency.code),
                    }
                )),
                cancel_url: window.location.href,
                success_url: window.location.href,
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
            method: 'GET'
        }

        const products = await fetch("/api/products", options)
            .then(response => response.json())
            .then(response => response.products)
            .catch(err => console.error(err))

        setAllProducts(products)
    }

    useEffect(() => {
        getShippingValue()
    }, [cart, shippingCountry])

    useEffect(() => {
        getAllProducts()
    }, [])

    function getShippingValue() {
        const country = getShippingOptions(shippingCountry)
        let value = 0
        let typesAlreadyIn = []

        value = cart?.reduce((acc, item, i) => {
            const result = acc + (
                typesAlreadyIn.includes(item.type)
                    ? country[item.type].add_item * item.quantity
                    : country[item.type].first_item + country[item.type].add_item * (item.quantity - 1)
            )
            typesAlreadyIn.push(item.type)
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
                : cart.length === 0
                    ? <main
                        className={`${styles.main} ${styles.mainEmpty}`}
                    >
                        <div className={styles.emptyTitle}>
                            <h2><b>Hmmmm....</b> it looks like your cart is empty.</h2>
                            <h2>Explore some of our <b>best products!</b></h2>
                        </div>
                        <CarouselProducts
                            products={allProducts}
                            userCurrency={userCurrency}
                            supportsHoverAndPointer={supportsHoverAndPointer}
                            windowWidth={windowWidth}
                        />
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
                                {cart.map((product, i) =>
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
                                            { value: 'UK', name: 'United Kingdom' },
                                            { value: 'US', name: 'United States' },
                                            { value: 'PT', name: 'Portugal' },
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
                                    onClick={() => handleCheckout(cart)}
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
