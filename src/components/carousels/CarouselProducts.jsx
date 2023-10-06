import { useRef } from 'react';
import { motion } from 'framer-motion';
import Product from '../products/Product';
import styles from '@/styles/components/carousels/CarouselProducts.module.css'

export default function CarouselProducts(props) {
    const {
        products,
        userCurrency,
        supportsHoverAndPointer,
        loading,
        setLoading,
        windowWidth,
    } = props

    const carouselRef = useRef()

    return (
        <motion.div
            className={styles.container}
            ref={carouselRef}
        >
            <motion.div
                className={styles.inner}
                dragConstraints={carouselRef}
                initial={{ x: 0 }}
                drag="x"
                dragElastic={0.25}
                dragTransition={{ power: 0.1, timeConstant: 200 }}
            >
                {products.map((prod, i) =>
                    <Product
                        width={windowWidth < 1075
                            ? windowWidth < 750
                                ? '155px'
                                : '190px'
                            : '225px'
                        }
                        key={i}
                        product={prod}
                        userCurrency={userCurrency}
                        supportsHoverAndPointer={supportsHoverAndPointer}
                        loading={loading}
                        setLoading={setLoading}
                    />
                )}
            </motion.div>
        </motion.div>
    )
}