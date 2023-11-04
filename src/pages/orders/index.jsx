import styles from '@/styles/pages/orders/index.module.css'
import Footer from '@/components/Footer'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Order from '@/components/products/Order'
import Selector from '@/components/material-ui/Selector'

export default function Orders(props) {
    const {
        session,
        supportsHoverAndPointer,
        windowWidth,
    } = props

    const NOW = new Date()
    const userCreateAt = new Date(session?.create_at.seconds * 1000 + session?.create_at.nanoseconds * 0.000001)

    const YEAR_DIFF = NOW.getFullYear() - userCreateAt.getFullYear()

    const [orders, setOrders] = useState()
    const [dateRange, setDateRange] = useState(String(NOW.getFullYear()))
    const [datesRange, setDatesRange] = useState()

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
        if (session) {
            getUserOrders()
            setDatesRange(Array(1 + YEAR_DIFF).fill(null).map((ele, i) => ({ value: String(NOW.getFullYear() - i), name: String(NOW.getFullYear() - i) })))
        }
    }, [session])

    return (
        <div className={styles.container}>
            <Head>
            </Head>
            {!orders
                ? <main></main>
                : <main className={styles.main}>
                    <div className={styles.top}>
                        <p><b>{orders?.length} {orders?.length > 1 ? 'orders' : 'order'}</b> placed in</p>
                        <Selector
                            value={dateRange}
                            options={datesRange}
                            width='100px'
                            onChange={(event) => { }}
                            supportsHoverAndPointer={supportsHoverAndPointer}
                            style={{
                                height: 27,
                                fontSize: 14,
                                width: 85
                            }}
                        />
                    </div>
                    <div className={styles.ordersContainer}>
                        {orders?.map((order, i) =>
                            <Order
                                order={order}
                                key={i}
                                index={i}
                            />
                        )}
                    </div>
                </main>
            }
        </div>
    )
}