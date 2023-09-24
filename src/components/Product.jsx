import styles from '@/styles/components/Product.module.css'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion";

export default function Product(props) {
    const {
        responsive,
        img,
        imgHover,
        name,
        price,
        soldOut,
        outOfStock,
        currencySymbol,
        url,
        width = '230px',
        style,
        motionVariants,
        supportsHoverAndPointer,
        setLoadingProduct
    } = props

    const [isHovered, setIsHovered] = useState(false)
    const productRef = useRef(null)
    const [productWidth, setProductWidth] = useState()

    function handleMouseEnter() {
        if (supportsHoverAndPointer) {
            setIsHovered(true)
        }
    }

    function handleMouseLeave() {
        if (supportsHoverAndPointer)
            setIsHovered(false)
    }


    useEffect(() => {
        function updateProductWidth() {
            if (productRef.current) {
                const computedStyle = window.getComputedStyle(productRef.current);
                const width = computedStyle.getPropertyValue('width');
                setProductWidth(width);
            }
        }

        window.addEventListener('resize', updateProductWidth);

        updateProductWidth();

        return () => {
            window.removeEventListener('resize', updateProductWidth);
        }
    }, [])

    return (
        <Link legacyBehavior href={url}>
            <a
                onClick={() => setLoadingProduct(true)}
                className={styles.container}
                ref={productRef}
                style={{
                    ...style,
                    textDecoration: 'none',
                    height: responsive ? `calc(${productWidth} * 1.575)` : `calc(${productWidth} * 1.575)`,
                    width: responsive ? '100%' : width,
                    marginBottom: `calc(${productWidth} * 0.2)`,
                }}
            >
                <motion.div
                    className={styles.productContainer}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    variants={motionVariants}
                    initial='hidden'
                    animate='visible'
                >
                    {supportsHoverAndPointer &&
                        <div
                            className={styles.imgHoverContainer}
                            style={{
                                opacity: isHovered ? 1 : 0
                            }}
                        >
                            <img
                                src={imgHover}
                                className={styles.img}
                                alt={name}
                            />
                        </div>
                    }
                    <div className={styles.imgContainer}>
                        <img
                            src={img}
                            className={styles.img}
                            alt={name}
                        />
                    </div>
                    <div className={styles.infos}>
                        {soldOut !== undefined &&
                            <div
                                className={styles.soldOut}
                            >
                                <p
                                    style={{
                                        fontSize: `calc(${productWidth} * 0.055)`
                                    }}
                                >
                                    {Math.round(100 * (1 - (soldOut / price)))}% OFF
                                </p>
                            </div>
                        }
                        {outOfStock &&
                            <div
                                className={styles.outOfStock}
                            >
                                <p
                                    style={{
                                        fontSize: `calc(${productWidth} * 0.055)`
                                    }}
                                >
                                    OUT OF STOCK
                                </p>
                            </div>
                        }
                        <p
                            className={styles.name}
                            style={{
                                fontSize: `calc(${productWidth} * 0.07)`
                            }}
                        >
                            {name}
                        </p>
                        <div className={styles.priceContainer}>
                            {soldOut !== undefined &&
                                <p
                                    className={styles.oldPrice}
                                    style={{
                                        fontSize: `calc(${productWidth} * 0.056)`
                                    }}
                                >
                                    {currencySymbol} {soldOut !== undefined ? (price / 100).toFixed(2) : (soldOut / 100).toFixed(2)}
                                </p>
                            }
                            <p
                                className={styles.price}
                                style={{
                                    fontSize: `calc(${productWidth} * 0.085)`
                                }}
                            >
                                {currencySymbol} {soldOut !== undefined ? (soldOut / 100).toFixed(2) : (price / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    {supportsHoverAndPointer &&
                        <div
                            className={styles.buttonMore}
                            style={{
                                bottom: isHovered ? '-12%' : '0'
                            }}
                        >
                            <Button
                                variant='contained'
                                size='small'
                                sx={{
                                    color: 'var(--text-white)',
                                    width: '75%',
                                    fontSize: `calc(${productWidth} * 0.053)`,
                                    fontWeight: 'bold'
                                }}
                            >
                                MORE VARIANTS
                            </Button>
                        </div>
                    }
                </motion.div>
            </a>
        </Link>
    )
}
