import styles from '@/styles/pages/order-status.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { COMMON_TRANSLATES } from '@/consts'
import Footer from '@/components/Footer'
import TextInput from '@/components/material-ui/TextInput'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/components/contexts/AppContext'
import { LoadingButton } from '@mui/lab'
import Order from '@/components/products/Order'

export default function OrderStatus() {

    const {
        router,
        windowWidth,
    } = useAppContext()

    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState()
    const [loading, setLoading] = useState()

    useEffect(() => {
        setOrder()
        if (router.query.id)
            getOrder()
    }, [router])

    function getOrder() {
        setLoading(true)

        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                order_id: router.query.id,
            }
        }

        fetch("/api/order", options)
            .then(response => response.json())
            .then(response => {
                setOrder(response.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setOrder(null)
                setLoading(false)
            })
    }

    function handleSearch() {
        router.push(
            {
                pathname: router.pathname,
                query: { id: orderId }
            },
            undefined,
            { scroll: false }
        )
    }

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <h2>Search Order ID</h2>
                <div
                    className={styles.inputAndButton}
                >
                    <TextInput
                        label='Order ID'
                        value={orderId}
                        onChange={event => setOrderId(event.target.value)}
                        size='small'
                        style={{
                            width: windowWidth > 851 ? '400px' : '100%'
                        }}
                    />
                    <LoadingButton
                        loading={loading}
                        variant='contained'
                        onClick={handleSearch}
                        sx={{
                            width: windowWidth > 851 ? 'auto' : '100%'
                        }}
                    >
                        Search
                    </LoadingButton>
                </div>
                {order &&
                    <Order
                        order={order}
                        hideInfos
                    />
                }
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer', 'orders'])))
        }
    }
}