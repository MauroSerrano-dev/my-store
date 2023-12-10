import ProductCart from '@/components/products/ProductCart'
import styles from '@/styles/pages/cart.module.css'
import { CART_COOKIE, COLORS_POOL, COMMON_TRANSLATES, DEFAULT_LANGUAGE, LIMITS, SIZES_POOL, getShippingOptions } from '@/consts'
import COUNTRIES_POOL from '../../public/locales/en/countries.json'
import { useEffect, useState } from 'react'
import Selector from '@/components/material-ui/Selector'
import Cookies from 'js-cookie'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '@/utils/toasts'
import SelectorAutocomplete from '@/components/material-ui/SelectorAutocomplete'
import { cartItemModel } from '@/utils/models'
import { LoadingButton } from '@mui/lab'
import { useAppContext } from '@/components/contexts/AppContext'
import { getProductPriceUnit } from '@/utils/prices'
import ZoneConverter from '@/utils/country-zone.json'

export default function Cart() {

    const {
        getInicialCart,
        session,
        setLoading,
        handleChangeCurrency,
        userCurrency,
        cart,
        currencies,
        setBlockInteractions,
        userLocation,
        setUserLocation,
    } = useAppContext()

    const [disableCheckoutButton, setDisableCheckoutButton] = useState(false)
    const [shippingValue, setShippingValue] = useState(0)
    const [allProducts, setAllProducts] = useState()
    const [outOfStock, setOutOfStock] = useState([])

    const SHIPPING_CONVERTED = Math.round(shippingValue * userCurrency?.rate)

    const ITEMS_TOTAL = cart?.products.reduce((acc, product) => acc + ((getProductPriceUnit(product, product.variant, userCurrency?.rate) * product.quantity)), 0)

    const ORDER_TOTAL = SHIPPING_CONVERTED + ITEMS_TOTAL

    const { i18n } = useTranslation()

    const tCommon = useTranslation('common').t
    const tColors = useTranslation('colors').t
    const tCart = useTranslation('cart').t
    const tCountries = useTranslation('countries').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        getShippingValue()
    }, [cart])

    useEffect(() => {
        getAllProducts()
        getInicialCart()
    }, [])

    function handleCheckout() {
        if (process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true') {
            showToast({ msg: 'Checkout temporarily disabled' })
            return
        }
        if (cart.products.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items) {
            showToast({ msg: 'Cart contains more products than the allowed limit' })
            return
        }
        setBlockInteractions(true)
        setLoading(true)
        setDisableCheckoutButton(true)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                cartItems: cart.products.map(prod => {
                    const shippingOption = getShippingOptions(prod.type_id, userLocation.country)
                    return cartItemModel({
                        id: prod.id,
                        quantity: prod.quantity,
                        title: prod.title,
                        image: prod.image,
                        blueprint_ids: prod.blueprint_ids,
                        description: `${tCommon(prod.type_id)} ${tColors(COLORS_POOL[prod.variant.color_id].id_string)} / ${tCommon(SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title)}`,
                        id_printify: prod.printify_ids[shippingOption.provider_id],
                        provider_id: shippingOption.provider_id,
                        variant: prod.variant,
                        variant_id_printify: typeof prod.variant.id_printify === 'number' ? prod.variant.id_printify : prod.variant.id_printify[shippingOption.provider_id],
                        price: Math.round(prod.variant.price * userCurrency?.rate),
                    })
                }),
                cancel_url: window.location.href,
                success_url: session ? `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/orders` : `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}`,
                customer: session,
                shippingValue: SHIPPING_CONVERTED,
                shippingCountry: userLocation.country,
                currency: userCurrency?.code,
                cart_id: session ? session.cart_id : Cookies.get(CART_COOKIE),
                user_language: i18n.language,
            })
        }

        fetch('/api/stripe', options)
            .then(response => response.json())
            .then(response => {
                if (response.outOfStock) {
                    setBlockInteractions(false)
                    setLoading(false)
                    setDisableCheckoutButton(false)
                    setOutOfStock(response.outOfStock)
                    showToast({
                        msg: tToasts(
                            'out_of_stock',
                            {
                                count: response.outOfStock.length,
                                country: tCountries(userLocation.country),
                                product_title: response.outOfStock[0].title,
                                variant_title: response.outOfStock[0].variant.title,
                            }
                        ),
                        type: 'error'
                    })
                }
                else
                    window.location.href = response.url
            })
            .catch(err => {
                setBlockInteractions(false)
                setLoading(false)
                setDisableCheckoutButton(false)
                console.error(err)
            })
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
            const values = getShippingOptions(item.type_id, userLocation.country)
            const result = acc + (
                typesAlreadyIn.includes(item.type_id)
                    ? (values.add_item * item.quantity) + values.tax
                    : (values.first_item + values.add_item * (item.quantity - 1)) + values.tax
            )
            typesAlreadyIn.push(item.type_id)
            return result
        }
            , 0
        )
        setShippingValue(value)
    }

    function handleChangeCountrySelector(event, value) {
        if (value?.id)
            setUserLocation({ country: value.id, zone: ZoneConverter[value.id] })
    }

    return (
        <div className={styles.container}>
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
                                        outOfStock={outOfStock.some(prodOut => prodOut.id === product.id && prodOut.variant.id === product.variant.id)}
                                        product={product}
                                        key={i}
                                        index={i}
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
                                    <SelectorAutocomplete
                                        options={
                                            Object.keys(COUNTRIES_POOL)
                                                .map(key => ({ id: key, label: tCountries(key) }))
                                                .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }))
                                        }
                                        label={tCommon('Country')}
                                        value={{ id: userLocation.country, label: tCountries(userLocation.country) }}
                                        onChange={handleChangeCountrySelector}
                                        dark
                                        className={styles.countryInput}
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
                                <LoadingButton
                                    loading={disableCheckoutButton}
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
                                </LoadingButton>
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

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['cart', 'countries'])),
        }
    }
}