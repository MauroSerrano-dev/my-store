import { withRouter } from 'next/router'
import styles from '../styles/product.module.css'
import { useEffect, useState } from 'react'
import ImagesSlider from '@/components/ImagesSlider'
import { Button } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import Cookies from 'js-cookie';
import { CART_COOKIE } from '../../labels'

export default withRouter((props) => {
    const {
        session,
        cart,
        setCart,
    } = props

    const { id } = props.router.query

    const [product, setProduct] = useState()
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    useEffect(() => {
        if (id && !product)
            getProductsById(id)
    }, [id])

    function getProductsById(id) {
        const options = {
            method: 'GET',
            headers: {
                id: id
            }
        }

        fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                console.log(response.msg)
                setProduct(response.product)
            })
            .catch(err => console.error(err))
    }

    function handleBuyNow(prod) {

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'userId',
                cartItems: [
                    {
                        title: prod.title,
                        image: prod.images[0].src,
                        desc: 'my product description',
                        id: prod.id,
                        price: prod.variants[0].price,
                        quantity: 1,
                    }
                ],
                cancel_url: window.location.href,
                customer: session
            })
        }

        fetch('/api/stripe', options)
            .then(response => response.json())
            .then(response => {
                window.location.href = response.url
            })
            .catch(err => console.error(err))
    }

    function handleAddToCart(productId, variantId, quantity, image, price, title) {
        const productCart = {
            id: productId,
            variant: variantId,
            quantity: quantity,
            image: image,
            price: price,
            title: title,
        }

        const newCart = cart.some(prod => prod.id === productId && prod.variant === variantId)
            ? cart.map(p => p.id === productId && p.variant === variantId
                ? ({ ...p, quantity: p.quantity + quantity })
                : p
            )
            : cart.concat(productCart)

        setCart(newCart)

        if (session) {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.id,
                    cart: newCart
                })
            }
            fetch("/api/cart", options)
                .catch(err => console.error(err))
        }
        else if (session === null) {
            Cookies.set(CART_COOKIE, JSON.stringify(newCart))
        }
    }

    return (
        <div className={styles.container}>
            {product &&
                <div className={styles.productContainer}>
                    <div className={styles.left}>
                        <ImagesSlider
                            images={product.images}
                            currentImgIndex={currentImgIndex}
                            setCurrentImgIndex={setCurrentImgIndex}
                        />
                    </div>
                    <div className={styles.right}>
                        <h2>{product.title}</h2>
                        <Button
                            variant='contained'
                            onClick={() => handleAddToCart(
                                product.id,
                                product.variants[0].id,
                                1,
                                product.images[0].src,
                                product.variants[0].price,
                                product.title
                            )}
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
                            onClick={() => handleBuyNow(product)}
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