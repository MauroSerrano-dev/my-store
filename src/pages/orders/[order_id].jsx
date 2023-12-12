import styles from '@/styles/pages/orders/order_id.module.css'
import { useEffect, useState } from 'react'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Footer from '@/components/Footer'
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { convertTimestampToFormatDate } from '@/utils'
import { Button } from '@mui/material'
import Link from 'next/link'

export default function Orders() {
    const {
        session,
        router,
        currencies,
    } = useAppContext()

    const { i18n } = useTranslation()
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
    
    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : !order
                    ? <div></div>
                    : <div className={styles.container}>
                        <main className={styles.main}>
                            <div>
                                <div>
                                    <h2>Detalhes do pedido</h2>
                                    <div>
                                        <p>
                                            Pedido feito em {convertTimestampToFormatDate(order.create_at, i18n.language)}
                                        </p>
                                        <p>
                                            {tOrders('order_id')} {order.id}
                                        </p>
                                        <Link
                                            className='noUnderline'
                                            href={order.receipt_url}
                                            target='_blank'
                                        >
                                            <Button
                                                variant='contained'
                                            >
                                                FATURA
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.detailsBody}>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>Morada de entrega</p>
                                        <p>{order.shipping_details.name}</p>
                                        <p>{order.shipping_details.address.line1}</p>
                                        {order.shipping_details.address.line2 && <p>{order.shipping_details.address.line2}</p>}
                                        {order.shipping_details.address.state
                                            ? <p>{order.shipping_details.address.city}, {order.shipping_details.address.state}, {order.shipping_details.address.country}, {order.shipping_details.address.postal_code}</p>
                                            : <p>{order.shipping_details.address.city}, {order.shipping_details.address.country} {order.shipping_details.address.postal_code}</p>
                                        }
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>Resumo do pedido</p>
                                        <p>Subtotal: {currencies[order.payment_details.currency].symbol} {(order.payment_details.subtotal / 100).toFixed(2)}</p>
                                        <p>{tOrders('shipping_and_taxes')} {currencies[order.payment_details.currency].symbol} {(order.payment_details.shipping / 100).toFixed(2)}</p>
                                        {!!order.payment_details.discount &&
                                            <p>Discount: -{currencies[order.payment_details.currency].symbol} {(order.payment_details.discount / 100).toFixed(2)}</p>
                                        }
                                        {!!order.payment_details.refund &&
                                            <p>Refund: -{currencies[order.payment_details.currency].symbol} {(order.payment_details.refund / 100).toFixed(2)}</p>
                                        }
                                        <p>Total: {currencies[order.payment_details.currency].symbol} {((order.payment_details.total - (order.payment_details.refund || 0)) / 100).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {order.products.map((prod, i) =>
                                    <div
                                        key={i}
                                    >
                                        {prod.title}
                                    </div>
                                )}
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