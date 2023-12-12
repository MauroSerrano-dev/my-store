import styles from '@/styles/pages/orders/order_id.module.css'
import { useEffect, useRef, useState } from 'react'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Footer from '@/components/Footer'
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { convertTimestampToFormatDate } from '@/utils'
import { Button } from '@mui/material'
import Link from 'next/link'
import lottie from 'lottie-web';
import Image from 'next/image'
import ProductStepper from '@/components/products/ProductStepper'

export default function Orders() {
    const {
        session,
        router,
        currencies,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tOrders = useTranslation('orders').t
    const tCountries = useTranslation('countries').t

    const [order, setOrder] = useState()

    const animationContainer = useRef(null)

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
        let animation
        if (animationContainer.current) {
            animation = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('@/utils/animations/animationNoOrders.json'),
            })
        }

        return () => {
            if (animation)
                animation.destroy();
        }
    }, [session, order])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : order === undefined
                    ? <div></div>
                    : <div className={styles.container}>
                        {order
                            ? <main className={styles.main}>
                                <div className={styles.details}>
                                    <div className={styles.detailsHead}>
                                        <h2>Detalhes do pedido</h2>
                                        <div className={styles.detailsSubtitle}>
                                            <p>
                                                Pedido feito em {convertTimestampToFormatDate(order.create_at, i18n.language)}
                                            </p>
                                            <p>
                                                {tOrders('order_id')} {order.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.detailsBody}>
                                        <div className={styles.detailsBodyLeft}>
                                            <p style={{ fontWeight: 700 }}>Endereço de entrega</p>
                                            <p>{order.shipping_details.name}</p>
                                            <p>{order.shipping_details.address.line1}</p>
                                            {order.shipping_details.address.line2 && <p>{order.shipping_details.address.line2}</p>}
                                            {order.shipping_details.address.state
                                                ? <p>{order.shipping_details.address.city}, {order.shipping_details.address.state}, {order.shipping_details.address.postal_code}</p>
                                                : <p>{order.shipping_details.address.city} {order.shipping_details.address.postal_code}</p>
                                            }
                                            <p>{tCountries(order.shipping_details.address.country)}</p>
                                        </div>
                                        <div className={styles.detailsBodyRight}>
                                            <p style={{ fontWeight: 700 }}>Resumo do pedido</p>
                                            <div className={styles.detailsBodyRightItem}>
                                                <p>Subtotal:</p>
                                                <p>{currencies[order.payment_details.currency].symbol} {(order.payment_details.subtotal / 100).toFixed(2)}</p>
                                            </div>
                                            <div className={styles.detailsBodyRightItem}>
                                                <p>{tOrders('shipping_and_taxes')}</p>
                                                <p>{currencies[order.payment_details.currency].symbol} {(order.payment_details.shipping / 100).toFixed(2)}</p>
                                            </div>
                                            {!!order.payment_details.discount &&
                                                <div className={styles.detailsBodyRightItem}>
                                                    <p>Discount:</p>
                                                    <p>-{currencies[order.payment_details.currency].symbol} {(order.payment_details.discount / 100).toFixed(2)}</p>
                                                </div>
                                            }
                                            {!!order.payment_details.refund &&
                                                <div className={styles.detailsBodyRightItem}>
                                                    <p>Refund:</p>
                                                    <p>-{currencies[order.payment_details.currency].symbol} {(order.payment_details.refund / 100).toFixed(2)}</p>
                                                </div>
                                            }
                                            <div className={styles.detailsBodyRightItem}>
                                                <p style={{ fontWeight: 600 }}>Total:</p>
                                                <p style={{ fontWeight: 600 }}>{currencies[order.payment_details.currency].symbol} {((order.payment_details.total - (order.payment_details.refund || 0)) / 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className={styles.detailsBodyButtons}>
                                            <Link
                                                className='noUnderline'
                                                href={order.receipt_url}
                                                target='_blank'
                                            >
                                                <Button
                                                    variant='contained'
                                                    sx={{
                                                        width: 230
                                                    }}
                                                >
                                                    RECIBO
                                                </Button>
                                            </Link>
                                            <Button
                                                variant='contained'
                                                sx={{
                                                    width: 230
                                                }}
                                            >
                                                ACOMPANHAR PEDIDO
                                            </Button>
                                            <Button
                                                variant='contained'
                                                sx={{
                                                    width: 230
                                                }}
                                            >
                                                OBTER SUPORTE
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.products}>
                                    <div className={styles.productsHead}>
                                        <span>{`${order.products.length} entregas`}</span>
                                    </div>
                                    <div className={styles.productsBody}>
                                        {order.products.map((prod, i) =>
                                            <div
                                                key={i}
                                                className={styles.product}
                                            >
                                                <div className={styles.productHead}>
                                                    <ProductStepper product={prod} />
                                                    {prod.status === 'canceled' && <p style={{ color: 'var(--color-error)', fontWeight: 600 }}>{tOrders('canceled')}</p>}
                                                    {prod.status === 'refunded' && <p style={{ color: 'var(--color-error)', fontWeight: 600 }}>{tOrders('refunded')}</p>}
                                                </div>
                                                <div className={styles.productBody}>
                                                    <div className={styles.productBodyLeft}>
                                                        <div className={styles.productImage}>
                                                            <Image
                                                                quality={100}
                                                                src={prod.image.src}
                                                                sizes={'100%'}
                                                                fill
                                                                alt={prod.title}
                                                                style={{
                                                                    objectFit: 'cover',
                                                                    objectPosition: 'top',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={styles.productBodyRight}>
                                                        <span>{prod.title}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </main>
                            : <div
                                style={{
                                    height: 480,
                                }}
                            >
                                <div
                                    ref={animationContainer}
                                    style={{
                                        height: 400,
                                    }}
                                >
                                </div>
                                <h3>No order with this ID</h3>
                            </div>
                        }
                        <Footer />
                    </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['countries', 'orders', 'footer'])))
        }
    }
}