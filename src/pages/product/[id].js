import { withRouter } from 'next/router'
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
import { getProductMetaById } from '../../../productsMetas'

export default withRouter(props => {
    const {
        session,
        cart,
        setCart,
        userCurrency,
    } = props

    const { id } = props.router.query
    
    const productMeta = getProductMetaById(id)

    const [product, setProduct] = useState()

    const [currentColor, setCurrentColor] = useState()
    const [currentSize, setCurrentSize] = useState()

    useEffect(() => {
        if (id && !product)
            getProduct(id)
    }, [id, product])

    function getProduct() {
        const options = {
            method: 'GET',
            headers: {
                id: id
            }
        }
        fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                setCurrentColor(response.product.colors[0])
                setCurrentSize(response.product.sizes[0])
                setProduct(response.product)
            })
            .catch(err => console.error(err))
    }

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
    }

    function handleSizeChange(arr, index, size) {
        setCurrentSize(size)
    }

    return (
        <div className={styles.container}>
            <Head>
                <meta property="og:title" content={productMeta.id} key='og:title' />
                <meta property="og:image:alt" content={productMeta.title} key='og:image:alt' />
                <meta property="og:description" content={productMeta.description} key='og:description' />
                <meta property="og:image" itemProp="image" content={productMeta.image} key='og:image' />
                <meta property="og:type" content="product" key='og:type' />
                <meta property="og:url" content={`https://my-store-sigma-nine.vercel.app/product/${id}`} key='og:url' />
            </Head>
            {product &&
                <div className={styles.productContainer}>
                    <div className={styles.left}>
                        {product.colors.map((color, i) =>
                            <ImagesSlider
                                key={i}
                                images={product.images.filter(img => img.color_id === color.id)}
                                style={{
                                    position: 'absolute',
                                    zIndex: color.id === currentColor.id ? 1 : 0
                                }}
                            />
                        )}
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
            }
        </div>
    )
})

/* export async function getServerSideProps(context) {
    const { id } = context.query;

    try {
        const options = {
            method: 'GET',
            headers: {
                id: id
            }
        }

        const product = await fetch("https://my-store-sigma-nine.vercel.app/api/product", options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))

        return {
            props: {
                product: product,
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
} */