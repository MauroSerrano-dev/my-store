import styles from '@/styles/components/products/ProductOrder.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';

export default function ProductOrder(props) {
    const {
        order,
        index,
    } = props

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
            <h3>
                {order.amount.amount_total}
            </h3>
            {order.products.map((product, j) =>
                <div key={j}>
                    <h3>
                        {product.title}
                    </h3>
                </div>
            )}

        </motion.div>
    )
}