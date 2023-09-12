import styles from '@/styles/components/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Link from 'next/link';
import { CART_COOKIE } from '../../consts';

export default function ProductModal(props) {
    const {
        session,
        product,
        setCart,
        index,
    } = props

    function handleDeleteCartProduct(productId) {
        setCart(prev => {
            const newCart = prev.filter(prod => prod.id !== productId)
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
                onClick={() => handleDeleteCartProduct(product.id)}
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
                        Size: M
                    </p>
                    <p>
                        Quantity: {product.quantity}
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    <p>
                        {`$${((product.price / 100) * product.quantity).toFixed(2)}`}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}