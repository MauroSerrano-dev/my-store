import { withRouter } from 'next/router'
import styles from '@/styles/pages/product/id.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import { COLORS_POOL, SIZES_POOL, getShippingOptions, DEFAULT_LANGUAGE, COMMON_TRANSLATES, PRODUCTS_TYPES, CART_LOCAL_STORAGE, INICIAL_VISITANT_CART } from '@/consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import ShareButton from '@/components/ShareButton'
import CareInstructionsIcons from '@/components/products/CareInstructionsIcons'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '@/utils/toasts'
import HeartButton from '@/components/buttons-icon/HeartButton'
import { cartItemModel, productInfoModel } from '@/utils/models'
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
import ProductTag from '@/components/products/ProductTag'
import { getProductVariantsInfos, mergeProducts } from '@/utils'
import TableSizes from '@/components/products/TableSizes'
import KeyFeatures from '@/components/products/KeyFeatures'
import { ButtonGroup } from '@mui/material'
import { addProductsToCart } from '../../../frontend/cart'
import { addProductsToVisitantCart } from '../../../frontend/visitant-cart'
import CarouselSimilarProducts from '@/components/carousels/CarouselSimilarProducts'
import { getProductPrintifyIdsUniquePosition } from '@/utils/edit-product'
import { getProductById } from '../../../backend/product'
import MyError from '@/classes/MyError'

