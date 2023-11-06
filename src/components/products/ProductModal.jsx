import styles from '@/styles/components/products/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { convertDolarToCurrency, SIZES_POOL, COLORS_POOL } from '../../../consts';
import Image from 'next/image';

export default function ProductModal(props) {
    const {
        product,
        setCart,
        index,
        userCurrency,
    } = props

    const price = `${userCurrency.symbol} ${((convertDolarToCurrency(product.variant.price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100) * product.quantity).toFixed(2)}`

    const priceUnit = `${userCurrency.symbol} ${(convertDolarToCurrency(product.variant.price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)} unit`

    const COLOR = COLORS_POOL[product.variant.color_id]
    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    function handleDeleteCartProduct() {
        setCart(prev => (
            {
                ...prev,
                products: prev.products.filter(prod => prod.id !== product.id || prod.variant.id !== product.variant.id)
            }
        ))
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
                        delay: 0.3 * index,
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
                    top: '0.7rem',
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
                        Size: <span style={{ fontWeight: 500 }}>{SIZE.title}</span>
                    </p>
                    <p>
                        Color: <span style={{ fontWeight: 500 }}>{COLOR.title}</span>
                    </p>
                    <p>
                        Quantity: <span style={{ fontWeight: 500 }}>{product.quantity}</span>
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    <p
                        style={{
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        {price}
                    </p>
                    {product.quantity > 1 &&
                        <p style={{ fontSize: '10px', color: 'var(--text-black)' }}>
                            {priceUnit}
                        </p>
                    }
                </div>
            </div>
        </motion.div>
    )
}