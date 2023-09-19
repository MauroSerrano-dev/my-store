import styles from '@/styles/components/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Link from 'next/link';
import { CART_COOKIE, convertDolarToCurrency } from '../../consts';
import { useEffect } from 'react';

export default function ProductModal(props) {
    const {
        session,
        product,
        setCart,
        index,
        userCurrency,
    } = props

    useEffect(() => {
        console.log('product', product)
    }, [product])

    function handleDeleteCartProduct() {
        setCart(prev => {
            const newCart = prev.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant_id)
            if (session) {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.id,
                        cart: newCart,
                    })
                }
                fetch("/api/cart", options)
                    .catch(err => console.error(err))
            }
            else {
                Cookies.set(CART_COOKIE, JSON.stringify(newCart))
            }
            return newCart
        })
    }

    return (
        <motion.div
            className={styles.container}
            variants={{
                hidden: {
                    opacity: 0,
                    y: 20,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay: 0.5 * index,
                    }
                }
            }}
            initial='hidden'
            animate='visible'
        >
            <SlClose
                onClick={() => handleDeleteCartProduct()}
                color='#ffffff'
                style={{
                    fontSize: '15px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '0.7rem',
                    right: '0.3rem',
                    color: 'var(--global-black)',
                    zIndex: 10,
                }}
            />
            <Link legacyBehavior href={`/product?id=${product.id}`}>
                <a className={styles.imageContainer}>
                    <img
                        className={styles.image}
                        src={product.image}
                    />
                </a>
            </Link>
            <div className={styles.right}>
                <Link legacyBehavior href={`/product?id=${product.id}`}>
                    <a>
                        <h6>{product.title}</h6>
                    </a>
                </Link>
                <div className={styles.infos}>
                    <p>
                        Size: {product.size.title}
                    </p>
                    <p>
                        Color: {product.color.title}
                    </p>
                    <p>
                        Quantity: {product.quantity}
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    <p
                        style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        {`${userCurrency.symbol} ${((convertDolarToCurrency(product.price, userCurrency.code) / 100) * product.quantity).toFixed(2)}`}
                    </p>
                    {product.quantity > 1 &&
                        <p style={{ fontSize: '10px', color: 'var(--text-black)' }}>
                            {`${userCurrency.symbol} ${(convertDolarToCurrency(product.price, userCurrency.code) / 100).toFixed(2)} unit`}
                        </p>
                    }
                </div>
            </div>
        </motion.div>
    )
}