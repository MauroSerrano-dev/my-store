import styles from '@/styles/components/ProductModal.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { convertDolarToCurrency } from '../../consts';

export default function ProductModal(props) {
    const {
        session,
        product,
        setCart,
        index,
        userCurrency,
    } = props

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
            <Link legacyBehavior href={`/product?id=${product.id}`}>
                <a className={styles.imageContainer}>
                    <img
                        className={styles.image}
                        src={product.image}
                    />
                </a>
            </Link>
            <div className={styles.right}>
                <Link legacyBehavior href={`/product?id=${product.id}`}>
                    <a>
                        <h6>{product.title}</h6>
                    </a>
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
                        {`${userCurrency.symbol} ${((convertDolarToCurrency(product.price, userCurrency.code) / 100) * product.quantity).toFixed(2)}`}
                    </p>
                    {product.quantity > 1 &&
                        <p style={{ fontSize: '10px', color: 'var(--text-black)' }}>
                            {`${userCurrency.symbol} ${(convertDolarToCurrency(product.price, userCurrency.code) / 100).toFixed(2)} unit`}
                        </p>
                    }
                </div>
            </div>
        </motion.div>
    )
}