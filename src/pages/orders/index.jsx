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
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES, LIMITS } from '@/consts';
import { getOrdersByUserId } from '../../../frontend/orders';
import { getAllProducts, getProductsInfo } from '../../../frontend/product';
import { showToast } from '@/utils/toasts';
import { orderProductModel } from '@/utils/models';
import { convertTimestampToDate } from '@/utils';

export default function Orders() {
    const {
        session,
    } = useAppContext()

    const tOrders = useTranslation('orders').t
    const tToasts = useTranslation('toasts').t

    const animationContainer = useRef(null)

    const NOW = new Date()
    const userCreateAt = new Date(convertTimestampToDate(session?.create_at))

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

    useEffect(() => {
        getAllProductsCall()
    }, [])


    async function getUserOrders() {
        try {
            const inicialOrders = await getOrdersByUserId(session.id, new Date(dateSelected, 0).getTime(), new Date(dateSelected + 1, 0).getTime())
            const ordersRes = inicialOrders.map(order => ({
                ...order,
                products: order.products.map(prod => (
                    orderProductModel(prod)
                ))
            }))
            setOrders(ordersRes)
        }
        catch (error) {
            console.error(error)
            setOrders(null)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    function handleSelectYear(event) {
        setDateSelected(event.target.value)
    }

    async function getAllProductsCall() {
        try {
            const response = await getAllProducts({
                prods_limit: LIMITS.max_products_in_carousel,
            })
            setAllProducts(response.products)
        }
        catch (error) {
            console.error(error)
            setAllProducts(null)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }


    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('@/utils/animations/animationNoOrders.json'),
        })

        return () => {
            animation.destroy()
        }
    }, [orders])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
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
                                        style={{
                                            height: 28,
                                            fontSize: 14,
                                            width: 85,
                                            paddingTop: 0.7,
                                        }}
                                        styleOption={{
                                            height: 28,
                                            fontSize: 14,
                                            width: 85
                                        }}
                                        styleForm={{
                                            paddingBottom: 0.7
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
                                className='flex center fillWidth'
                                style={{
                                    height: 400,
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    sx={{
                                        position: 'absolute',
                                        color: '#525252',
                                    }}
                                    size={80}
                                    thickness={4}
                                    value={100}
                                />
                                <CircularProgress
                                    disableShrink
                                    size={80}
                                    thickness={4}
                                    sx={{
                                        position: 'absolute',
                                        animationDuration: '750ms',
                                    }}
                                />
                            </motion.div>
                        }
                        <div
                            className={styles.carouselContainer}
                            style={{
                                gap: '0.5rem'
                            }}
                        >
                            <div>
                                <h2
                                    style={{ textAlign: 'start' }}
                                >
                                    {tOrders('explore_others_products')}
                                </h2>
                            </div>
                            <div className='fillWidth'>
                                <CarouselProducts
                                    products={allProducts}
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
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['orders', 'footer'])))
        }
    }
}