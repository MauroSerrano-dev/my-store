import ProductCart from '@/components/ProductCart'
import styles from '@/styles/cart.module.css'
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { motion } from "framer-motion";
import { Button } from '@mui/material'

export default function Cart(props) {
    const { session, cart, setCart } = props

    const ITEMS_TOTAL = (cart.reduce((acc, product) => acc + (product.price * product.quantity), 0) / 100).toFixed(2)

    const ORDER_TOTAL = (15.55 + cart.reduce((acc, product) => acc + (product.price * product.quantity), 0) / 100).toFixed(2)

    function handleCheckout(cart) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'userId',
                cartItems: cart,
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
                            <ProductCart
                                session={session}
                                setCart={setCart}
                                product={product}
                                key={i}
                                index={i}
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
                        <div className={styles.detailsItem}>
                            <p>
                                Ship To:
                            </p>
                            <FormControl sx={{ width: '65%' }}>
                                <InputLabel size='small'>
                                    Country
                                </InputLabel>
                                <Select
                                    input={<OutlinedInput label="Country" />}
                                    value={'us'}
                                    onChange={() => console.log()}
                                    size='small'
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    <MenuItem value={'br'}>Brazil</MenuItem>
                                    <MenuItem value={'uk'}>United Kingdom</MenuItem>
                                    <MenuItem value={'us'}>United States</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.detailsItem}>
                            <p>
                                Items Total:
                            </p>
                            <p>
                                {`$${ITEMS_TOTAL}`}
                            </p>
                        </div>
                        <div className={styles.detailsItem}>
                            <p>
                                Shipping & Taxes:
                            </p>
                            <p>
                                {`$${(15.55).toFixed(2)}`}
                            </p>
                        </div>
                        <div className={styles.orderTotalContainer}>
                            <div className={styles.detailsItem}>
                                <p>
                                    Order total:
                                </p>
                                <p
                                    style={{
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {`$${ORDER_TOTAL}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={styles.detailsBottom}
                    >
                        <Button
                            variant='contained'
                            size='large'
                            onClick={() => handleCheckout(cart)}
                            sx={{
                                width: '100%',
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        >
                            Checkout
                        </Button>
                        <p className={styles.securedText}>
                            Transaction secured by <a href='https://stripe.com' target='_blank'>Stripe</a>
                        </p>
                    </div>
                </div>
            </main>
            <footer>
            </footer>
        </div >
    )
}