export default withRouter(props => {
    const {
        productJSON,
        cl,
        sz,
        productMetaImage,
        urlMeta,
    } = props

    const product = JSON.parse(productJSON)

    const {
        mobile,
        router,
        session,
        setLoading,
        userCurrency,
        setCart,
        cart,
        windowWidth,
        userLocation,
        setUserLocation,
        handleWishlistClick,
        setPosAddModal,
    } = useAppContext()

    const { i18n } = useTranslation()

    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t
    const tCountries = useTranslation('countries').t
    const tProduct = useTranslation('product').t
    const tColors = useTranslation('colors').t

    const [currentColor, setCurrentColor] = useState(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
    const [currentSize, setCurrentSize] = useState(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    const [currentPosition, setCurrentPosition] = useState('front')

    const [shippingInfo, setShippingInfo] = useState({ providers_ids: {}, value: 0 })
    const [buyNowModalOpen, setBuyNowModalOpen] = useState(false)

    const [disableCheckoutButton, setDisableCheckoutButton] = useState(false)

    const productCurrentVariant = getProductVariantsInfos(product)?.find(vari => vari.size_id === currentSize?.id && vari.color_id === currentColor?.id)

    const PRODUCT_PRICE = product && userCurrency && productCurrentVariant ? getProductPriceUnit(product, productCurrentVariant, userCurrency.rate) : undefined

    const ORIGINAL_PRICE = product && userCurrency && productCurrentVariant ? getProductPriceWithoutPromotion(product, productCurrentVariant, userCurrency.rate) : undefined

    useEffect(() => {
        setCurrentColor(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
        setCurrentSize(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    }, [router])

    useEffect(() => {
        if (userLocation)
            callGetShippingInfo()
    }, [userLocation])

    async function handleBuyNow() {
        try {
            setDisableCheckoutButton(true)

            const uniquePositionPrintifyIds = typeof Object.values(product.printify_ids)[0] === 'string'
                ? product.printify_ids
                : getProductPrintifyIdsUniquePosition(product.printify_ids, currentPosition)

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                },
                body: JSON.stringify({
                    cartItems: [cartItemModel({
                        id: product.id,
                        type_id: product.type_id,
                        quantity: 1,
                        title: product.title,
                        image_src: product.images.find(img => img.color_id === productCurrentVariant.color_id && (!img.position || img.position === currentPosition)).src,
                        description: `${tCommon(product.type_id)} ${tColors(currentColor.id_string)} / ${currentSize.title}`,
                        id_printify: uniquePositionPrintifyIds[shippingInfo.providers_ids[product.type_id]],
                        provider_id: shippingInfo.providers_ids[product.type_id],
                        art_position: product.images[0].position
                            ? currentPosition
                            : null,
                        variant: {
                            ...productCurrentVariant,
                            id_printify: typeof productCurrentVariant.id_printify === 'string' ? productCurrentVariant.id_printify : productCurrentVariant.id_printify[shippingInfo.providers_ids[product.type_id]],
                        },
                    })],
                    success_url: session
                        ? `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/orders`
                        : `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/?refresh-cart`,
                    cancel_url: window.location.href,
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
            if (error.customProps?.outOfStock)
                product.outOfStock = true
            if (error.customProps?.disabledProducts)
                product.disabled = true
            setBuyNowModalOpen(false)
            setDisableCheckoutButton(false)
        }
    }

    async function callGetShippingInfo() {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                }
            }

            const response = await fetch(`/api/app-settings/shipping-value?products_types=${JSON.stringify([{ id: product.type_id, quantity: 1 }])}&country=${userLocation.country}`, options)
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
    }

    async function handleAddToCart() {
        try {
            if (cart) {
                setLoading(true)
                const newProduct = {
                    id: product.id,
                    variant_id: productCurrentVariant.id,
                    quantity: 1,
                }

                if (typeof Object.values(product.printify_ids)[0] === 'object')
                    newProduct.art_position = currentPosition

                if (session)
                    await addProductsToCart(session.id, [newProduct])

                else {
                    const localData = localStorage.getItem(CART_LOCAL_STORAGE)
                    addProductsToVisitantCart(localData ? JSON.parse(localData) : INICIAL_VISITANT_CART, [newProduct])
                }

                const newProductFullInfo = productInfoModel(
                    {
                        id: product.id,
                        art_position: product.images[0].position
                            ? currentPosition
                            : null,
                        quantity: 1,
                        type_id: product.type_id,
                        title: product.title,
                        promotion: product.promotion,
                        printify_ids: typeof Object.values(product.printify_ids)[0] === 'string'
                            ? product.printify_ids
                            : getProductPrintifyIdsUniquePosition(product.printify_ids, currentPosition),
                        variant: productCurrentVariant,
                        default_variant: {
                            color_id: product.colors_ids[0],
                            size_id: product.sizes_ids[0],
                        },
                        image_src: product.images.find(img => img.color_id === productCurrentVariant.color_id && (!img.position || img.position === currentPosition)).src,
                    }
                )
                setPosAddModal(true)
                setCart(prev => (
                    {
                        ...prev,
                        products: mergeProducts(prev.products, [newProductFullInfo])
                    }
                ))
            }
        }
        catch (error) {
            console.error(error)
            setLoading(false)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
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

    function handleBuyNowModal() {
        setBuyNowModalOpen(true)
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
                <main className={styles.main}>
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
                                        key={product.id}
                                        colors={product.colors_ids.map(color_id => COLORS_POOL[color_id])}
                                        currentColor={currentColor}
                                        currentPosition={currentPosition}
                                        width={windowWidth > 1074 ? 450 : windowWidth > 549 ? 450 : windowWidth}
                                    />
                                </div>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.rightTop}>
                                    <div className={styles.titleAndPrice}>
                                        <div className={styles.titleContainer}>
                                            <h1 className={styles.title}>
                                                {product.title}
                                            </h1>
                                            {session &&
                                                <HeartButton
                                                    checked={session.wishlist.products.some(prod => prod.id === product.id)}
                                                    onClick={() => handleWishlistClick(product.id)}
                                                />
                                            }
                                        </div>
                                        <div style={{ paddingTop: 3, paddingBottom: 8 }}>
                                            <ProductTag
                                                product={product}
                                                style={{
                                                    fontSize: 16
                                                }}
                                            />
                                        </div>
                                        {product.disabled &&
                                            <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                                                <div
                                                    className={styles.unavailable}
                                                >
                                                    <p>
                                                        {tCommon('UNAVAILABLE')}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        {product.outOfStock &&
                                            <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                                                <div
                                                    className={styles.unavailable}
                                                >
                                                    <p>
                                                        {tCommon('OUT_OF_STOCK')}
                                                    </p>
                                                </div>
                                            </div>
                                        }
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
                                                {product.colors_ids.length === 1 ? tCommon('Color') : tProduct('choose_a_color')}
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
                                                {product.sizes_ids.length === 1 ? tCommon('Size') : tProduct('choose_a_size')}
                                            </p>
                                            <SizesSelector
                                                value={[currentSize]}
                                                options={product.sizes_ids.map(size_id => SIZES_POOL.find(sz => sz.id === size_id))}
                                                onChange={handleSizeChange}
                                            />
                                        </div>
                                        {product.images[0].position &&
                                            <div className={styles.sizeSelector}>
                                                <p style={{ textAlign: 'start', fontWeight: '700' }}>
                                                    {tProduct('choose_art_position')}
                                                </p>
                                                <ButtonGroup
                                                    sx={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <MyButton
                                                        variant={currentPosition === 'front' ? 'contained' : 'outlined'}
                                                        onClick={() => setCurrentPosition('front')}
                                                        style={{
                                                            width: '50%'
                                                        }}
                                                    >
                                                        Front
                                                    </MyButton>
                                                    <MyButton
                                                        variant={currentPosition === 'back' ? 'contained' : 'outlined'}
                                                        onClick={() => setCurrentPosition('back')}
                                                        style={{
                                                            width: '50%'
                                                        }}
                                                    >
                                                        Back
                                                    </MyButton>
                                                </ButtonGroup>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className={styles.rightBottom}>
                                    {!product.disabled &&
                                        <div className={styles.buyButtons}>
                                            <MyButton
                                                onClick={handleAddToCart}
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
                                                onClick={handleBuyNowModal}
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
                                    }
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
                                <p style={{ textAlign: 'justify' }}>
                                    {tProduct(`description_${product.type_id}`)}
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
                                <KeyFeatures
                                    product_type={product.type_id}
                                    options={PRODUCTS_TYPES.find(type => type.id === product.type_id).key_features}
                                />
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
                                    options={PRODUCTS_TYPES.find(type => type.id === product.type_id).care_instructions}
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
                                <TableSizes type={product.type_id} />
                            </div>
                        </section>
                    </div>
                    <Modal
                        className={styles.modalContent}
                        open={buyNowModalOpen}
                        closeModal={() => setBuyNowModalOpen(false)}
                    >
                        <div className={styles.modalHead}>
                            <h3>{tProduct('ship_to')}</h3>
                            <button
                                className='flex buttonInvisible'
                                onClick={() => setBuyNowModalOpen(false)}
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
                                    value={{ id: userLocation?.country, label: tCountries(userLocation?.country) }}
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
                    <div className={styles.carousel}>
                        <h2 className={styles.similarTitle}>{tProduct('similar-products-title')}</h2>
                        <CarouselSimilarProducts
                            key={product.id} // importante para dar refresh a posição do componente
                            product_id={product.id}
                        />
                    </div>
                </main>
                <Footer />
            </div>
            : <NoFound404
                message='Product not found!'
            />
    )
})

export async function getServerSideProps({ query, locale, resolvedUrl }) {
    const { id, cl, sz } = query

    let product
    try {
        product = await getProductById(id)
    }
    catch (error) {
        product = null
    }

    const colorQuery = cl
        ? Object.values(COLORS_POOL).find(color => color.id_string === cl.toLowerCase())
        : null

    const sizeQuery = sz
        ? SIZES_POOL.find(size => size.title.toLowerCase() === sz.toLowerCase())
        : null

    const chooseColor = colorQuery && product.colors_ids.some(color_id => color_id === colorQuery.id)
        ? colorQuery
        : null

    const chooseSize = sizeQuery && product.sizes_ids.some(size_id => size_id === sizeQuery.id)
        ? sizeQuery
        : null

    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['countries', 'product', 'care-instructions', 'key-features', 'table-sizes', 'footer']))),
            productJSON: JSON.stringify(product),
            cl: chooseColor === undefined ? null : chooseColor,
            sz: chooseSize === undefined ? null : chooseSize,
            urlMeta: `${process.env.NEXT_PUBLIC_URL}${locale === DEFAULT_LANGUAGE ? '' : `/${locale}`}${resolvedUrl} `,
            productMetaImage: !product
                ? 'https://mrfstyles.com/logos/circle-black.jpg'
                : chooseColor
                    ? product.images.filter(img => img.color_id === chooseColor.id)[product.image_showcase_index].src
                    : product.images[product.image_showcase_index].src
        }
    }
}