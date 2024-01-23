import styles from '@/styles/components/products/ProductCart.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { SIZES_POOL, COLORS_POOL, LIMITS } from '@/consts';
import Image from 'next/image';
import Selector from '../material-ui/Selector';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAppContext } from '../contexts/AppContext';
import { showToast } from '@/utils/toasts';
import { getProductPriceUnit } from '@/utils/prices';
import MyTooltip from '../MyTooltip';
import ProductTag from './ProductTag';

export default function ProductCart(props) {
    const {
        product,
        index,
        outOfStock,
        unavailable,
    } = props

    const {
        userCurrency,
        handleChangeProductQuantity,
        handleDeleteProductFromCart,
    } = useAppContext()

    const { i18n } = useTranslation()

    const tCommon = useTranslation('common').t
    const tColors = useTranslation('colors').t
    const tToasts = useTranslation('toasts').t

    const COLOR = COLORS_POOL[product.variant.color_id]

    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    const PRICE_UNIT = getProductPriceUnit(product, product.variant, userCurrency?.rate)

    const PRICE = PRICE_UNIT * product.quantity

    const [deleting, setDeleting] = useState(false)

    async function handleDeleteProduct() {
        try {
            setDeleting(true)
            await handleDeleteProductFromCart(product)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
            setDeleting(false)
        }
    }

    async function handleChangeQuantity(event) {
        try {
            setDeleting(true)
            await handleChangeProductQuantity(product, event.target.value)
            setDeleting(false)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
            setDeleting(false)
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
                delay: deleting ? 0 : 0.3 * (index <= 2 ? index : 3),

            }}
            initial='hidden'
            animate='visible'
            style={{
                pointerEvents: deleting ? 'none' : 'auto'
            }}
        >
            <MyTooltip
                title={tCommon('remove_from_cart')}
            >
                <button
                    onClick={handleDeleteProduct}
                    className={`${styles.deleteButton} buttonInvisible`}
                >
                    <SlClose />
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
                    } `}
            >
                <Image
                    quality={100}
                    src={product.image_src}
                    alt={product.title}
                    width={270}
                    height={300}
                    style={{
                        objectFit: 'cover',
                        width: 'auto',
                        height: 'calc(var(--container-height) * 0.9)',
                    }}
                />
            </Link>
            <div className={styles.right}>
                <div className={styles.rightLeft}>
                    <div className={styles.productName}>
                        <Link
                            href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                                ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                                : SIZE.id !== product.default_variant.size_id
                                    ? `?sz=${SIZE.title.toLowerCase()}`
                                    : COLOR.id !== product.default_variant.color_id
                                        ? `?cl=${COLOR.id_string}`
                                        : ''
                                } `
                            }
                            className='ellipsis'
                            style={{
                                fontWeight: 600,
                            }}
                        >
                            {product.title}
                        </Link>
                    </div>
                    <div className={styles.bodyContainer}>
                        <div className={styles.bodyTop}>
                            <ProductTag product={product} />
                            {outOfStock
                                ? <div
                                    className={styles.outOfStock}
                                >
                                    <p>
                                        {tCommon('OUT_OF_STOCK')}
                                    </p>
                                </div>
                                : unavailable
                                    ? <div
                                        className={styles.outOfStock}
                                    >
                                        <p>
                                            {tCommon('UNAVAILABLE')}
                                        </p>
                                    </div>
                                    : product.promotion &&
                                    <div
                                        className={styles.promotion}
                                    >
                                        <p>
                                            {Math.round(100 * product.promotion.percentage)}% OFF
                                        </p>
                                    </div>
                            }
                        </div>
                        <div className={styles.bodyBottom}>
                            <div className='flex column' style={{ fontSize: 13, paddingBottom: '0.7rem' }}>
                                <p className='text-start'>{tCommon('Color')}: <span style={{ fontWeight: 600 }}>{tColors(COLOR.id_string)}</span></p>
                                <p className='text-start'>{tCommon('Size')}: <span style={{ fontWeight: 600 }}>{SIZE.title}</span></p>
                            </div>
                            <Selector
                                value={product.quantity}
                                label={tCommon('Quantity')}
                                onChange={handleChangeQuantity}
                                onClick={() => setHoverQuantity(false)}
                                style={{
                                    height: 30,
                                    fontSize: 16,
                                    width: ['pt-BR', 'pt'].includes(i18n.language)
                                        ? 88
                                        : ['es'].includes(i18n.language)
                                            ? 80
                                            : 78
                                }}
                                styleOption={{
                                    height: 30,
                                    fontSize: 16,
                                    width: ['pt-BR', 'pt'].includes(i18n.language)
                                        ? 88
                                        : ['es'].includes(i18n.language)
                                            ? 80
                                            : 78
                                }}
                                styleLabel={{
                                    fontSize: ['pt-BR', 'pt'].includes(i18n.language) ? 14 : 16,
                                }}
                                options={Array(LIMITS.cart_same_item).fill(null).map((ele, i) => ({ value: i + 1, name: String(i + 1) }))}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.rightRight}>
                    <p className={styles.rightP}>
                        {tCommon('Price')}:
                    </p>
                    <p className={styles.price}>
                        {`${userCurrency?.symbol} ${(PRICE / 100).toFixed(2)}`}
                    </p>
                    {product.quantity > 1 &&
                        <p className={styles.rightP}>
                            {`${userCurrency?.symbol} ${(PRICE_UNIT / 100).toFixed(2)} ${tCommon('unit')}`}
                        </p>
                    }
                </div>
            </div>
        </motion.div>
    )
}