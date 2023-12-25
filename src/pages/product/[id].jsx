import { withRouter } from 'next/router'
import styles from '@/styles/pages/product/id.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import { CART_COOKIE, COLORS_POOL, SIZES_POOL, LIMITS, getShippingOptions, DEFAULT_LANGUAGE, COMMON_TRANSLATES } from '@/consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import ShareButton from '@/components/ShareButton'
import CareInstructionsIcons from '@/components/svgs/CareInstructionsIcons'
import NoFound404 from '../../components/NoFound404'
import Cookies from 'js-cookie'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '@/utils/toasts'
import HeartButton from '@/components/buttons-icon/HeartButton'
import { cartItemModel } from '@/utils/models'
import SelectorAutocomplete from '@/components/material-ui/SelectorAutocomplete'
import COUNTRIES_POOL from '../../../public/locales/en/countries.json'
import { useAppContext } from '@/components/contexts/AppContext'
import { getProductPriceUnit, getProductPriceWithoutPromotion } from '@/utils/prices'
import Footer from '@/components/Footer'
import MyButton from '@/components/material-ui/MyButton'
import Modal from '@/components/Modal'
import { SlClose } from 'react-icons/sl'
import { LoadingButton } from '@mui/lab'
import ZoneConverter from '@/utils/country-zone.json'
import ProductTag from '@/components/ProductTag'

