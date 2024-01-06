import styles from '@/styles/pages/order-status.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { COMMON_TRANSLATES } from '@/consts'
import Footer from '@/components/Footer'
import TextInput from '@/components/material-ui/TextInput'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/components/contexts/AppContext'
import { LoadingButton } from '@mui/lab'
import Order from '@/components/products/Order'
import { showToast } from '@/utils/toasts'
import { useTranslation } from 'next-i18next'

export default function OrderStatus() {

    const {
        router,
        windowWidth,
    } = useAppContext()

    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState()
    const [loading, setLoading] = useState()

    const tToasts = useTranslation('toasts').t
    const tOrderStatus = useTranslation('order-status').t

    useEffect(() => {
        setOrder()
        if (router.query.id) {
            setOrderId(router.query.id)
            getOrder()
        }
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

        fetch("/api/orders/limit-info", options)
            .then(response => response.json())
            .then(response => {
                if (response.error)
                    showToast({ type: 'error', msg: tToasts(response.error) })
                setOrder(response.data)
                setLoading(false)
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
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
                <h2>
                    {tOrderStatus('title')}
                </h2>
                <div
                    className={styles.inputAndButton}
                >
                    <TextInput
                        label={tOrderStatus('order_id')}
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
                        {tOrderStatus('search')}
                    </LoadingButton>
                </div>
                <div className={styles.order}>
                    {order &&
                        <Order
                            order={order}
                            hideInfos
                        />
                    }
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['order-status', 'footer', 'orders'])))
        }
    }
}