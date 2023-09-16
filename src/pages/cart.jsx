import ProductCart from '@/components/ProductCart'
import styles from '@/styles/cart.module.css'
import { Button } from '@mui/material'
import { getShippingOptions } from '../../consts'
import { useEffect, useState } from 'react'
import Selector from '@/components/Selector'

export default function Cart(props) {
    const { session, cart, setCart } = props

    const [shippingValue, setShippingValue] = useState(0)
    const [shippingContry, setShippingContry] = useState('US')

    const ITEMS_TOTAL = (cart.reduce((acc, product) => acc + (product.price * product.quantity), 0) / 100).toFixed(2)

    const ORDER_TOTAL = ((shippingValue + cart.reduce((acc, product) => acc + (product.price * product.quantity), 0)) / 100).toFixed(2)

    function handleCheckout(cart) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartItems: cart,
                cancel_url: window.location.href,
                customer: session,
                shippingValue: shippingValue,
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
    }, [cart, shippingContry])

    function getShippingValue() {
        const contry = getShippingOptions(shippingContry)
        let value = 0
        let typesAlreadyIn = []

        value = cart.reduce((acc, item, i) => {
            const result = acc + (
                typesAlreadyIn.includes(item.type)
                    ? contry[item.type].add_item * item.quantity
                    : contry[item.type].first_item + contry[item.type].add_item * (item.quantity - 1)
            )
            typesAlreadyIn.push(item.type)
            return result
        }
            , 0
        )

        setShippingValue(value)
    }

    function handleChangeContrySelector(event) {
        setShippingContry(event.target.value)
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
                                value={shippingContry}
                                options={[
                                    { value: 'BR', name: 'Brazil' },
                                    { value: 'DE', name: 'Germany' },
                                    { value: 'PL', name: 'Poland' },
                                    { value: 'UK', name: 'United Kingdom' },
                                    { value: 'US', name: 'United States' },
                                ]}
                                width='170px'
                                dark
                                onChange={handleChangeContrySelector}
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
                                {(shippingValue / 100).toFixed(2)}
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
