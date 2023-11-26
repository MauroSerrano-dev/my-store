import styles from '@/styles/pages/orders/index.module.css'
import { useEffect, useRef, useState } from 'react'
import Order from '@/components/products/Order'
import Selector from '@/components/material-ui/Selector'
import { motion } from "framer-motion";
import { CircularProgress } from '@mui/material'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import Footer from '@/components/Footer'
import lottie from 'lottie-web';

export default function Orders(props) {
    const {
        session,
        supportsHoverAndPointer,
        currencies,
        windowWidth,
        userCurrency,
        setSession,
        router,
        loading
    } = props

    const tOrders = useTranslation('orders').t

    const animationContainer = useRef(null)

    const NOW = new Date()
    const userCreateAt = new Date(session?.create_at.seconds * 1000 + session?.create_at.nanoseconds * 0.000001)

    const YEAR_DIFF = NOW.getFullYear() - userCreateAt.getFullYear()

    const [orders, setOrders] = useState()
    const [dateSelected, setDateSelected] = useState(NOW.getFullYear())
    const [datesRange, setDatesRange] = useState()
    const [allProducts, setAllProducts] = useState()

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

    async function getAllProducts() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
        }

        const products = await fetch("/api/products/all-products", options)
            .then(response => response.json())
            .then(response => response.products)
            .catch(err => console.error(err))

        setAllProducts(products)
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../utils/animations/animationNoOrders.json'),
        })

        return () => {
            animation.destroy()
        }
    }, [orders])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404
                    autoRedirect
                    router={router}
                    loading={loading}
                />
                : <div className={styles.container}>
                    <main className={styles.main}>
                        {orders
                            ? <div
                                className='flex column fillWidth'
                                style={{
                                    gap: '1rem'
                                }}
                            >
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
                                {orders.length === 0
                                    ? <div
                                        ref={animationContainer}
                                        style={{
                                            width: '100%',
                                            height: 400,
                                        }}
                                    >
                                    </div>
                                    : <div className={styles.ordersContainer}>
                                        {orders?.map((order, i) =>
                                            <Order
                                                order={order}
                                                key={i}
                                                index={i}
                                                currencies={currencies}
                                            />
                                        )}
                                    </div>
                                }
                            </div>
                            : <motion.div
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
                                className='fillWidth'
                                style={{
                                    paddingTop: '1rem',
                                    paddingBottom: '3rem'
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
                        }
                        <div
                            className='fillWidth flex column'
                            style={{
                                gap: '0.5rem'
                            }}
                        >
                            <div>
                                <h2
                                    style={{ textAlign: 'start' }}
                                >
                                    Explore others products!
                                </h2>
                            </div>
                            <div className='fillWidth'>
                                <CarouselProducts
                                    products={allProducts}
                                    userCurrency={userCurrency}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    windowWidth={windowWidth}
                                    session={session}
                                    setSession={setSession}
                                />
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'orders', 'footer', 'toasts']))
        }
    }
}