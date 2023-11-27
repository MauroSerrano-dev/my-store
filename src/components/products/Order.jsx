import styles from '@/styles/components/products/Order.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import styled from '@emotion/styled';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { PRODUCTS_TYPES, SIZES_POOL, COLORS_POOL, STEPS_ATTEMPT, STEPS } from '../../../consts';
import { useTranslation } from 'next-i18next'
import { convertTimestampToFormatDate } from '@/utils';

export default function Order(props) {
    const {
        order,
        index,
        currencies,
    } = props

    const { i18n } = useTranslation()

    const createAt = convertTimestampToFormatDate(order.create_at, i18n.language)

    const QontoConnector = styled(StepConnector)(() => ({
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: 'var(--primary)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#999999',
            borderTopWidth: 2,
            borderRadius: 1,
        },
    }))

    return (
        <motion.div
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
                        delay: 0.3 * index,
                    }
                }
            }}
            initial='hidden'
            animate='visible'
        >
            <div className={styles.head}>
                <div className={styles.headLeft}>
                    <div>
                        <p style={{ fontSize: 12, textAlign: 'start' }}>
                            ORDER PLACED
                        </p>
                        <p style={{ textAlign: 'start' }}>
                            {createAt}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: 12, textAlign: 'start' }}>
                            TOTAL
                        </p>
                        <p style={{ textAlign: 'start' }}>
                            {`${currencies[order.amount.currency].symbol} ${order.amount.amount_total / 100}`}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: 12, textAlign: 'start' }}>
                            SHIP TO
                        </p>
                        <p style={{ textAlign: 'start' }}>
                            {order.customer.name}
                        </p>
                    </div>
                </div>
                <div className={styles.headRight}>
                    <p style={{ fontSize: 12, textAlign: 'start' }}>
                        ORDER #{order.id}
                    </p>
                    <div className='flex center row' style={{ gap: '0.5rem' }}>
                        <Button
                            size='small'
                            color='primary'
                        >
                            Report Problem
                        </Button>
                        {!order.products.every(prod => prod.status === 'shipment-delivered') && !order.products.every(prod => prod.status === 'canceled') &&
                            (
                                order.shipments
                                    ? <Link
                                        href={order.shipments[0].url}
                                        target='_blank'
                                    >
                                        <Button
                                            size='small'
                                        >
                                            Track Product
                                        </Button>
                                    </Link>
                                    : <Button
                                        size='small'
                                        disabled={true}
                                    >
                                        Track Product
                                    </Button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={styles.body}>
                {order.products.map((product, j) =>
                    <div
                        className={styles.product}
                        key={j}
                    >
                        {product.status !== 'canceled' &&
                            <Stepper
                                connector={<QontoConnector />}
                            >
                                {(product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).map((step, i) => (
                                    <Step
                                        key={step.id}
                                        completed={i <= (product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step.id === product.status)}
                                        sx={{
                                            '.MuiSvgIcon-root': {
                                                color: i <= (product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step.id === product.status) ? 'var(--primary)' : '#999999',
                                            },
                                            '.MuiStepIcon-text': {
                                                fill: i <= (product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step.id === product.status) ? 'var(--primary)' : 'var(--background-color)',
                                                fontWeight: 600,
                                            },
                                        }}
                                    >
                                        <StepLabel
                                            sx={{
                                                '.MuiStepLabel-label': {
                                                    cursor: 'default',
                                                    color: i <= (product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step.id === product.status) ? 'var(--primary) !important' : '#999999',
                                                    fontWeight: i <= (product.status === 'shipment-delivery-attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step.id === product.status) ? 600 : 400,
                                                }
                                            }}
                                        >
                                            {step.title}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        }
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
                                        priority
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
                                <div>
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
                                            fontWeight: 600
                                        }}
                                    >
                                        {product.title} ({PRODUCTS_TYPES.find(type => type.id === product.type_id).title})
                                    </Link>
                                    {product.status === 'canceled' &&
                                        <p
                                            style={{
                                                color: 'var(--color-error)',
                                                fontSize: 17,
                                                textAlign: 'start',
                                            }}>
                                            Canceled
                                        </p>
                                    }
                                    <p className='text-start' style={{ fontSize: 14 }}>Color: <span style={{ fontWeight: 600 }}>{COLORS_POOL[product.variant.color_id].title}</span></p>
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
        </motion.div >
    )
}