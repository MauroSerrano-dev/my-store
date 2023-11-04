import styles from '@/styles/pages/orders/index.module.css'
import Footer from '@/components/Footer'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ProductOrder from '@/components/products/ProductOrder'

export default function Orders(props) {
    const {
        session
    } = props

    const [orders, setOrders] = useState()

    function getUserOrders() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                user_id: session.id,
            }
        }

        fetch("/api/user-orders", options)
            .then(response => response.json())
            .then(response => {
                if (response.status < 300)
                    setOrders(response.orders)
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (session)
            getUserOrders()
    }, [session])

    useEffect(() => {
        console.log(orders)
    }, [orders])

    return (
        <div className={styles.container}>
            <Head>
            </Head>
            <main>
                {orders?.map((order, i) =>
                    <ProductOrder
                        order={order}
                        key={i}
                        index={i}
                    />
                )}
            </main>
        </div>
    )
}