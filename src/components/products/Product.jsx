import styles from '@/styles/components/products/Product.module.css'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion";
import { convertDolarToCurrency } from '../../../consts';
import ColorButton from '../ColorButton';
import Image from 'next/image';

/**
 * @param {object} props - Component props.
 * @param {object} props.product - Product props.
 * @param {object} props.motionVariants - Component motionVariants.
 * @param {string} props.width - Component width.
 * @param {boolean} props.responsive - Responsive width.
 * @param {boolean} props.supportsHoverAndPointer - Device supportsHoverAndPointer.
 * @param {boolean} props.outOfStock - Product outOfStock.
 * @param {object} props.style - Product style.
 */

export default function Product(props) {
    const {
        outOfStock,
        userCurrency,
        width = 225,
        supportsHoverAndPointer,
        isDragging,
        product,
        motionVariants = {
            hidden: {
                opacity: 0,
            },
            visible: {
                opacity: 1,
                transition: {
                    duration: 0.2,
                }
            }
        },
        style,
    } = props

    const productRef = useRef(null)
    const bottomHoverRef = useRef(null)

    const [currentVariant, setCurrentVariant] = useState(product.variants[0])
    const [isDraggingColors, setIsDraggingColors] = useState(false)

    const scrollColorsActive = product.colors.length > 6

    function handleDragColorsStart() {
        setIsDraggingColors(true)
    }

    function handleDragColorsEnd() {
        setIsDraggingColors(false)
    }

    const url = `/product/${product.id}${product.variants[0].id === currentVariant.id ? '' : `?cl=${product.colors.find(c => currentVariant.color_id === c.id).title.toLowerCase()}`}`

    function handleChangeColor(event, option) {
        event.stopPropagation()
        event.preventDefault()
        setCurrentVariant(product.variants.find(vari => vari.color_id === option.id))
    }

    function handleBottomHoverClick(event) {
        event.stopPropagation()
        event.preventDefault()
    }

    return (
        <motion.div
            className={styles.container}
            variants={motionVariants}
            initial='hidden'
            animate='visible'
            ref={productRef}
            style={{
                height: width * 1.575,
                width: width,
                marginBottom: width * 0.2,
                textDecoration: 'none',
                ...style
            }}
        >
            <Link
                href={url}
                className={`${styles.linkContainer} noUnderline`}
                draggable={false}
            >
                {supportsHoverAndPointer &&
                    <div
                        className={styles.imgHoverContainer}
                        style={{
                            zIndex: 2,
                            pointerEvents: 'none',
                            width: width,
                            height: width * 10 / 9
                        }}
                    >
                        {product.colors.map((color, i) =>
                            <Image
                                key={i}
                                src={product.images.filter(img => img.color_id === color.id)[product.image_hover_index].src}
                                width={270}
                                height={300}
                                alt={product.title}
                                style={{
                                    position: i > 0 ? 'absolute' : 'relative',
                                    zIndex: currentVariant.color_id === color.id ? 3 : 2,
                                    opacity: currentVariant.color_id === color.id ? 3 : 2,
                                    width: width,
                                    height: 'auto',
                                }}
                            />
                        )}
                    </div>
                }
                <div
                    className={styles.imgContainer}
                    style={{
                        pointerEvents: 'none',
                        width: width,
                        height: width * 10 / 9,
                    }}
                >
                    {product.colors.map((color, i) =>
                        <Image
                            key={i}
                            priority
                            src={product.images.filter(img => img.color_id === color.id)[product.image_showcase_index].src}
                            width={270}
                            height={300}
                            alt={product.title}
                            style={{
                                position: i > 0 ? 'absolute' : 'relative',
                                zIndex: currentVariant.color_id === color.id ? 1 : 0,
                                opacity: currentVariant.color_id === color.id ? 1 : 0,
                                width: width,
                                height: 'auto',
                            }}
                        />
                    )}
                </div>
                <div
                    className={styles.infos}
                >
                    {product.sold_out.percentage &&
                        <div
                            className={styles.soldOut}
                        >
                            <p
                                style={{
                                    fontSize: width * 0.055
                                }}
                            >
                                {Math.round(100 * product.sold_out.percentage)}% OFF
                            </p>
                        </div>
                    }
                    {outOfStock &&
                        <div
                            className={styles.outOfStock}
                        >
                            <p
                                style={{
                                    fontSize: width * 0.055
                                }}
                            >
                                OUT OF STOCK
                            </p>
                        </div>
                    }
                    <p
                        className={styles.name}
                        style={{
                            fontSize: width * 0.07
                        }}
                    >
                        {product.title}
                    </p>
                    <div className={styles.priceContainer}>
                        {product.sold_out.percentage &&
                            <p
                                className={styles.oldPrice}
                                style={{
                                    fontSize: width * 0.056
                                }}
                            >
                                {userCurrency.symbol} {(convertDolarToCurrency(product.min_price, userCurrency.code) / 100).toFixed(2)}
                            </p>
                        }
                        <p
                            className={styles.price}
                            style={{
                                fontSize: width * 0.085
                            }}
                        >
                            {userCurrency.symbol} {(convertDolarToCurrency(product.min_price * (product.sold_out.percentage ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)}
                        </p>
                    </div>
                    <div className={styles.infoBottomPadding}>
                    </div>
                </div>
            </Link>
            {supportsHoverAndPointer &&
                <div
                    onClick={handleBottomHoverClick}
                    className={styles.bottomHover}
                    ref={bottomHoverRef}
                    style={{
                        justifyContent: scrollColorsActive ? 'flex-start' : 'center',
                    }}
                >
                    <motion.div
                        className='flex row align-end justify-center'
                        style={{
                            height: '100%',
                            gap: width * 0.031,
                            paddingBottom: width * 0.035,
                            paddingLeft: width * 0.02,
                            paddingRight: width * 0.02,
                        }}
                        dragConstraints={bottomHoverRef}
                        initial={{ x: 0 }}
                        drag={scrollColorsActive ? 'x' : false}
                        dragElastic={0.25}
                        dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                        onDragStart={handleDragColorsStart}
                        onDragEnd={handleDragColorsEnd}
                    >
                        {product.colors.length > 1
                            ? product.colors.map((color, i) =>
                                <ColorButton
                                    key={i}
                                    index={i}
                                    style={{
                                        height: width * 0.13,
                                        width: width * 0.13,
                                    }}
                                    selected={currentVariant.color_id === color.id}
                                    option={color}
                                    onChange={handleChangeColor}
                                    supportsHoverAndPointer={!isDragging && !isDraggingColors && supportsHoverAndPointer}
                                />
                            )
                            : <Link
                                href={url}
                                style={{
                                    width: width * 0.7,
                                }}
                            >
                                <Button
                                    variant='contained'
                                    size='small'
                                    sx={{
                                        color: 'var(--text-white)',
                                        width: '100%',
                                        fontSize: width * 0.053,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    MORE INFO
                                </Button>
                            </Link>
                        }
                    </motion.div>
                </div>
            }
        </motion.div>
    )
}
