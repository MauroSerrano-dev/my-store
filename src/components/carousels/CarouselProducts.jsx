import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Product from '../products/Product';
import styles from '@/styles/components/carousels/CarouselProducts.module.css'
import ProductSkeleton from '../products/ProductSkeleton'
import { useAppContext } from '../contexts/AppContext';

export default function CarouselProducts(props) {
    const {
        products,
        noProductFoundLabel = "No Products Found",
        similar,
    } = props

    const {
        supportsHoverAndPointer,
        windowWidth,
    } = useAppContext()

    const carouselRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false) //você é um gênio

    const [similarityProducts, setSimilarityProducts] = useState()

    useEffect(() => {
        if (similar) {
            getProductsSimilarity()
        }
    }, [similar])

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

    const productWidth = windowWidth > 1075
        ? 225
        : windowWidth > 750
            ? 190
            : windowWidth > 420
                ? 155
                : 140

    function getProductsSimilarity() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                product_id: similar
            }
        }

        fetch("/api/products/similar", options)
            .then(response => response.json())
            .then(response => {
                setSimilarityProducts(response.data)
            })
            .catch(err => console.error(err))
    }

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
                {(products || similarityProducts) &&
                    (products || similarityProducts).map(prod =>
                        <Product
                            width={productWidth}
                            key={prod.id}
                            product={prod}
                            isDragging={isDragging}
                            style={{
                                pointerEvents: isDragging ? 'none' : 'auto',
                                willChange: 'transform',
                            }}
                        />
                    )
                }
            </motion.div>
            {!(products || similarityProducts) &&
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
                        />
                    )}
                </div>
            }
            {(products || similarityProducts)?.length === 0 &&
                <h3 style={{ color: 'var(--text-white)' }}>
                    {noProductFoundLabel}
                </h3>
            }
        </motion.div>
    )
}