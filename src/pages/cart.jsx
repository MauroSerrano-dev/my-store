import ProductCart from '@/components/products/ProductCart'
import styles from '@/styles/pages/cart.module.css'
import { Button } from '@mui/material'
import { CART_COOKIE, COUNTRIES_POOL, getShippingOptions } from '../../consts'
import { useEffect, useState } from 'react'
import Selector from '@/components/material-ui/Selector'
import Cookies from 'js-cookie'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '../../utils/toasts'
import SelectorAutocomplete from '@/components/material-ui/SelectorAutocomplete'
import axios from 'axios'

export default function Cart(props) {
    const {
        session,
        cart,
        setCart,
        userCurrency,
        handleChangeCurrency,
        supportsHoverAndPointer,
        windowWidth,
        setLoading,
        getInicialCart,
        currencies,
        location,
    } = props

    const [shippingValue, setShippingValue] = useState(0)
    const [shippingCountry, setShippingCountry] = useState(location?.country || 'US')
    const [allProducts, setAllProducts] = useState()

    const SHIPPING_CONVERTED = Math.ceil(shippingValue * userCurrency?.rate)

    const ITEMS_TOTAL = cart?.products.reduce((acc, product) => acc + ((Math.ceil(product.variant.price * userCurrency?.rate) * product.quantity)), 0)

    const ORDER_TOTAL = SHIPPING_CONVERTED + ITEMS_TOTAL

    const tCommon = useTranslation('common').t
    const tCart = useTranslation('cart').t
    const tCountries = useTranslation('countries').t

    useEffect(() => {
        getShippingValue()
    }, [cart, shippingCountry])

    useEffect(() => {
        getAllProducts()
        getInicialCart()
    }, [])

    function handleCheckout() {
        if (process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true') {
            showToast({ msg: 'Checkout temporarily disabled' })
            return
        }
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
                        variant_id: prod.variant.id,
                        variant_id_printify: typeof prod.variant.id_printify === 'number' ? prod.variant.id_printify : prod.variant.id_printify[providerId],
                        price: Math.ceil(prod.variant.price * userCurrency?.rate),
                    }
                }),
                cancel_url: window.location.href,
                success_url: session ? `${window.location.origin}/orders` : window.location.origin,
                customer: session,
                shippingValue: SHIPPING_CONVERTED,
                shippingCountry: shippingCountry,
                currency: userCurrency?.code,
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

    function handleChangeCountrySelector(event, value) {
        setShippingCountry(value)
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
                                <h1>{tCart('my_cart')}</h1>
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
                                        setLoading={setLoading}
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
                                    {tCart('order_details')}
                                </h3>
                            </div>
                            <div
                                className={styles.detailsBody}
                            >
                                <div className={styles.detailsItem}>
                                    <p>
                                        {tCart('ship_to')}:
                                    </p>
                                    {/* <Selector
                                        label={tCommon('Country')}
                                        value={shippingCountry}
                                        options={COUNTRIES_POOL}
                                        width='170px'
                                        dark
                                        onChange={handleChangeCountrySelector}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    /> */}
                                    <SelectorAutocomplete
                                        multiple={false}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        options={COUNTRIES_POOL.map(country => tCountries(country))}
                                        label={tCommon('Country')}
                                        value={tCountries(shippingCountry)}
                                        onChange={handleChangeCountrySelector}
                                        dark
                                        style={{
                                            width: 200,
                                        }}
                                    />
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        {tCommon('Currency')}:
                                    </p>
                                    <Selector
                                        label={tCommon('Currency')}
                                        value={userCurrency.code}
                                        options={Object.values(currencies).map(currency => ({ value: currency.code, name: currency.code.toUpperCase() }))}
                                        width='100px'
                                        dark
                                        onChange={(event) => handleChangeCurrency(event.target.value)}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        {tCart('items_total')}:
                                    </p>
                                    <p>
                                        {`${userCurrency?.symbol} ${(ITEMS_TOTAL / 100).toFixed(2)}`}
                                    </p>
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        {tCart('shipping_and_taxes')}:
                                    </p>
                                    <p>
                                        {`${userCurrency?.symbol} ${(SHIPPING_CONVERTED / 100).toFixed(2)}`}
                                    </p>
                                </div>
                                <div className={styles.orderTotalContainer}>
                                    <div className={styles.detailsItem}>
                                        <p>
                                            {tCart('order_total')}:
                                        </p>
                                        <p
                                            style={{
                                                fontWeight: '700'
                                            }}
                                        >
                                            {`${userCurrency?.symbol} ${(ORDER_TOTAL / 100).toFixed(2)}`}
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
                                    onClick={handleCheckout}
                                    sx={{
                                        width: '100%',
                                        color: 'white',
                                        fontWeight: '700',
                                    }}
                                >
                                    Checkout
                                </Button>
                                <p className={styles.securedText}>
                                    {tCart('Transaction secured by')} <a href='https://stripe.com' target='_blank'>Stripe</a>
                                </p>
                            </div>
                        </div>
                    </main>
            }
        </div>
    )
}

export async function getServerSideProps({ locale, req }) {

    const translate = await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'cart', 'countries'])

    try {
        const ipAddress = req.headers["x-forwarded-for"]
            ? req.headers["x-forwarded-for"].split(',')[0]
            : req.connection.remoteAddress

        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${process.env.IP_INFO_TOKEN}`)

        console.log(response)

        return {
            props: {
                location: response.data.country ? response.data : null,
                ...translate,
            }
        }
    } catch (error) {
        console.error('Error getting location information:', error)
        return {
            props: {
                country: null,
                ...translate
            },
        }
    }
}