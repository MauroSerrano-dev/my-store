import styles from '@/styles/pages/orders/index.module.css'
import { useEffect, useState } from 'react'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Footer from '@/components/Footer'
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';

export default function Orders() {
    const {
        session,
        router,
    } = useAppContext()

    const tOrders = useTranslation('orders').t

    const [order, setOrder] = useState()

    function getOrder() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                order_id: router.query.order_id,
            }
        }

        fetch("/api/order", options)
            .then(response => response.json())
            .then(response => {
                setOrder(response.data)
            })
            .catch(err => {
                console.error(err)
                setOrder(null)
            })
    }

    useEffect(() => {
        getOrder()
    }, [])
    useEffect(() => {
        console.log('order', order)
    }, [order])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <main className={styles.main}>
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