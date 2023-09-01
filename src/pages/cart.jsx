import CartItem from '@/components/CartItem'
import styles from '@/styles/cart.module.css'

export default function Cart(props) {
    const { session, cart, setCart } = props

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div
                    className={styles.productsContainer}
                >
                    <div
                        className={styles.productsHead}
                    >
                        <h1>Your Cart</h1>
                    </div>
                    <div
                        className={styles.productsBody}
                    >
                        {cart.map((product, i) =>
                            <CartItem
                                session={session}
                                setCart={setCart}
                                key={i}
                                product={product}
                            />
                        )}
                    </div>
                </div>
                <div
                    className={styles.detailsContainer}
                >
                    <div
                        className={styles.detailsHead}
                    >
                        <h3>
                            Order details
                        </h3>
                    </div>
                    <div
                        className={styles.detailsBody}
                    >
                    </div>
                </div>
            </main>
            <footer>
            </footer>
        </div >
    )
}
