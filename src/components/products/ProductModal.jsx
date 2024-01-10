import styles from '@/styles/components/products/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { SIZES_POOL, COLORS_POOL, CART_LOCAL_STORAGE } from '@/consts';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAppContext } from '../contexts/AppContext';
import { showToast } from '@/utils/toasts';
import { getProductPriceUnit } from '@/utils/prices';
import ProductTag from './ProductTag';
import MyTooltip from '../MyTooltip';
import { deleteProductFromCart } from '../../../frontend/cart';
import { isSameProduct } from '@/utils';

export default function ProductModal(props) {
    const {
        product,
        index,
    } = props

    const {
        userCurrency,
        setCart,
        session,
        cart,
    } = useAppContext()

    const tCommon = useTranslation('common').t
    const tColors = useTranslation('colors').t
    const tToasts = useTranslation('toasts').t

    const PRICE_UNIT = getProductPriceUnit(product, product.variant, userCurrency?.rate)

    const PRICE = PRICE_UNIT * product.quantity

    const COLOR = COLORS_POOL[product.variant.color_id]
    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    const [deleting, setDeleting] = useState(false)

    async function handleDeleteProductFromCart() {
        try {
            setDeleting(true)
            if (session) {
                await deleteProductFromCart(cart.id, product)
            }
            else {
                const visitantCart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))
                localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify({ ...visitantCart, products: visitantCart.products.filter(prod => !isSameProduct(prod, product)) }))
            }
            setCart(prev => ({ ...prev, products: prev.products.filter(prod => !isSameProduct(prod, product)) }))
        }
        catch (error) {
            console.error(error)
            setDeleting(false)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) })
        }
    }

    return (
        <motion.div
            className={styles.container}
            variants={{
                hidden: {
                    opacity: 0,
                    y: 20,
                },
                visible: {
                    opacity: deleting ? 0.7 : 1,
                    y: 0,
                }
            }}
            transition={{
                duration: deleting ? 0.1 : 0.3,
                delay: deleting ? 0 : 0.1 + 0.3 * (index === 0 ? 0 : 1),
            }}
            initial='hidden'
            animate='visible'
            style={{
                pointerEvents: deleting ? 'none' : 'auto'
            }}
        >
            <MyTooltip
                title={tCommon('remove_from_cart')}
                style={{
                    zIndex: 1800
                }}
            >
                <button
                    className='flex center buttonInvisible'
                    style={{
                        position: 'absolute',
                        top: '0.8rem',
                        right: '0.3rem',
                        zIndex: 10,
                    }}
                >
                    <SlClose
                        onClick={handleDeleteProductFromCart}
                        color='#ffffff'
                        style={{
                            fontSize: '15px',
                            color: 'var(--global-black)',
                        }}
                    />
                </button>
            </MyTooltip>
            <Link
                className={styles.imageContainer}
                href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                    ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                    : SIZE.id !== product.default_variant.size_id
                        ? `?sz=${SIZE.title.toLowerCase()}`
                        : COLOR.id !== product.default_variant.color_id
                            ? `?cl=${COLOR.id_string}`
                            : ''
                    }`}
            >
                <div
                    style={{
                        position: 'relative',
                        width: 108 * 0.9,
                        height: 108,
                    }}
                >
                    <Image
                        quality={100}
                        src={product.image_src}
                        alt={product.title}
                        fill
                        sizes='108px'
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </div>
            </Link>
            <div className={styles.right}>
                <div className='flex column start'>
                    <Link
                        href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                            ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                            : SIZE.id !== product.default_variant.size_id
                                ? `?sz=${SIZE.title.toLowerCase()}`
                                : COLOR.id !== product.default_variant.color_id
                                    ? `?cl=${COLOR.id_string}`
                                    : ''
                            }`}
                    >
                        <p className='ellipsisThree text-start' style={{ fontSize: 12, fontWeight: 700 }}>{product.title}</p>
                    </Link>
                    <ProductTag product={product} style={{ fontSize: 11 }} />
                    {product.promotion &&
                        <div style={{ paddingTop: 2 }}>
                            <ProductTag product={product} style={{ fontSize: 11 }} promotion={product.promotion} />
                        </div>
                    }
                </div>
                <div className={styles.infos}>
                    <p>
                        {tCommon('Size')}: <span style={{ fontWeight: 500 }}>{SIZE.title}</span>
                    </p>
                    <p>
                        {tCommon('Color')}: <span style={{ fontWeight: 500 }}>{tColors(COLOR.id_string)}</span>
                    </p>
                    <p>
                        {tCommon('Quantity')}: <span style={{ fontWeight: 500 }}>{product.quantity}</span>
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    {product.quantity > 1 &&
                        <p style={{ fontSize: '10px', color: 'var(--text-black)' }}>
                            {`${userCurrency?.symbol} ${(PRICE_UNIT / 100).toFixed(2)} ${tCommon('unit', { count: 2 })}`}
                        </p>
                    }
                    <p
                        style={{
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        {`${userCurrency?.symbol} ${(PRICE / 100).toFixed(2)}`}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}