import styles from '@/styles/components/CartItem.module.css'
import { SlClose } from "react-icons/sl";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";

export default function CartItem(props) {
    const {
        session,
        product,
        setCart,
        index
    } = props

    function handleDeleteCartProduct(productId) {
        setCart(prev => {
            const newCart = prev.filter(prod => prod.id !== productId)
            if (session) {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.user.id,
                        cart: newCart,
                    })
                }
                fetch("/api/cart", options)
                    .catch(err => console.error(err))
            }
            else {
                Cookies.set('cart', JSON.stringify(newCart))
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
                    fontSize: '22px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                }}
            />
            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src={product.image}
                />
            </div>
            <div className={styles.middle}>
                <h4>{product.title}</h4>
            </div>
            <div className={styles.priceContainer}>
                <p>
                    Price:
                </p>
                <h2>
                    {`$${(product.price / 100).toFixed(2)}`}
                </h2>
            </div>
        </motion.div>
    )
}