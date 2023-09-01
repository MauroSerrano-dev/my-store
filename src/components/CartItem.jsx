import styles from '@/styles/components/CartItem.module.css'
import { SlClose } from "react-icons/sl";
import Cookies from 'js-cookie';

export default function CartItem(props) {
    const { session, product, setCart } = props

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
        <div
            className={styles.container}
        >
            <SlClose
                onClick={() => handleDeleteCartProduct(product.id)}
                color='#ffffff'
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                }}
            />
            <img
                className={styles.image}
                src={product.image}
            />
            <h2>
                {product.price}
            </h2>
        </div>
    )
}