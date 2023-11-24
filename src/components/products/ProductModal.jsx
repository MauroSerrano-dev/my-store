import styles from '@/styles/components/products/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { SIZES_POOL, COLORS_POOL, CART_COOKIE } from '../../../consts';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function ProductModal(props) {
    const {
        product,
        setCart,
        index,
        userCurrency,
        session,
    } = props

    const tCommon = useTranslation('common').t

    const PRICE_UNIT = Math.ceil(product.variant.price * userCurrency?.rate) * (product.sold_out ? 1 - product.sold_out.percentage : 1)

    const PRICE = Math.ceil(PRICE_UNIT * product.quantity)

    const COLOR = COLORS_POOL[product.variant.color_id]
    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    const [deleting, setDeleting] = useState(false)

    function handleDeleteCartProduct() {
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
                        delay: 0.2 + 0.3 * (index === 0 ? 0 : 1),
                    }
                }
            }}
            initial='hidden'
            animate='visible'
        >
            <SlClose
                onClick={() => handleDeleteCartProduct()}
                color='#ffffff'
                style={{
                    fontSize: '15px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '0.8rem',
                    right: '0.3rem',
                    color: 'var(--global-black)',
                    zIndex: 10,
                }}
            />
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
                <Image
                    priority
                    quality={100}
                    src={product.image.src}
                    alt={product.title}
                    width={108 * 0.9}
                    height={108}
                    style={{
                        width: 'auto',
                        height: 108,
                    }}
                />
            </Link>
            <div className={styles.right}>
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
                    <h6>{product.title}</h6>
                </Link>
                <div className={styles.infos}>
                    <p>
                        {tCommon('Size')}: <span style={{ fontWeight: 500 }}>{SIZE.title}</span>
                    </p>
                    <p>
                        {tCommon('Color')}: <span style={{ fontWeight: 500 }}>{tCommon(COLOR.title)}</span>
                    </p>
                    <p>
                        {tCommon('Quantity')}: <span style={{ fontWeight: 500 }}>{product.quantity}</span>
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    <p
                        style={{
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        {`${userCurrency?.symbol} ${(PRICE / 100).toFixed(2)}`}
                    </p>
                    {product.quantity > 1 &&
                        <p style={{ fontSize: '10px', color: 'var(--text-black)' }}>
                            {`${userCurrency?.symbol} ${(PRICE_UNIT / 100).toFixed(2)} ${tCommon('unit', { count: 2 })}`}
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