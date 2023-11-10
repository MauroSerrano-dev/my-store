import styles from '@/styles/pages/orders/index.module.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Order from '@/components/products/Order'
import Selector from '@/components/material-ui/Selector'
import { motion } from "framer-motion";
import { CircularProgress } from '@mui/material'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Orders(props) {
    const {
        session,
        supportsHoverAndPointer,
        currencies,
        windowWidth,
    } = props

    const tOrders = useTranslation('orders').t

    const NOW = new Date()
    const userCreateAt = new Date(session?.create_at.seconds * 1000 + session?.create_at.nanoseconds * 0.000001)

    const YEAR_DIFF = NOW.getFullYear() - userCreateAt.getFullYear()

    const [orders, setOrders] = useState()
    const [dateSelected, setDateSelected] = useState(NOW.getFullYear())
    const [datesRange, setDatesRange] = useState()

    useEffect(() => {
        if (session) {
            setDatesRange(Array(1 + YEAR_DIFF).fill(null).map((ele, i) => ({ value: NOW.getFullYear() - i, name: String(NOW.getFullYear() - i) })))
            getUserOrders()
        }
    }, [session])

    useEffect(() => {
        if (session)
            getUserOrders()
    }, [dateSelected])

    function getUserOrders() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                user_id: session.id,
                start_date: new Date(dateSelected, 0).getTime(),
                end_date: new Date(dateSelected + 1, 0).getTime(),
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

    function handleSelectYear(event) {
        setDateSelected(event.target.value)
    }

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    {orders
                        ? <main className={styles.main}>
                            <div className={styles.top}>
                                <p><b>{tOrders('order', { count: orders.length })}</b> {tOrders('placed in', { count: orders.length })}</p>
                                <Selector
                                    value={dateSelected}
                                    options={datesRange}
                                    width='100px'
                                    onChange={handleSelectYear}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    style={{
                                        height: 27,
                                        fontSize: 14,
                                        width: 85
                                    }}
                                    styleOption={{
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
                                        currencies={currencies}
                                    />
                                )}
                            </div>
                        </main>
                        : <main className={styles.main} style={{ alignItems: 'center', paddingTop: '2rem' }}>
                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0,
                                            delay: 0.2,
                                        }
                                    }
                                }}
                                initial='hidden'
                                animate='visible'
                                style={{
                                    /* zIndex: 10000, */
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    sx={{
                                        position: 'absolute',
                                        color: '#525252',
                                    }}
                                    size={60}
                                    thickness={4}
                                    value={100}
                                />
                                <CircularProgress
                                    disableShrink
                                    size={60}
                                    thickness={4}
                                    sx={{
                                        position: 'absolute',
                                        animationDuration: '750ms',
                                    }}
                                />
                            </motion.div>
                        </main>
                    }
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'orders']))
        }
    }
}