import { withRouter } from 'next/router'
import styles from '@/styles/pages/product/id.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import { Button } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import { CART_COOKIE, CART_MAX_ITEMS, COLORS_POOL, SIZES_POOL } from '../../../consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import ShareButton from '@/components/ShareButton'
import CareInstructionsIcons from '@/components/svgs/CareInstructionsIcons'
import NoFound404 from '../../components/NoFound404'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { showToast } from '../../../utils/toasts'
import HeartButton from '@/components/buttons-icon/HeartButton'

export default withRouter(props => {
    const {
        session,
        cart,
        setCart,
        userCurrency,
        product,
        windowWidth,
        cl,
        sz,
        productMetaImage,
        urlMeta,
        mobile,
        router,
        supportsHoverAndPointer,
        setLoading,
    } = props

    const tErrors = useTranslation('errors').t

    const [inWishlist, setInWishlist] = useState(false)

    const [currentColor, setCurrentColor] = useState(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
    const [currentSize, setCurrentSize] = useState(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))

    const productCurrentVariant = product?.variants.find(vari => vari.size_id === currentSize?.id && vari.color_id === currentColor?.id)

    const PRODUCT_PRICE = product && userCurrency ? Math.ceil(productCurrentVariant?.price * userCurrency.rate) * (product.sold_out ? 1 - product.sold_out.percentage : 1) : undefined

    const ORIGINAL_PRICE = product && userCurrency ? Math.ceil(productCurrentVariant?.price * userCurrency.rate) : undefined

    useEffect(() => {
        setCurrentColor(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
        setCurrentSize(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    }, [router])

    function handleBuyNow() {
        if (process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true') {
            showToast({ msg: 'Checkout temporarily disabled' })
            return
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
            body: JSON.stringify({
                cartItems: [
                    {
                        id: product.id,
                        type_id: product.type_id,
                        title: product.title,
                        description: product.description,
                        printify_ids: product.printify_ids,
                        variant: prodVariant,
                        quantity: 1,
                        default_variant: {
                            color_id: product.variants[0].color_id,
                            size_id: product.variants[0].size_id,
                        },
                        image: product.images.filter(img => img.color_id === prodVariant.color_id)[product.image_showcase_index],
                    }
                ],
                success_url: session ? `${window.location.origin}/orders` : window.location.origin,
                cancel_url: window.location.href,
                customer: session,
                cart_id: session ? session.cart_id : Cookies.get(CART_COOKIE),
                currency: userCurrency?.code,
                /* shippingValue: SHIPPING_CONVERTED,
                shippingCountry: shippingCountry, */
            })
        }

        fetch('/api/stripe', options)
            .then(response => response.json())
            .then(response => {
                window.location.href = response.url
            })
            .catch(err => console.error(err))
    }

    function handleAddToCart() {
        if (cart) {

            const prodVariant = product.variants.find(vari => vari.size_id === currentSize.id && vari.color_id === currentColor.id)

            if (cart.products.some(prod => prod.id === product.id && prod.variant_id === prodVariant.id && prod.quantity >= CART_MAX_ITEMS)) {
                showToast({ msg: tErrors('max_products_toast'), type: 'error' })
                return
            }

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
                .then(response => setCart(response.cart))
                .catch(err => {
                    setLoading(false)
                    console.error(err)
                })
        }
    }

    function handleColorChange(arr, index, color) {
        setCurrentColor(color)
    }

    function handleSizeChange(arr, index, size) {
        setCurrentSize(size)
    }

    function handleWishlist() {
        setInWishlist(prev => !prev)
    }

    return (
        product && currentColor && currentSize
            ? <div className={styles.container}>
                <Head>
                    <title>{product.title}</title>
                    <meta name="keywords" content={product.tags.join(', ')} key='keywords' />
                    <meta property="og:title" content={product.title} key='og:title' />
                    <meta property="og:image:alt" content={product.title} key='og:image:alt' />
                    <meta property="og:description" content={product.description} key='og:description' />
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
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    width={windowWidth > 1074 ? 450 : windowWidth > 549 ? 450 : windowWidth}
                                />
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className='fillWidth flex row' style={{ justifyContent: 'space-between' }}>
                                <h2>{product.title}</h2>
                                {session &&
                                    <HeartButton
                                        checked={inWishlist}
                                        onClick={handleWishlist}
                                    />
                                }
                            </div>
                            {product.sold_out &&
                                <div
                                    className={styles.soldOut}
                                >
                                    <p>
                                        {Math.round(100 * product.sold_out.percentage)}% OFF
                                    </p>
                                </div>
                            }
                            {userCurrency &&
                                <div className={styles.prices}>
                                    {product.sold_out &&
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
                            <div>
                                <p style={{ textAlign: 'start', fontWeight: '700' }}>
                                    {product.colors_ids.length === 1 ? 'Color' : 'Pick a color'}
                                </p>
                                <ColorSelector
                                    options={product.colors_ids.map(color_id => COLORS_POOL[color_id])}
                                    value={[currentColor]}
                                    onChange={handleColorChange}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    styleButton={{
                                        height: mobile ? 35 : 40,
                                        width: mobile ? 35 : 40,
                                    }}
                                />
                            </div>
                            <div>
                                <p style={{ textAlign: 'start', fontWeight: '700' }}>
                                    {product.sizes_ids.length === 1 ? 'Size' : 'Pick a size'}
                                </p>
                                <SizesSelector
                                    value={[currentSize]}
                                    options={product.sizes_ids.map(size_id => SIZES_POOL.find(sz => sz.id === size_id))}
                                    onChange={handleSizeChange}
                                />
                            </div>
                            <Button
                                variant='contained'
                                onClick={() => handleAddToCart()}
                                sx={{
                                    width: '100%',
                                    height: '55px'
                                }}
                            >
                                <ShoppingCartOutlinedIcon />
                                Add to Cart
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={() => handleBuyNow()}
                                sx={{
                                    width: '100%',
                                    height: '55px'
                                }}
                            >
                                <CreditCardOutlinedIcon />
                                Buy Now
                            </Button>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.two} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                Description
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                            <p style={{ textAlign: 'start' }}>
                                {product.description}
                            </p>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.three} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                Key features
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.four} `}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>
                                Care instructions
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
                                Size guide
                            </h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                </div>
            </div>
            : <NoFound404 message='Product not found!' />
    )
})
//está rápido sem isso
/* export const config = {
    runtime: 'experimental-edge'
} */

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
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'errors'])),
            product: product || null,
            cl: colorQuery === undefined ? null : colorQuery,
            sz: sizeQuery === undefined ? null : sizeQuery,
            urlMeta: `${process.env.NEXT_PUBLIC_URL}${resolvedUrl} `,
            productMetaImage: !product
                ? 'https://mrfstyles.com/logos/circle-black.jpg'
                : colorQuery
                    ? product.images.filter(img => img.color_id === colorQuery.id)[product.image_showcase_index].src
                    : product.images[product.image_showcase_index].src
        }
    }
}