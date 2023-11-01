import styles from '@/styles/pages/orders/index.module.css'
import Footer from '@/components/Footer'
import Head from 'next/head'
import { useEffect } from 'react'

export default function Orders(props) {
    const {
        session
    } = props

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
            .then(response => console.log('orderRes', response))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (session)
            getUserOrders()
    }, [session])

    return (
        <div className={styles.container}>
            <Head>
            </Head>
            <main>
            </main>
            <Footer />
        </div>
    )
}