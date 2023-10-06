import { useRef, useState } from 'react';
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
        router
    } = props

    const carouselRef = useRef()

    const [productHovered, setProductHovered] = useState(false)
    const [isDragging, setIsDragging] = useState(false);

    const [goToProduct, setGoToProduct] = useState();

    function handleDragStart() {
        setIsDragging(true)
    }

    function handleDragEnd() {
        setTimeout(() => {
            setIsDragging(false)
        }, 200)
    }


    function handleProductHover(i) {
        if (!isDragging)
            setProductHovered(i)
    }

    function handleProductLeave() {
        setProductHovered()
    }

    function handlePushRouter(i) {
        if (!isDragging)
            setGoToProduct(i)
    }

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
                dragTransition={{ power: 0.07, timeConstant: 160 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
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
                        style={{
                            pointerEvents: loading || isDragging ? 'none' : 'auto',
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    )
}