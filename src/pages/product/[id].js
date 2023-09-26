import { useRouter, withRouter } from 'next/router'
import styles from '../../styles/product.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import { Button } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import Cookies from 'js-cookie';
import { CART_COOKIE } from '../../../consts'
import Head from 'next/head'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'

export default withRouter(props => {
    const {
        session,
        cart,
        setCart,
        userCurrency,
        product,
        setLoadingProduct,
        windowWidth,
        cl,
        sz,
        productMetaImage,
        urlMeta,
        mobile,
    } = props

    const [currentColor, setCurrentColor] = useState(cl ? cl : product?.colors[0])
    const [currentSize, setCurrentSize] = useState(sz ? sz : product?.sizes[0])

    const router = useRouter()

    useEffect(() => {
        setLoadingProduct(false)
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
        const prodVariant = product.variants.find(vari => vari.options.includes(currentSize.id) && vari.options.includes(currentColor.id))

        const productCart = {
            id: product.id,
            printify_ids: product.printify_ids,
            printify_id_default: product.printify_id_default,
            variant_id: prodVariant.id,
            variants: product.variants,
            quantity: prodVariant.quantity,
            size: currentSize,
            color: currentColor,
            desc: 'item description',
            type: product.type,
            image: product.images.find(img => img.variants_id.includes(prodVariant.id) && img.color_id === currentColor.id).src,
            price: prodVariant.price,
            title: product.title
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
        const newQueries = { ...router.query, cl: color.title.toLowerCase() }
        /*         if (newQueries.cl === product.colors[0].title.toLowerCase()) {
                    delete newQueries.cl
                }
                router.push({
                    pathname: router.pathname,
                    query: newQueries
                }) */
    }

    function handleSizeChange(arr, index, size) {
        setCurrentSize(size)
        const newQueries = { ...router.query, sz: size.title.toLowerCase() }
        /*         if (newQueries.sz === product.sizes[0].title.toLowerCase()) {
                    delete newQueries.sz
                }
                router.push({
                    pathname: router.pathname,
                    query: newQueries
                }) */
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
                <div className={styles.left}>
                    <div className={styles.sliderContainer}>
                        {product.colors.map((color, i) =>
                            <ImagesSlider
                                key={i}
                                size={windowWidth > 1074 ? 600 : windowWidth > 549 ? 450 : 350}
                                images={product.images.filter(img => img.color_id === color.id)}
                                style={{
                                    position: 'absolute',
                                    zIndex: color.id === currentColor.id ? 1 : 0,
                                    opacity: color.id === currentColor.id ? 1 : 0,
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.right}>
                    <h2>{product.title}</h2>
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
                    <p
                        style={{
                            fontSize: '27px',
                            color: 'var(--primary)',
                            fontWeight: 'bold',
                        }}
                    >
                        {`${userCurrency.symbol} ${(product.variants.find(vari => vari.options.includes(currentSize.id) && vari.options.includes(currentColor.id)).price / 100).toFixed(2)}`}
                    </p>
                    <a
                        href={`https://${mobile ? 'api' : 'web'}.whatsapp.com/send?text=${product.title} (${currentColor.title}): https://my-store-sigma-nine.vercel.app/product/${product.id}${currentColor.id !== product.colors[0].id && currentSize.id !== product.sizes[0].id
                            ? `?sz=${currentSize.title.toLowerCase()}%26cl=${currentColor.title.replace(/ /g, '%2B').toLowerCase()}`
                            : currentSize.id !== product.sizes[0].id
                                ? `?sz=${currentSize.title.toLowerCase()}`
                                : currentColor.id !== product.colors[0].id
                                    ? `?cl=${currentColor.title.replace(/ /g, '%2B').toLowerCase()}`
                                    : ''
                            }`
                        }
                        style={{
                            width: '100%',
                            height: '55px'
                        }}
                        target="_blank"
                    >
                        <Button
                            variant='contained'
                            sx={{
                                width: '100%',
                                height: '55px'
                            }}
                        >
                            Share With WhatsApp
                        </Button>
                    </a>
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
        const product = await fetch("https://my-store-sigma-nine.vercel.app/api/product", options)
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
                urlMeta: 'https://my-store-sigma-nine.vercel.app'.concat(context.resolvedUrl),
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