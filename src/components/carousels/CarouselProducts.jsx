import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Product from '../products/Product';
import styles from '@/styles/components/carousels/CarouselProducts.module.css'
import { Skeleton } from '@mui/material';

export default function CarouselProducts(props) {
    const {
        products,
        userCurrency,
        supportsHoverAndPointer,
        windowWidth,
    } = props

    const carouselRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false) //você é um gênio

    function handleDragStart() {
        setIsDragging(true)
    }

    function handleDragEnd() {
        setAntVisualBug(false)
        setTimeout(() => {
            setIsDragging(false)
        }, 200)
    }

    function handleMouseDown() {
        setAntVisualBug(true)
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
                dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{
                    zIndex: 1,
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    height: windowWidth < 1075
                        ? windowWidth < 750
                            ? 275.125
                            : 337.25
                        : 399.375
                }}
            >
                {products.length > 0 &&
                    products.map((prod, i) =>
                        <Product
                            width={windowWidth < 1075
                                ? windowWidth < 750
                                    ? 155
                                    : 190
                                : 225
                            }
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
            {products.length === 0 &&
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
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((skel, i) =>
                        <div
                            key={i}
                            style={{
                                width: windowWidth < 1075
                                    ? windowWidth < 750
                                        ? 155
                                        : 190
                                    : 225,
                                height: windowWidth < 1075
                                    ? windowWidth < 750
                                        ? 275.125
                                        : 337.25
                                    : 399.375
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 155
                                            : 190
                                        : 225
                                }
                                height={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 172.2222
                                            : 211.1111
                                        : 250
                                }
                                sx={{
                                    backgroundColor: 'rgb(50, 50, 50)',
                                    borderTopRightRadius: '0.5rem',
                                    borderTopLeftRadius: '0.5rem',
                                }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 155
                                            : 190
                                        : 225
                                }
                                height={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 15
                                            : 20
                                        : 25
                                }
                                sx={{
                                    marginTop: windowWidth < 1075
                                        ? windowWidth < 750
                                            ? '7px'
                                            : '9px'
                                        : '10px',
                                    backgroundColor: 'rgb(50, 50, 50)',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 100
                                            : 130
                                        : 140
                                }
                                height={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 10
                                            : 12
                                        : 15
                                }
                                sx={{
                                    marginTop: windowWidth < 1075
                                        ? windowWidth < 750
                                            ? '7px'
                                            : '9px'
                                        : '10px',
                                    backgroundColor: 'rgb(50, 50, 50)',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 60
                                            : 80
                                        : 90
                                }
                                height={
                                    windowWidth < 1075
                                        ? windowWidth < 750
                                            ? 14
                                            : 16
                                        : 20
                                }
                                sx={{
                                    marginTop: windowWidth < 1075
                                        ? windowWidth < 750
                                            ? '7px'
                                            : '9px'
                                        : '10px',
                                    backgroundColor: 'rgb(50, 50, 50)',
                                    borderRadius: '0.5rem',
                                }}
                            />
                        </div>
                    )}
                </div>
            }
        </motion.div>
    )
}