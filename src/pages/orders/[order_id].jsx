import styles from '@/styles/pages/orders/order_id.module.css'
import { useEffect, useRef, useState } from 'react'
import NoFound404 from '../../components/NoFound404'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Footer from '@/components/Footer'
import { useAppContext } from '@/components/contexts/AppContext';
import { COLORS_POOL, COMMON_TRANSLATES, SIZES_POOL } from '@/consts';
import { convertTimestampToFormatDate, convertTimestampToFormatDateNoYear } from '@/utils'
import Link from 'next/link'
import lottie from 'lottie-web';
import Image from 'next/image'
import ProductStepper from '@/components/products/ProductStepper'
import ProductTag from '@/components/products/ProductTag'
import MyButton from '@/components/material-ui/MyButton'
import { getOrderById } from '../../../frontend/orders'
import { showToast } from '@/utils/toasts'
import { getProductsInfo } from '../../../frontend/product'

export default function Orders() {
    const {
        session,
        router,
        currencies,
        windowWidth,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tOrders = useTranslation('orders').t
    const tCountries = useTranslation('countries').t
    const tColors = useTranslation('colors').t
    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    const [order, setOrder] = useState()

    const animationContainer = useRef(null)

    async function getOrder() {
        try {
            const order = await getOrderById(router.query.order_id)
            const productsFullInfo = await getProductsInfo(order.products)
            setOrder({ ...order, products: productsFullInfo })
        }
        catch (error) {
            console.error(error)
            setOrder(null)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) })
        }
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
                                            <div className={styles.detailsBodyLeftBody}>
                                                <p>{order.shipping_details.name}</p>
                                                <p>{order.shipping_details.address.line1}</p>
                                                {order.shipping_details.address.line2 && <p>{order.shipping_details.address.line2}</p>}
                                                {order.shipping_details.address.state
                                                    ? <p>{order.shipping_details.address.city}, {order.shipping_details.address.state}, {order.shipping_details.address.postal_code}</p>
                                                    : <p>{order.shipping_details.address.city} {order.shipping_details.address.postal_code}</p>
                                                }
                                                <p>{tCountries(order.shipping_details.address.country)}</p>
                                            </div>
                                        </div>
                                        <div className={styles.detailsBodyRight}>
                                            <p style={{ fontWeight: 700 }}>Resumo do pedido</p>
                                            <div className={styles.detailsRightItems}>
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
                                                        <p>-{currencies[order.payment_details.currency].symbol} {(order.payment_details.refund.amount / 100).toFixed(2)}</p>
                                                    </div>
                                                }
                                                <div className={styles.detailsBodyRightItem}>
                                                    <p style={{ fontWeight: 600 }}>Total:</p>
                                                    <p style={{ fontWeight: 600 }}>{currencies[order.payment_details.currency].symbol} {((order.payment_details.total - (order.payment_details.refund?.amount || 0)) / 100).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.detailsBodyButtons}>
                                            <Link
                                                className='noUnderline'
                                                href={order.receipt_url}
                                                target='_blank'
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <MyButton
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    RECIBO
                                                </MyButton>
                                            </Link>
                                            {order.shipments && order.products.some(prod => prod.status !== 'shipment-delivered' && prod.status !== 'canceled' && prod.status !== 'refunded') &&
                                                <Link
                                                    className='noUnderline'
                                                    href={order.shipments.url}
                                                    target='_blank'
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <MyButton
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        ACOMPANHAR PEDIDO
                                                    </MyButton>
                                                </Link>
                                            }
                                            <Link
                                                aria-label='get support'
                                                href='/support'
                                                className='noUnderline fill'
                                            >
                                                <MyButton
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    OBTER SUPORTE
                                                </MyButton>
                                            </Link>
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
                                                {prod.status !== 'canceled' && prod.status !== 'refunded' && windowWidth >= 1075 &&
                                                    <div className={styles.productHead}>
                                                        <ProductStepper product={prod} />
                                                    </div>
                                                }
                                                <div className={styles.productBody}>
                                                    <div className={styles.productBodyLeft}>
                                                        <Link
                                                            href={`/product/${prod.id}${prod.variant.color_id !== prod.default_variant.color_id && prod.variant.size_id !== prod.default_variant.size_id
                                                                ? `?sz=${SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title.toLowerCase()}&cl=${COLORS_POOL[prod.variant.color_id].id_string}`
                                                                : prod.variant.size_id !== prod.default_variant.size_id
                                                                    ? `?sz=${SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title.toLowerCase()}`
                                                                    : prod.variant.color_id !== prod.default_variant.color_id
                                                                        ? `?cl=${COLORS_POOL[prod.variant.color_id].id_string}`
                                                                        : ''
                                                                }`
                                                            }
                                                            className={`${styles.productImage} noUnderline`}
                                                        >
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
                                                        </Link>
                                                    </div>
                                                    <div className={styles.productBodyRight}>
                                                        <Link
                                                            href={`/product/${prod.id}${prod.variant.color_id !== prod.default_variant.color_id && prod.variant.size_id !== prod.default_variant.size_id
                                                                ? `?sz=${SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title.toLowerCase()}&cl=${COLORS_POOL[prod.variant.color_id].id_string}`
                                                                : prod.variant.size_id !== prod.default_variant.size_id
                                                                    ? `?sz=${SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title.toLowerCase()}`
                                                                    : prod.variant.color_id !== prod.default_variant.color_id
                                                                        ? `?cl=${COLORS_POOL[prod.variant.color_id].id_string}`
                                                                        : ''
                                                                }`
                                                            }
                                                            className='ellipsis'
                                                            style={{
                                                                fontWeight: 600,
                                                                width: windowWidth <= 650 ? '100%' : 'auto',
                                                            }}
                                                        >
                                                            {prod.title}
                                                        </Link>
                                                        <ProductTag product={prod} />
                                                        {prod.status === 'canceled' && <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>{tOrders('canceled')}</span>}
                                                        {prod.status === 'refunded' && <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{tOrders('refunded')}</span>}
                                                        <p className={styles.productItem}>{tCommon('Color')}: <span style={{ fontWeight: 600 }}>{tColors(COLORS_POOL[prod.variant.color_id].id_string)}</span></p>
                                                        <p className={styles.productItem}>{tCommon('Size')}: <span style={{ fontWeight: 600 }}>{SIZES_POOL.find(sz => sz.id === prod.variant.size_id).title}</span></p>
                                                        <p className={styles.productItem}>{tCommon('Quantity')}: <span style={{ fontWeight: 600 }}>{prod.quantity}</span></p>
                                                        <p style={{ fontSize: 12, textAlign: 'start' }}>{tCommon('Last Update')}: {convertTimestampToFormatDateNoYear(prod.updated_at, i18n.language)}</p>
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
                    </div >
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['countries', 'orders', 'footer'])))
        }
    }
}