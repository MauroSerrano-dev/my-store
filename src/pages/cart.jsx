import ProductCart from '@/components/products/ProductCart'
import styles from '@/styles/pages/cart.module.css'
import { CART_COOKIE, COLORS_POOL, COMMON_TRANSLATES, DEFAULT_LANGUAGE, LIMITS, PRODUCTS_TYPES, SIZES_POOL, getShippingOptions } from '@/consts'
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
import { getAllProducts } from '../../frontend/product'

export default function Cart() {

    const {
        session,
        setLoading,
        handleChangeCurrency,
        userCurrency,
        cart,
        currencies,
        setBlockInteractions,
        userLocation,
        setUserLocation,
        getInicialCart,
    } = useAppContext()

    const [disableCheckoutButton, setDisableCheckoutButton] = useState(false)
    const [shippingValue, setShippingValue] = useState(0)
    const [productsOne, setProductsOne] = useState()
    const [productsTwo, setProductsTwo] = useState()
    const [outOfStock, setOutOfStock] = useState([])
    const [unavailables, setUnavailables] = useState([])
    const [inicialCartAlreadyCalled, setInicialCartAlreadyCalled] = useState(false)

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
        if (userLocation)
            getShippingValue()
    }, [cart, userLocation])

    useEffect(() => {
        if (!inicialCartAlreadyCalled) {
            getInicialCart()
            setInicialCartAlreadyCalled(true)
        }
        if (!cart || cart.products.length === 0)
            getProducts()
    }, [cart])

    function handleCheckout() {
        if (process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true') {
            showToast({ msg: 'checkout_temporarily_disabled' })
            return
        }
        if (cart.products.reduce((acc, prod) => acc + prod.quantity, 0) > LIMITS.cart_items) {
            showToast({ msg: 'cart_contains_more_than_limit' })
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
                        type_id: prod.type_id,
                        quantity: prod.quantity,
                        title: prod.title,
                        image: prod.image,
                        description: `${tCommon(prod.type_id)} ${tColors(COLORS_POOL[prod.variant.color_id].id_string)} / ${tCommon(SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title)}`,
                        id_printify: prod.printify_ids[shippingOption.provider_id],
                        provider_id: shippingOption.provider_id,
                        variant: {
                            ...prod.variant,
                            id_printify: typeof prod.variant.id_printify === 'number' ? prod.variant.id_printify : prod.variant.id_printify[shippingOption.provider_id]
                        },
                        price: getProductPriceUnit(prod, prod.variant, userCurrency?.rate),
                    })
                }),
                cancel_url: window.location.href,
                success_url: session
                    ? `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/orders`
                    : `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/?refresh-cart`,
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
                if (response.disabledProducts) {
                    setBlockInteractions(false)
                    setLoading(false)
                    setDisableCheckoutButton(false)
                    setUnavailables(response.disabledProducts)
                    showToast({
                        msg: tToasts(
                            'disabled_products',
                            {
                                count: response.disabledProducts.length,
                                product_title: response.disabledProducts[0].title,
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

    async function getProducts() {
        try {
            const response = await getAllProducts({
                prods_limit: 16,
            })

            if (response.products.length > 8) {
                setProductsOne(response.products.slice(0, Math.round(response.products.length / 2)))
                setProductsTwo(response.products.slice(Math.round(response.products.length / 2), response.products.length))
            }
            else {
                setProductsOne(response.products)
                setProductsTwo(null)
            }
        }
        catch (error) {
            showToast({ type: error?.props?.type || 'error', msg: tToasts(error?.props?.title || 'default_error') })
        }
    }

    function getShippingValue() {
        let value = 0
        let typesAlreadyIn = []

        value = cart?.products.reduce((acc, item) => {
            const values = getShippingOptions(item.type_id, userLocation.country)
            const result = acc + (
                typesAlreadyIn.includes(item.type_id)
                    ? ((values.add_item + values.add_tax) * item.quantity)
                    : ((values.first_item + values.tax) + ((values.add_item + values.add_tax) * (item.quantity - 1)))
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
                            <h2><b>{tCart('hmmm')}</b> {tCart('it_looks')}</h2>
                            <h2>{tCart('explore')} <b>{tCart('best_products')}</b></h2>
                        </div>
                        <div className='fillWidth'>
                            <div className='fillWidth'>
                                <CarouselProducts
                                    products={productsOne}
                                />
                            </div>
                            {productsTwo !== null &&
                                <div className='fillWidth'>
                                    <CarouselProducts
                                        products={productsTwo}
                                    />
                                </div>
                            }
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
                                        unavailable={unavailables.some(prodOut => prodOut.id === product.id && prodOut.variant.id === product.variant.id)}
                                        product={product}
                                        key={`${product.id}-${product.variant.id}-${product.art_position || ''}`}
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
                                        style={{
                                            width: 210,
                                        }}
                                        popperStyle={{
                                            width: 210,
                                        }}
                                    />
                                </div>
                                <div className={styles.detailsItem}>
                                    <p>
                                        {tCommon('Currency')}:
                                    </p>
                                    <Selector
                                        label={tCommon('Currency')}
                                        value={userCurrency?.code}
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
                                        textTransform: 'none',
                                    }}
                                >
                                    {tCommon('checkout')}
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