export default withRouter(props => {
    const {
        product,
        cl,
        sz,
        productMetaImage,
        urlMeta,
    } = props

    const {
        mobile,
        router,
        session,
        setLoading,
        userCurrency,
        setCart,
        cart,
        windowWidth,
        setSession,
        userLocation,
        setUserLocation,
    } = useAppContext()

    const { i18n } = useTranslation()

    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t
    const tCountries = useTranslation('countries').t
    const tProduct = useTranslation('product').t
    const tColors = useTranslation('colors').t

    const [currentColor, setCurrentColor] = useState(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
    const [currentSize, setCurrentSize] = useState(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    const [buyNowModalOpen, setBuyNowModalOpen] = useState(false)
    const [buyNowModalOpacity, setBuyNowModalOpacity] = useState(false)
    const [shippingValue, setShippingValue] = useState(0)
    const [disableCheckoutButton, setDisableCheckoutButton] = useState(false)

    const productCurrentVariant = product?.variants.find(vari => vari.size_id === currentSize?.id && vari.color_id === currentColor?.id)

    const PRODUCT_PRICE = product && userCurrency && productCurrentVariant ? getProductPriceUnit(product, productCurrentVariant, userCurrency.rate) : undefined

    const ORIGINAL_PRICE = product && userCurrency && productCurrentVariant ? getProductPriceWithoutPromotion(product, productCurrentVariant, userCurrency.rate) : undefined

    useEffect(() => {
        setCurrentColor(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
        setCurrentSize(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    }, [router])

    useEffect(() => {
        if (userLocation)
            getShippingValue()
    }, [userLocation])

    function getShippingValue() {
        const shippingOption = getShippingOptions(product.type_id, userLocation.country)
        setShippingValue(shippingOption.first_item + shippingOption.tax)
    }

    function handleBuyNow() {
        if (process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true') {
            showToast({ msg: 'Checkout temporarily disabled' })
            return
        }

        setDisableCheckoutButton(true)

        const shippingOption = getShippingOptions(product.type_id, userLocation.country)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
            body: JSON.stringify({
                cartItems: [cartItemModel({
                    id: product.id,
                    quantity: 1,
                    title: product.title,
                    image: product.images.find(img => img.color_id === productCurrentVariant.color_id),
                    description: `${tCommon(product.type_id)} ${tColors(currentColor.id_string)} / ${currentSize.title}`,
                    id_printify: product.printify_ids[shippingOption.provider_id],
                    provider_id: shippingOption.provider_id,
                    variant: productCurrentVariant,
                    variant_id_printify: typeof productCurrentVariant.id_printify === 'number' ? productCurrentVariant.id_printify : productCurrentVariant.id_printify[shippingOption.provider_id],
                    price: Math.round(productCurrentVariant.price * userCurrency?.rate),
                })],
                success_url: session ? `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/orders` : `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}`,
                cancel_url: window.location.href,
                customer: session,
                shippingValue: Math.round(shippingValue * userCurrency?.rate),
                shippingCountry: userLocation.country,
                currency: userCurrency?.code,
                cart_id: session ? session.cart_id : Cookies.get(CART_COOKIE),
                user_language: i18n.language,
            })
        }

        fetch('/api/stripe', options)
            .then(response => response.json())
            .then(response => {
                window.location.href = response.url
            })
            .catch(err => {
                console.error(err)
                setDisableCheckoutButton(false)
            })
    }

    function handleAddToCart() {
        if (cart) {
            const prodVariant = product.variants.find(vari => vari.size_id === currentSize.id && vari.color_id === currentColor.id)

            setLoading(true)

            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN
                },
                body: JSON.stringify({
                    cartId: session ? session.cart_id : Cookies.get(CART_COOKIE),
                    cartProducts: [{ id: product.id, variant_id: prodVariant.id, quantity: 1 }]
                }),
            }

            if (session) {
                options.headers.user_id = session.id
            }

            fetch("/api/carts/cart-products", options)
                .then(response => response.json())
                .then(response => {
                    if (response.error) {
                        showToast({ type: 'error', msg: tToasts(response.error.props.code) })
                        setLoading(false)
                    }
                    else
                        setCart(response.cart)
                })
                .catch(error => {
                    setLoading(false)
                    console.error(error)
                })
        }
    }

    function handleChangeCountrySelector(event, value) {
        if (value?.id)
            setUserLocation({ country: value.id, zone: ZoneConverter[value.id] })
    }

    function handleColorChange(arr, index, color) {
        setCurrentColor(color)
    }

    function handleSizeChange(arr, index, size) {
        setCurrentSize(size)
    }

    function handleWishlist() {
        const add = !session.wishlist_products_ids.includes(product.id)

        if (add && session.wishlist_products_ids.length >= LIMITS.wishlist_products) {
            showToast({ msg: tToasts('wishlist_limit'), type: 'error' })
            return
        }

        setSession(prevSession => (
            {
                ...prevSession,
                wishlist_products_ids: add
                    ? session.wishlist_products_ids.concat(product.id)
                    : session.wishlist_products_ids.filter(prod_id => prod_id !== product.id)
            }
        ))

        const options = {
            method: add ? 'POST' : 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                wishlist_id: session.wishlist_id,
                product: { id: product.id }
            }),
        }

        fetch("/api/wishlists/wishlist-products", options)
            .then(response => response.json())
            .catch(err => {
                setSession(prevSession => (
                    {
                        ...prevSession,
                        wishlist_products_ids: add
                            ? session.wishlist_products_ids.filter(prod_id => prod_id !== product.id)
                            : session.wishlist_products_ids.concat(product.id)
                    }
                ))
                console.error(err)
            })
    }

    function handleOpenBuyNowModal() {
        setBuyNowModalOpacity(true)
        setTimeout(() => {
            setBuyNowModalOpen(true)
        }, 300)
    }

    function handleCloseBuyNowModal() {
        setBuyNowModalOpacity(false)
        setTimeout(() => {
            setBuyNowModalOpen(false)
        }, 300)
    }

    return (
        product && currentColor && currentSize
            ? <div className={styles.container}>
                <Head>
                    <title>{product.title}</title>
                    <meta name="keywords" content={product.tags.join(', ')} key='keywords' />
                    <meta property="og:title" content={product.title} key='og:title' />
                    <meta property="og:image:alt" content={product.title} key='og:image:alt' />
                    <meta property="og:description" content={`${tCommon(product.type_id)} ${tColors((cl ? cl : COLORS_POOL[product?.colors_ids[0]]).id_string)}`} key='og:description' />
                    <meta property="og:image" itemProp="image" content={productMetaImage} key='og:image' />
                    <meta property="og:type" content="product" key='og:type' />
                    <meta property="og:url" content={urlMeta} key='og:url' />
                </Head>
                <div className={styles.productContainer}>
                    <section className={`${styles.section} ${styles.one} `}>
                        <div className={styles.left}>
                            <div
                                className={styles.sliderContainer}
                            >
                                <ShareButton
                                    link={`${process.env.NEXT_PUBLIC_URL}/product/${product.id}${currentColor.id !== product.colors_ids[0] && currentSize.id !== product.sizes_ids[0]
                                        ? `?sz=${currentSize.title.toLowerCase()}&cl=${currentColor.id_string}`
                                        : currentSize.id !== product.sizes_ids[0]
                                            ? `?sz=${currentSize.title.toLowerCase()}`
                                            : currentColor.id !== product.colors_ids[0]
                                                ? `?cl=${currentColor.id_string}`
                                                : ''
                                        } `}
                                    wppMsg={`${product.title} (${currentColor.title})`}
                                    mobile={mobile}
                                    style={{
                                        position: 'absolute',
                                        top: '2%',
                                        right: '3%'
                                    }}
                                />
                                <ImagesSlider
                                    images={product.images}
                                    colors={product.colors_ids.map(color_id => COLORS_POOL[color_id])}
                                    currentColor={currentColor}
                                    width={windowWidth > 1074 ? 450 : windowWidth > 549 ? 450 : windowWidth}
                                />
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.rightTop}>
                                <div className={styles.titleContainer}>
                                    <div className='fillWidth flex row' style={{ justifyContent: 'space-between', height: 35 }}>
                                        <h2>{product.title}</h2>
                                        {session &&
                                            <HeartButton
                                                checked={session.wishlist_products_ids.includes(product.id)}
                                                onClick={handleWishlist}
                                            />
                                        }
                                    </div>
                                    <div style={{ paddingTop: 3, paddingBottom: 8 }}>
                                        <ProductTag product={product} />
                                    </div>
                                    {product.promotion &&
                                        <div
                                            className={styles.promotion}
                                        >
                                            <p>
                                                {Math.round(100 * product.promotion.percentage)}% OFF
                                            </p>
                                        </div>
                                    }
                                    {userCurrency &&
                                        <div className={styles.prices}>
                                            {product.promotion &&
                                                <p
                                                    style={{
                                                        color: 'grey',
                                                        textDecoration: 'line-through',
                                                        fontSize: '17px',
                                                    }}
                                                >
                                                    {`${userCurrency.symbol} ${(ORIGINAL_PRICE / 100).toFixed(2)}`}
                                                </p>
                                            }
                                            <p
                                                style={{
                                                    fontSize: '27px',
                                                    color: 'var(--primary)',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {`${userCurrency.symbol} ${(PRODUCT_PRICE / 100).toFixed(2)}`}
                                            </p>
                                        </div>
                                    }
                                </div>
                                <div className={styles.colorAndSizeSelectors}>
                                    <h3 style={{ textAlign: 'start' }}>
                                        {tColors(currentColor.id_string)} / {currentSize.title}
                                    </h3>
                                    <div className={styles.colorSelector}>
                                        <p style={{ textAlign: 'start', fontWeight: '700' }}>
                                            {product.colors_ids.length === 1 ? tCommon('Color') : tProduct('pick_a_color')}
                                        </p>
                                        <ColorSelector
                                            options={product.colors_ids.map(color_id => COLORS_POOL[color_id])}
                                            value={[currentColor]}
                                            onChange={handleColorChange}
                                            styleButton={{
                                                height: mobile ? 35 : 40,
                                                width: mobile ? 35 : 40,
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sizeSelector}>
                                        <p style={{ textAlign: 'start', fontWeight: '700' }}>
                                            {product.sizes_ids.length === 1 ? tCommon('Size') : tProduct('pick_a_size')}
                                        </p>
                                        <SizesSelector
                                            value={[currentSize]}
                                            options={product.sizes_ids.map(size_id => SIZES_POOL.find(sz => sz.id === size_id))}
                                            onChange={handleSizeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rightBottom}>
                                <div className={styles.buyButtons}>
                                    <MyButton
                                        onClick={() => handleAddToCart()}
                                        style={{
                                            display: 'flex',
                                            gap: '0.2rem',
                                            width: '100%',
                                            height: '55px',
                                            fontSize: 18
                                        }}
                                    >
                                        <ShoppingCartOutlinedIcon />
                                        {tProduct('add_to_cart')}
                                    </MyButton>
                                    <MyButton
                                        variant='outlined'
                                        onClick={handleOpenBuyNowModal}
                                        style={{
                                            display: 'flex',
                                            gap: '0.2rem',
                                            width: '100%',
                                            height: '55px',
                                            fontSize: 18
                                        }}
                                    >
                                        <CreditCardOutlinedIcon />
                                        {tProduct('buy_now')}
                                    </MyButton>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.two} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                {tProduct('description')}
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                            <p style={{ textAlign: 'start' }}>
                                A camiseta traz um novo conceito de conforto casual. Feita com materiais muito macios, essa camiseta é 100% algodão em cores sólidas. Cores mescladas e cinza esportivo incluem poliéster. Os ombros têm twill tape para melhor durabilidade. Não possui costuras laterais. A gola é confeccionada com tricô canelado para evitar danos e enrolamentos.
                            </p>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.three} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                {tProduct('key_features')}
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.four} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                {tProduct('care_instructions')}
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                            <CareInstructionsIcons
                                itemSize={mobile ? '33.333%' : '20%'}
                                iconSize={50}
                                fontSize={mobile ? 10 : 14}
                            />
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.five} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                {tProduct('size_guide')}
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                </div>
                {buyNowModalOpen &&
                    <Modal
                        closeModal={handleCloseBuyNowModal}
                        showModalOpacity={buyNowModalOpacity}
                        className={styles.modalContent}
                    >
                        <div className={styles.modalHead}>
                            <h3>{tProduct('ship_to')}</h3>
                            <button
                                className='flex buttonInvisible'
                                onClick={handleCloseBuyNowModal}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '1rem',
                                }}
                            >
                                <SlClose
                                    size={20}
                                />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.shippingContainer}>
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
                                    sx={{
                                        width: 300,
                                    }}
                                    popperStyle={{
                                        zIndex: 2500,
                                        width: 300,
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFoot}>
                            <LoadingButton
                                loading={disableCheckoutButton}
                                variant='contained'
                                size='large'
                                onClick={handleBuyNow}
                                sx={{
                                    width: '100%',
                                    color: 'white',
                                    fontWeight: '700',
                                    textTransform: 'none',
                                }}
                            >
                                {tCommon('checkout')}
                            </LoadingButton>
                        </div>
                    </Modal>
                }
                <Footer />
            </div>
            : <NoFound404
                message='Product not found!'
            />
    )
})

export async function getServerSideProps({ query, locale, resolvedUrl }) {
    const { id, cl, sz } = query

    const options = {
        method: 'GET',
        headers: {
            authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            id: id,
        }
    }
    const product = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/product`, options)
        .then(response => response.json())
        .then(response => response.product)
        .catch(err => console.error(err))

    const colorQuery = cl
        ? Object.values(COLORS_POOL).find(color => color.id_string === cl.toLowerCase())
        : null

    const sizeQuery = sz
        ? SIZES_POOL.find(size => size.title.toLowerCase() === sz.toLowerCase())
        : null

    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['countries', 'product', 'footer']))),
            product: product || null,
            cl: colorQuery === undefined ? null : colorQuery,
            sz: sizeQuery === undefined ? null : sizeQuery,
            urlMeta: `${process.env.NEXT_PUBLIC_URL}${locale === DEFAULT_LANGUAGE ? '' : `/${locale}`}${resolvedUrl} `,
            productMetaImage: !product
                ? 'https://mrfstyles.com/logos/circle-black.jpg'
                : colorQuery
                    ? product.images.filter(img => img.color_id === colorQuery.id)[product.image_showcase_index].src
                    : product.images[product.image_showcase_index].src
        }
    }
}