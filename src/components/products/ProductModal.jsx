import styles from '@/styles/components/products/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { convertDolarToCurrency } from '../../../consts';

export default function ProductModal(props) {
    const {
        product,
        setCart,
        index,
        userCurrency,
        loading,
        setLoading,
    } = props

    const price = `${userCurrency.symbol} ${((convertDolarToCurrency(product.price * (product.sold_out.percentage ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100) * product.quantity).toFixed(2)}`

    const priceUnit = `${userCurrency.symbol} ${(convertDolarToCurrency(product.price * (product.sold_out.percentage ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)} unit`

    function handleDeleteCartProduct() {
        setCart(prev => prev.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant_id))
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
                        duration: 0.5,
                        delay: 0.5 * index,
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
            <Link href={`/product/${product.id}${product.color.id !== product.default_variant.color.id && product.size.id !== product.default_variant.size.id
                ? `?sz=${product.size.title.toLowerCase()}&cl=${product.color.title.replace(' ', '+').toLowerCase()}`
                : product.size.id !== product.default_variant.size.id
                    ? `?sz=${product.size.title.toLowerCase()}`
                    : product.color.id !== product.default_variant.color.id
                        ? `?cl=${product.color.title.replace(' ', '+').toLowerCase()}`
                        : ''
                }`}
                className={styles.imageContainer}
                onClick={() => setLoading(true)}
                style={{
                    pointerEvents: loading ? 'none' : 'auto',
                }}
            >
                <img
                    className={styles.image}
                    src={product.image}
                />
            </Link>
            <div className={styles.right}>
                <Link href={`/product/${product.id}${product.color.id !== product.default_variant.color.id && product.size.id !== product.default_variant.size.id
                    ? `?sz=${product.size.title.toLowerCase()}&cl=${product.color.title.replace(' ', '+').toLowerCase()}`
                    : product.size.id !== product.default_variant.size.id
                        ? `?sz=${product.size.title.toLowerCase()}`
                        : product.color.id !== product.default_variant.color.id
                            ? `?cl=${product.color.title.replace(' ', '+').toLowerCase()}`
                            : ''
                    }`}
                    onClick={() => setLoading(true)}
                    style={{
                        pointerEvents: loading ? 'none' : 'auto',
                    }}
                >
                    <h6>{product.title}</h6>
                </Link>
                <div className={styles.infos}>
                    <p>
                        Size: {product.size.title}
                    </p>
                    <p>
                        Color: {product.color.title}
                    </p>
                    <p>
                        Quantity: {product.quantity}
                    </p>
                </div>
                <div className={styles.priceContainer}>
                    <p
                        style={{
                            fontWeight: 'bold',
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