import { withRouter } from 'next/router'
import styles from '../../styles/product/id.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import { Button } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import Cookies from 'js-cookie';
import { CART_COOKIE, convertDolarToCurrency } from '../../../consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import ShareButton from '@/components/ShareButton'
import CareInstructionsIcons from '@/components/svgs/CareInstructionsIcons'

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
    } = props

    const [currentColor, setCurrentColor] = useState(cl ? cl : product?.colors[0])
    const [currentSize, setCurrentSize] = useState(sz ? sz : product?.sizes[0])
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const productCurrentVariant = product.variants.find(vari => vari.size_id === currentSize.id && vari.color_id === currentColor.id)

    const productPrice = `${userCurrency.symbol} ${(convertDolarToCurrency(productCurrentVariant.price * (product.sold_out.percentage ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)}`

    const originalPrice = `${userCurrency.symbol} ${(convertDolarToCurrency(productCurrentVariant.price, userCurrency.code) / 100).toFixed(2)}`

    useEffect(() => {
        setCurrentColor(cl ? cl : product?.colors[0])
        setCurrentSize(sz ? sz : product?.sizes[0])
    }, [router])

    function handleBuyNow() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            printify_id_default: product.printify_id_default,
            variant_id: prodVariant.id,
            default_variant: { size: product.sizes[0], color: product.colors[0] },
            quantity: prodVariant.quantity,
            size: currentSize,
            color: currentColor,
            desc: 'item description',
            type: product.type,
            image: product.images.find(img => img.variants_id.includes(prodVariant.id) && img.color_id === currentColor.id).src,
            price: prodVariant.price,
            title: product.title,
            sold_out: product.sold_out,
        }

        const newCart = cart.some(prod => prod.id === product.id && prod.variant_id === prodVariant.id)
            ? cart.map(p => p.id === product.id && p.variant_id === prodVariant.id
                ? ({ ...p, quantity: p.quantity + prodVariant.quantity })
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
        product &&
        <div className={styles.container}>
            <Head>
                <title>{product.title}</title>
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
                                link={`${process.env.NEXT_PUBLIC_DOMAIN}/product/${product.id}${currentColor.id !== product.colors[0].id && currentSize.id !== product.sizes[0].id
                                    ? `?sz=${currentSize.title.toLowerCase()}&cl=${currentColor.title.replace(' ', '+').toLowerCase()}`
                                    : currentSize.id !== product.sizes[0].id
                                        ? `?sz=${currentSize.title.toLowerCase()}`
                                        : currentColor.id !== product.colors[0].id
                                            ? `?cl=${currentColor.title.replace(' ', '+').toLowerCase()}`
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
                            {product.colors.map((color, i) =>
                                <ImagesSlider
                                    key={i}
                                    index={currentImgIndex}
                                    onChange={(imgIndex) => setCurrentImgIndex(imgIndex)}
                                    width={windowWidth > 1074 ? 450 : windowWidth > 549 ? 450 : 350}
                                    images={product.images.filter(img => img.color_id === color.id)}
                                    style={{
                                        position: i === 0 ? 'relative' : 'absolute',
                                        zIndex: color.id === currentColor.id ? 1 : 0,
                                        opacity: color.id === currentColor.id ? 1 : 0,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className={styles.right}>
                        <h2>{product.title}</h2>
                        {product.sold_out.percentage &&
                            <div
                                className={styles.soldOut}
                            >
                                <p>
                                    {Math.round(100 * product.sold_out.percentage)}% OFF
                                </p>
                            </div>
                        }
                        <div className={styles.prices}>
                            {product.sold_out.percentage &&
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
                                    fontWeight: 'bold',
                                }}
                            >
                                {productPrice}
                            </p>
                        </div>
                        <div>
                            <p style={{ textAlign: 'start', fontWeight: 'bold' }}>Pick a color</p>
                            <ColorSelector
                                options={product.colors}
                                value={[currentColor]}
                                onChange={handleColorChange}
                            />
                        </div>
                        <div>
                            <p style={{ textAlign: 'start', fontWeight: 'bold' }}>Pick a size</p>
                            <SizesSelector
                                value={[currentSize]}
                                options={product.sizes}
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
                id: id,
            }
        }
        const product = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/product`, options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))

        const colorQuery = cl
            ? product.colors.find(color => color.title.toLowerCase() === cl.toLowerCase())
            : null

        const sizeQuery = sz
            ? product.sizes.find(size => size.title.toLowerCase() === sz.toLowerCase())
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