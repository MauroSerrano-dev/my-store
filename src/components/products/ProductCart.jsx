import styles from '@/styles/components/products/ProductCart.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { SIZES_POOL, COLORS_POOL, CART_COOKIE } from '@/consts';
import Image from 'next/image';
import Selector from '../material-ui/Selector';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useAppContext } from '../contexts/AppContext';
import { showToast } from '@/utils/toasts';
import { getProductPriceUnit } from '@/utils/prices';

export default function ProductCart(props) {
    const {
        product,
        index,
        outOfStock,
    } = props

    const {
        session,
        setLoading,
        userCurrency,
        setCart,
    } = useAppContext()

    const { i18n } = useTranslation()

    const tCommon = useTranslation('common').t

    const COLOR = COLORS_POOL[product.variant.color_id]

    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    const PRICE_UNIT = getProductPriceUnit(product, product.variant, userCurrency?.rate)

    const PRICE = Math.round(PRICE_UNIT * product.quantity)

    const [deleting, setDeleting] = useState(false)

    function handleDeleteCartProduct() {
        setLoading(true)
        setDeleting(true)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                cartId: session ? session.cart_id : Cookies.get(CART_COOKIE),
                product: { id: product.id, variant_id: product.variant.id }
            }),
        }

        if (session) {
            options.headers.user_id = session.id
        }

        fetch("/api/carts/delete-cart-product", options)
            .then(response => response.json())
            .then(response => {
                setDeleting(false)
                setCart(response.cart)
            })
            .catch(err => {
                setDeleting(false)
                setLoading(false)
                showToast({ type: 'error', msg: 'Error Deleting Product From Cart' })
                console.error(err)
            })
    }

    function handleChangeQuantity(event) {
        setLoading(true)
        setDeleting(true)

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                cartId: session ? session.cart_id : Cookies.get(CART_COOKIE),
                product: { id: product.id, variant_id: product.variant.id },
                newQuantity: event.target.value
            }),
        }

        if (session) {
            options.headers.user_id = session.id
        }

        fetch("/api/carts/cart-product-quantity", options)
            .then(response => response.json())
            .then(response => {
                setDeleting(false)
                setCart(response.cart)
            })
            .catch(err => {
                setDeleting(false)
                setLoading(false)
                console.error(err)
            })
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
            <button
                onClick={() => handleDeleteCartProduct()}
                className={`${styles.deleteButton} buttonInvisible`}
            >
                <SlClose />
            </button>
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
                    priority
                    quality={100}
                    src={product.image.src}
                    alt={product.title}
                    width={270}
                    height={300}
                    style={{
                        width: 'auto',
                        height: 'calc(var(--container-height) * 0.9)',
                    }}
                />
            </Link>
            <div className={styles.right}>
                <div className={styles.rightLeft}>
                    <div className={styles.productName}>
                        <Link href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                            ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                            : SIZE.id !== product.default_variant.size_id
                                ? `?sz=${SIZE.title.toLowerCase()}`
                                : COLOR.id !== product.default_variant.color_id
                                    ? `?cl=${COLOR.id_string}`
                                    : ''
                            } `}
                        >
                            {product.title}
                        </Link>
                    </div>
                    <div className={styles.bodyContainer}>
                        <div className={styles.bodyTop}>
                            {outOfStock
                                ? <div
                                    className={styles.outOfStock}
                                >
                                    <p>
                                        OUT OF STOCK
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
                                <p className='text-start'>{tCommon('Color')}: <span style={{ fontWeight: 600 }}>{COLOR.title}</span></p>
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
                                    width: ['pt-BR', 'pt-PT'].includes(i18n.language)
                                        ? 88
                                        : ['es'].includes(i18n.language)
                                            ? 80
                                            : 78
                                }}
                                styleOption={{
                                    height: 30,
                                    fontSize: 16,
                                    width: ['pt-BR', 'pt-PT'].includes(i18n.language)
                                        ? 88
                                        : ['es'].includes(i18n.language)
                                            ? 80
                                            : 78
                                }}
                                styleLabel={{
                                    fontSize: ['pt-BR', 'pt-PT'].includes(i18n.language) ? 14 : 16,
                                }}
                                options={[
                                    { value: 1, name: '1' },
                                    { value: 2, name: '2' },
                                    { value: 3, name: '3' },
                                    { value: 4, name: '4' },
                                    { value: 5, name: '5' },
                                    { value: 6, name: '6' },
                                    { value: 7, name: '7' },
                                    { value: 8, name: '8' },
                                    { value: 9, name: '9' },
                                    { value: 10, name: '10' },
                                ]}
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
            {
                deleting &&
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        width: '100%',
                        height: '100%',
                    }}
                >
                </div>
            }
        </motion.div>
    )
}