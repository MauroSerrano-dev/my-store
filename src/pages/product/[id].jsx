import { withRouter } from 'next/router'
import styles from '@/styles/pages/product/id.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import { Button } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import Cookies from 'js-cookie';
import { CART_COOKIE, COLORS_POOL, SIZES_POOL, convertDolarToCurrency } from '../../../consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import ShareButton from '@/components/ShareButton'
import CareInstructionsIcons from '@/components/svgs/CareInstructionsIcons'
import NoFound404 from '../404'

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
    } = props

    const [currentColor, setCurrentColor] = useState(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
    const [currentSize, setCurrentSize] = useState(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))

    const productCurrentVariant = product?.variants.find(vari => vari.size_id === currentSize?.id && vari.color_id === currentColor?.id)

    const productPrice = product ? `${userCurrency.symbol} ${(convertDolarToCurrency(productCurrentVariant?.price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)}` : undefined

    const originalPrice = product ? `${userCurrency.symbol} ${(convertDolarToCurrency(productCurrentVariant?.price, userCurrency.code) / 100).toFixed(2)}` : undefined

    useEffect(() => {
        setCurrentColor(cl ? cl : COLORS_POOL[product?.colors_ids[0]])
        setCurrentSize(sz ? sz : SIZES_POOL.find(sz => sz.id === product?.sizes_ids[0]))
    }, [router])

    function handleBuyNow() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
            body: JSON.stringify({
                userId: 'userId',
                cartItems: [
                    {
                        title: product.title,
                        image: product.images[0].src,
                        desc: 'my productuct description',
                        type: product.type,
                        id: product.id,
                        id_printify: product.id_printify,
                        price: product.variants[0].price,
                        quantity: 1,
                        variant_id: product.variants[0].id,
                    }
                ],
                success_url: window.location.href,
                cancel_url: window.location.href,
                customer: session,
                cart_id: session ? session.cart_id : Cookies.get(CART_COOKIE),
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
        const prodVariant = product.variants.find(vari => vari.size_id === currentSize.id && vari.color_id === currentColor.id)

        const productCart = {
            id: product.id,
            printify_ids: product.printify_ids,
            printify_default_provider_id: product.printify_default_provider_id,
            variant_id: prodVariant.id,
            default_variant: { size: product.sizes_ids[0], color: product.colors_ids[0] },
            quantity: 1,
            size: currentSize,
            color: currentColor,
            desc: 'item description',
            type_id: product.type_id,
            image: product.images.filter(img => img.color_id === currentColor.id)[product.image_showcase_index].src,
            price: prodVariant.price,
            title: product.title,
            sold_out: product.sold_out,
        }

        const newCart = cart.some(prod => prod.id === product.id && prod.variant_id === prodVariant.id)
            ? cart.map(p => p.id === product.id && p.variant_id === prodVariant.id
                ? ({ ...p, quantity: p.quantity + 1 })
                : p
            )
            : cart.concat(productCart)

        setCart(newCart)
    }

    function handleColorChange(arr, index, color) {
        setCurrentColor(color)
    }

    function handleSizeChange(arr, index, size) {
        setCurrentSize(size)
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
                    <section className={`${styles.section} ${styles.one}`}>
                        <div className={styles.left}>
                            <div
                                className={styles.sliderContainer}
                            >
                                <ShareButton
                                    link={`${process.env.NEXT_PUBLIC_DOMAIN}/product/${product.id}${currentColor.id !== product.colors_ids[0].id && currentSize.id !== product.sizes_ids[0].id
                                        ? `?sz=${currentSize.title.toLowerCase()}&cl=${currentColor.title.replace('/', '+').replace(' ', '+').toLowerCase()}`
                                        : currentSize.id !== product.sizes_ids[0].id
                                            ? `?sz=${currentSize.title.toLowerCase()}`
                                            : currentColor.id !== product.colors_ids[0].id
                                                ? `?cl=${currentColor.title.replace('/', '+').replace(' ', '+').toLowerCase()}`
                                                : ''
                                        }`}
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
                            <h2>{product.title}</h2>
                            {product.sold_out &&
                                <div
                                    className={styles.soldOut}
                                >
                                    <p>
                                        {Math.round(100 * product.sold_out.percentage)}% OFF
                                    </p>
                                </div>
                            }
                            <div className={styles.prices}>
                                {product.sold_out &&
                                    <p
                                        style={{
                                            color: 'grey',
                                            textDecoration: 'line-through',
                                            fontSize: '17px',
                                        }}
                                    >
                                        {originalPrice}
                                    </p>
                                }
                                <p
                                    style={{
                                        fontSize: '27px',
                                        color: 'var(--primary)',
                                        fontWeight: '600',
                                    }}
                                >
                                    {productPrice}
                                </p>
                            </div>
                            <div>
                                <p style={{ textAlign: 'start', fontWeight: '700' }}>{product.colors_ids.length === 1 ? 'Color' : 'Pick a color'}</p>
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
                                <p style={{ textAlign: 'start', fontWeight: '700' }}>{product.sizes_ids.length === 1 ? 'Size' : 'Pick a size'}</p>
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
                    <section className={`${styles.section} ${styles.two}`}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>Description</h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.three}`}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>Key features</h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.four}`}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>Care instructions</h1>
                        </div>
                        <div className={styles.sectionBody}>
                            <CareInstructionsIcons
                                itemSize={mobile ? '33.333%' : '20%'}
                                iconSize={50}
                                fontSize={mobile ? 10 : 14}
                            />
                        </div>
                    </section>
                    <section className={`${styles.section} ${styles.five}`}>
                        <div className={styles.sectionTitle}>
                            <h1 style={{ textAlign: 'start' }}>Size guide</h1>
                        </div>
                        <div className={styles.sectionBody}>
                        </div>
                    </section>
                </div>
            </div>
            : <NoFound404 message='Product not found!' />
    )
})

/* export const config = {
    runtime: 'experimental-edge'
} */

export async function getServerSideProps(context) {

    const { id, cl, sz } = context.query;

    try {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                id: id,
            }
        }
        const product = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/product`, options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))

        const colorQuery = cl
            ? COLORS_POOL.find(color => color.title.replace('/', ' ').toLowerCase() === cl.toLowerCase())
            : null

        const sizeQuery = sz
            ? SIZES_POOL.find(size => size.title.toLowerCase() === sz.toLowerCase())
            : null

        return {
            props: {
                product: product,
                cl: colorQuery === undefined ? null : colorQuery,
                sz: sizeQuery === undefined ? null : sizeQuery,
                urlMeta: `${process.env.NEXT_PUBLIC_DOMAIN}`.concat(context.resolvedUrl),
                productMetaImage: colorQuery
                    ? product.images.filter(img => img.color_id === colorQuery.id)[product.image_showcase_index].src
                    : product.images[product.image_showcase_index].src
            },
        }
    } catch (error) {
        console.error(error);
        return {
            props: {
                product: null,
            },
        }
    }
}