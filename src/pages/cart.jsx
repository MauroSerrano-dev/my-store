import ProductCart from '@/components/products/ProductCart'
import styles from '@/styles/pages/cart.module.css'
import { COLORS_POOL, COMMON_TRANSLATES, COUNTRIES, DEFAULT_LANGUAGE, LIMITS, SIZES_POOL } from '@/consts'
import { useEffect, useState } from 'react'
import Selector from '@/components/material-ui/Selector'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '@/utils/toasts'
import SelectorAutocomplete from '@/components/material-ui/SelectorAutocomplete'
import { cartItemModel } from '@/utils/models'
import { LoadingButton } from '@mui/lab'
import { useAppContext } from '@/components/contexts/AppContext'
import { getProductPriceUnit } from '@/utils/prices'
import { getAllProducts } from '../../frontend/product'
import MyError from '@/classes/MyError'

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
    const [shippingInfo, setShippingInfo] = useState({ shippingValue: 0, taxValue: 0 })
    const [productsOne, setProductsOne] = useState()
    const [productsTwo, setProductsTwo] = useState()
    const [outOfStock, setOutOfStock] = useState([])
    const [unavailables, setUnavailables] = useState([])
    const [inicialCartAlreadyCalled, setInicialCartAlreadyCalled] = useState(false)
    const [loadingShippingValue, setLoadingShippingValue] = useState(true)

    const SHIPPING_CONVERTED = Math.round((shippingInfo.shippingValue + shippingInfo.taxValue) * userCurrency?.rate)

    const ITEMS_TOTAL = cart?.products.reduce((acc, product) => acc + ((getProductPriceUnit(product, product.variant, userCurrency?.rate) * product.quantity)), 0)

    const ORDER_TOTAL = ITEMS_TOTAL + SHIPPING_CONVERTED

    const { i18n } = useTranslation()

    const tCommon = useTranslation('common').t
    const tColors = useTranslation('colors').t
    const tCart = useTranslation('cart').t
    const tCountries = useTranslation('countries').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (cart && userLocation && inicialCartAlreadyCalled)
            callGetShippingInfo()
    }, [cart, userLocation])

    useEffect(() => {
        if (!inicialCartAlreadyCalled) {
            getInicialCart()
            setInicialCartAlreadyCalled(true)
        }
        else if (!cart || cart.products.length === 0)
            getProducts()
    }, [cart])

    async function handleCheckout() {
        try {
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
                        return cartItemModel({
                            id: prod.id,
                            type_id: prod.type_id,
                            quantity: prod.quantity,
                            title: prod.title,
                            image_src: prod.image_src,
                            description: `${tCommon(prod.type_id)} ${tColors(COLORS_POOL[prod.variant.color_id].id_string)} / ${tCommon(SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title)}`,
                            id_printify: prod.printify_ids[shippingInfo.provider_id],
                            provider_id: shippingInfo.provider_id,
                            art_position: prod.art_position,
                            variant: {
                                ...prod.variant,
                                id_printify: typeof prod.variant.id_printify === 'string' ? prod.variant.id_printify : prod.variant.id_printify[shippingInfo.provider_id]
                            },
                        })
                    }),
                    cancel_url: window.location.href,
                    success_url: session
                        ? `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/orders`
                        : `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/?refresh-cart`,
                    customer: session,
                    shippingCountry: userLocation.country,
                    currency_code: userCurrency?.code,
                    user_language: i18n.language,
                })
            }

            const response = await fetch('/api/stripe', options)
            const responseJson = await response.json()

            if (response.status >= 300)
                throw new MyError(responseJson.error)

            window.location.href = responseJson.url
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg, error.customProps?.options || {}) })
            else
                showToast({ type: 'error', msg: tToasts('default_error') })
            if (error.customProps?.outOfStock)
                setOutOfStock(error.customProps.outOfStock)
            if (error.customProps?.disabledProducts)
                setUnavailables(error.customProps.disabledProducts)
            setBlockInteractions(false)
            setLoading(false)
            setDisableCheckoutButton(false)
        }
    }

    async function getProducts() {
        try {
            const response = await getAllProducts({
                prods_limit: LIMITS.max_products_in_carousel,
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
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    async function callGetShippingInfo() {
        try {
            setLoadingShippingValue(true)

            const productsLessInfo = cart.products.map(prod => (
                {
                    type_id: prod.type_id,
                    variant_id: prod.variant.id,
                    quantity: prod.quantity
                }
            ))

            const options = {
                method: 'GET',
                headers: {
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                }
            }

            const response = await fetch(`/api/app-settings/shipping-value?products=${JSON.stringify(productsLessInfo)}&country=${userLocation.country}`, options)
            const responseJson = await response.json()

            if (response.status >= 300)
                throw responseJson.error

            setShippingInfo(responseJson.data)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
        finally {
            setLoadingShippingValue(false)
        }
    }

    function handleChangeCountrySelector(event, value) {
        if (value?.id)
            setUserLocation({ country: value.id, continent: COUNTRIES[value.id].continent })
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
                                            Object.keys(COUNTRIES)
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
                                    {!loadingShippingValue &&
                                        <p>
                                            {`${userCurrency?.symbol} ${(SHIPPING_CONVERTED / 100).toFixed(2)}`}
                                        </p>
                                    }
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