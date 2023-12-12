import styles from '@/styles/components/products/Order.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { Button} from '@mui/material';
import { SIZES_POOL, COLORS_POOL } from '@/consts';
import { useTranslation } from 'next-i18next'
import { convertTimestampToFormatDate, convertTimestampToFormatDateNoYear } from '@/utils';
import { useAppContext } from '../contexts/AppContext';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import ProductTag from '../ProductTag';
import ProductStepper from './ProductStepper';

export default function Order(props) {
    const {
        order,
        index,
    } = props

    const {
        currencies,
        supportsHoverAndPointer,
        windowWidth,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tOrders = useTranslation('orders').t
    const tColors = useTranslation('colors').t

    const [shipToModalOpen, setShipToModalOpen] = useState(false)

    const createAt = convertTimestampToFormatDate(order.create_at, i18n.language)

    function handleShipToMouseEnter() {
        if (supportsHoverAndPointer)
            setShipToModalOpen(true)
    }

    function handleShipToMouseLeave() {
        setShipToModalOpen(false)
    }

    function handleShipToOnClick() {
        setShipToModalOpen(prev => !prev)
    }

    return (
        windowWidth > 851
            ? <motion.div
                className={styles.container}
                variants={{
                    hidden: {
                        opacity: 0,
                        y: 20,
                    },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.3,
                            delay: 0.3 * (index <= 2 ? index : 3),
                        }
                    }
                }}
                initial='hidden'
                animate='visible'
            >
                <div className={styles.head}>
                    <div className={styles.headLeft}>
                        <div className={styles.leftBlock}>
                            <p style={{ fontSize: 12, textAlign: 'start' }}>
                                {tOrders('order_placed')}
                            </p>
                            <p style={{ textAlign: 'start' }}>
                                {createAt}
                            </p>
                        </div>
                        <div className={styles.leftBlock}>
                            <p style={{ fontSize: 12, textAlign: 'start' }}>
                                {tOrders('total')}
                            </p>
                            <p style={{ textAlign: 'start' }}>
                                {`${currencies[order.payment_details.currency].symbol} ${(order.payment_details.total / 100).toFixed(2)}`}
                            </p>
                        </div>
                        <div className={styles.leftBlock}>
                            <p style={{ fontSize: 12, textAlign: 'start' }}>
                                {tOrders('ship_to')}
                            </p>
                            <div
                                className={`${styles.shipToName} ${shipToModalOpen ? styles.shipToNameActive : ''}`}
                                onMouseEnter={handleShipToMouseEnter}
                                onMouseLeave={handleShipToMouseLeave}
                            >
                                <p
                                    onClick={handleShipToOnClick}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    {order.shipping_details.name}
                                </p>
                                <KeyboardArrowDownOutlinedIcon
                                    onClick={handleShipToOnClick}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'transform ease-in-out 150ms',
                                        transform: shipToModalOpen
                                            ? 'rotateZ(180deg)'
                                            : 'none'
                                    }}
                                />
                                {shipToModalOpen &&
                                    <motion.div
                                        className={styles.shipToModalContainer}
                                        initial='hidden'
                                        animate='visible'
                                        variants={{
                                            hidden: {
                                                opacity: 0,
                                            },
                                            visible: {
                                                opacity: 1,
                                            }
                                        }}
                                    >
                                        <div className={styles.pointer}>
                                        </div>
                                        <div className={styles.shipToModal}>
                                            <p style={{ fontWeight: 700 }}>{order.shipping_details.name}</p>
                                            <p>{order.shipping_details.address.line1}</p>
                                            {order.shipping_details.address.line2 && <p>{order.shipping_details.address.line2}</p>}
                                            {order.shipping_details.address.state
                                                ? <p>{order.shipping_details.address.city}, {order.shipping_details.address.state}, {order.shipping_details.address.country}, {order.shipping_details.address.postal_code}</p>
                                                : <p>{order.shipping_details.address.city}, {order.shipping_details.address.country} {order.shipping_details.address.postal_code}</p>
                                            }
                                        </div>
                                    </motion.div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.headRight}>
                        <div className={styles.rightBlock}>
                            <Link
                                href={`/orders/${order.id}`}
                                className='fillWidth noUnderline'
                            >
                                <Button
                                    variant='contained'
                                    size='small'
                                    color='primary'
                                    sx={{
                                        width: '100%',
                                        fontWeight: 600,
                                    }}
                                >
                                    {tOrders('order_details')}
                                </Button>
                            </Link>
                            <div className='flex row center' style={{ gap: '0.3rem' }}>
                                <p style={{ fontSize: 12 }}>
                                    {tOrders('order_id')}
                                </p>
                                <p style={{ fontSize: 12 }}>
                                    {order.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.body}>
                    {order.products.map((product, j) =>
                        <div
                            className={styles.product}
                            key={j}
                        >
                            <ProductStepper product={product} />
                            <div className={styles.productInfos}>
                                <div className={styles.productInfosLeft}>
                                    <Link
                                        href={`/product/${product.id}${product.variant.color_id !== product.default_variant.color_id && product.variant.size_id !== product.default_variant.size_id
                                            ? `?sz=${SIZES_POOL.find(sz => sz.id === product.variant.size_id).title.toLowerCase()}&cl=${COLORS_POOL[product.variant.color_id].id_string}`
                                            : product.variant.size_id !== product.default_variant.size_id
                                                ? `?sz=${SIZES_POOL.find(sz => sz.id === product.variant.size_id).title.toLowerCase()}`
                                                : product.variant.color_id !== product.default_variant.color_id
                                                    ? `?cl=${COLORS_POOL[product.variant.color_id].id_string}`
                                                    : ''
                                            }`
                                        }
                                        className='noUnderline'
                                        style={{
                                            position: 'relative',
                                            height: 100,
                                            width: 100,
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Image
                                            quality={100}
                                            src={product.image.src}
                                            sizes={'100px'}
                                            fill
                                            alt={product.title}
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: 'top',
                                            }}
                                        />
                                    </Link>
                                    <div className='flex column start' style={{ gap: 2 }}>
                                        <div className='flex row center' style={{ gap: 8 }}>
                                            <Link
                                                href={`/product/${product.id}${product.variant.color_id !== product.default_variant.color_id && product.variant.size_id !== product.default_variant.size_id
                                                    ? `?sz=${SIZES_POOL.find(sz => sz.id === product.variant.size_id).title.toLowerCase()}&cl=${COLORS_POOL[product.variant.color_id].id_string}`
                                                    : product.variant.size_id !== product.default_variant.size_id
                                                        ? `?sz=${SIZES_POOL.find(sz => sz.id === product.variant.size_id).title.toLowerCase()}`
                                                        : product.variant.color_id !== product.default_variant.color_id
                                                            ? `?cl=${COLORS_POOL[product.variant.color_id].id_string}`
                                                            : ''
                                                    }`
                                                }
                                                style={{
                                                    fontWeight: 500
                                                }}
                                            >
                                                {product.title}
                                            </Link>
                                            <ProductTag product={product} />
                                        </div>
                                        {product.status === 'canceled' &&
                                            <p
                                                style={{
                                                    color: 'var(--color-error)',
                                                    fontSize: 17,
                                                    textAlign: 'start',
                                                }}>
                                                {tOrders('canceled')}
                                            </p>
                                        }
                                        {product.status === 'refunded' &&
                                            <p
                                                style={{
                                                    color: 'var(--color-warning)',
                                                    fontSize: 17,
                                                    textAlign: 'start',
                                                }}>
                                                {tOrders('refunded')}
                                            </p>
                                        }
                                        <p className='text-start' style={{ fontSize: 14 }}>Color: <span style={{ fontWeight: 600 }}>{tColors(COLORS_POOL[product.variant.color_id].id_string)}</span></p>
                                        <p className='text-start' style={{ fontSize: 14 }}>Size: <span style={{ fontWeight: 600 }}>{SIZES_POOL.find(sz => sz.id === product.variant.size_id).title}</span></p>
                                        <p className='text-start' style={{ fontSize: 14 }}>Quantity: <span style={{ fontWeight: 600 }}>{product.quantity}</span></p>
                                    </div>
                                </div>
                                <div className={styles.productInfosRight}>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
            : <motion.div
                className={styles.containerMobile}
                variants={{
                    hidden: {
                        opacity: 0,
                        y: 20,
                    },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.3,
                            delay: 0.3 * (index <= 2 ? index : 3),
                        }
                    }
                }}
                initial='hidden'
                animate='visible'
            >
                <Link
                    href={`/orders/${order.id}`}
                    className='fillWidth noUnderline'
                >
                    <div className={styles.headMobile}>
                        <p style={{ fontSize: 12, textAlign: 'start' }}>
                            {tOrders('order_placed')}
                        </p>
                        <p style={{ textAlign: 'start' }}>
                            {createAt}
                        </p>
                    </div>
                    <div className={styles.body}>
                        {order.products.map((product, i) =>
                            <div
                                className={styles.product}
                                key={i}
                            >
                                <div
                                    className='flex row center'
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: 100,
                                            width: 100,
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Image
                                            quality={100}
                                            src={product.image.src}
                                            sizes={'100px'}
                                            fill
                                            alt={product.title}
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: 'top',
                                            }}
                                        />
                                    </div>
                                    <div className='flex column' style={{ gap: 3, padding: '0rem 1rem', justifyContent: 'center', alignItems: 'flex-start', width: 'calc(100% - 100px)' }}>
                                        <p className='ellipsis' style={{ fontWeight: 600 }}>{product.title}</p>
                                        <ProductTag product={product} />
                                        <p style={{ fontSize: 12, textAlign: 'start' }}>{tOrders(product.status)}</p>
                                        <p style={{ fontSize: 12, textAlign: 'start' }}>{convertTimestampToFormatDateNoYear(product.updated_at, i18n.language)}</p>
                                    </div>
                                    <ArrowForwardIosOutlinedIcon />
                                </div>
                            </div>
                        )}
                    </div>
                </Link>
            </motion.div>
    )
}