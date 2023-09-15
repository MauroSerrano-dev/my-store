import ProductCart from '@/components/ProductCart'
import styles from '@/styles/cart.module.css'
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { Button } from '@mui/material'
import { SHIPPING_OPTIONS } from '../../consts'
import { useEffect, useState } from 'react'
import Selector from '@/components/Selector'

export default function Cart(props) {
    const { session, cart, setCart } = props

    const [shippingValue, setShippingValue] = useState(0)

    const ITEMS_TOTAL = (cart.reduce((acc, product) => acc + (product.price * product.quantity), 0) / 100).toFixed(2)

    const ORDER_TOTAL = (shippingValue + cart.reduce((acc, product) => acc + (product.price * product.quantity), 0) / 100).toFixed(2)

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

    useEffect(() => {
        getShippingValue()
    }, [cart])

    function getShippingValue() {
        const contry = 'US'
        let value = 0
        let typesAlreadyIn = []

        value = cart.reduce((acc, item, i) => {
            const result = acc + (
                typesAlreadyIn.includes(item.type)
                    ? SHIPPING_OPTIONS[contry][item.type].add_item * item.quantity
                    : SHIPPING_OPTIONS[contry][item.type].first_item + SHIPPING_OPTIONS[contry][item.type].add_item * (item.quantity - 1)
            )
            typesAlreadyIn.push(item.type)
            return result
        }
            , 0
        )

        setShippingValue(value / 100)
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
                            <Selector
                                label='Country'
                                value='US'
                                options={[
                                    { value: 'BR', name: 'Brazil' },
                                    { value: 'UK', name: 'United Kingdom' },
                                    { value: 'US', name: 'United States' },
                                ]}
                                width='170px'
                                dark
                                onChange={() => console.log()}
                            />
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
                                {shippingValue.toFixed(2)}
                            </p>
                        </div>
                        <div className={styles.orderTotalContainer}>
                            <div className={styles.detailsItem}>
                                <p>
                                    Order Total:
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
        </div>
    )
}
