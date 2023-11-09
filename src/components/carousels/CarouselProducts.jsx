import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Product from '../products/Product';
import styles from '@/styles/components/carousels/CarouselProducts.module.css'
import ProductSkeleton from '../products/ProductSkeleton'

export default function CarouselProducts(props) {
    const {
        products,
        userCurrency,
        supportsHoverAndPointer,
        windowWidth,
        noProductFoundLabel = "No Products Found"
    } = props

    const carouselRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false) //você é um gênio

    function handleDragStart() {
        setIsDragging(true)
        document.body.style.cursor = 'grabbing'
    }

    function handleDragEnd() {
        setAntVisualBug(false)
        document.body.style.cursor = 'auto'
        setTimeout(() => {
            setIsDragging(false)
        }, 200)
    }

    function handleMouseDown() {
        setAntVisualBug(true)
    }

    const productWidth = windowWidth < 1075
        ? windowWidth < 750
            ? windowWidth < 381
                ? 140
                : 155
            : 190
        : 225

    return (
        <motion.div
            className={styles.container}
            ref={carouselRef}
        >
            <motion.div
                className={styles.inner}
                dragConstraints={carouselRef.current ? carouselRef : { right: 0, left: 0 }}
                initial={{ x: 0 }}
                drag="x"
                dragElastic={0.25}
                dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{
                    zIndex: 1,
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    height: productWidth * 1.764,
                }}
            >
                {products &&
                    products.map((prod, i) =>
                        <Product
                            width={productWidth}
                            key={i}
                            product={prod}
                            userCurrency={userCurrency}
                            supportsHoverAndPointer={supportsHoverAndPointer}
                            isDragging={isDragging}
                            style={{
                                pointerEvents: isDragging ? 'none' : 'auto',
                                willChange: 'transform',
                            }}
                        />
                    )
                }
            </motion.div>
            {!products &&
                <div
                    className={styles.inner}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}
                >
                    {Array(7).fill(null).map((ske, i) =>
                        <ProductSkeleton
                            key={i}
                            productWidth={productWidth}
                            supportsHoverAndPointer={supportsHoverAndPointer}
                        />
                    )}
                </div>
            }
            {products?.length === 0 &&
                <h3 style={{ color: 'var(--text-white)' }}>
                    {noProductFoundLabel}
                </h3>
            }
        </motion.div>
    )
}