import styles from '@/styles/components/products/Product.module.css'
import { useEffect, useState, useRef } from 'react'
import { Button, Skeleton } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion";
import { COLORS_POOL, convertDolarToCurrency } from '../../../consts';
import ColorButton from '../ColorButton';
import Image from 'next/image';

/**
 * @param {object} props - Component props.
 * @param {object} props.product - Product props.
 * @param {object} props.motionVariants - Component motionVariants.
 * @param {object} props.style - Product style.
 * @param {string} props.width - Component width.
 * @param {boolean} props.responsive - Responsive width.
 * @param {boolean} props.supportsHoverAndPointer - Device supportsHoverAndPointer.
 * @param {boolean} props.outOfStock - Product outOfStock.
 */

export default function Product(props) {
    const {
        outOfStock,
        userCurrency,
        width = 225,
        supportsHoverAndPointer,
        isDragging = false,
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

    const height = width * 10 / 9

    const productRef = useRef(null)
    const bottomHoverRef = useRef(null)

    const [currentVariant, setCurrentVariant] = useState(product.variants[0])
    const [isDraggingColors, setIsDraggingColors] = useState(false)

    const [imageLoad, setImageLoad] = useState(false)

    const [antVisualBug, setAntVisualBug] = useState(false)

    const [hover, setHover] = useState(false)
    const [showButtomHover, setShowButtomHover] = useState(false)

    const [closeHoverTimeout, setCloseHoverTimeout] = useState()

    const colorButtonSize = width * 0.13
    const colorsButtonsGap = width * 0.031

    const scrollColorsActive = (colorButtonSize + colorsButtonsGap) * product.colors.length > width

    function handleDragColorsStart() {
        setIsDraggingColors(true)
        document.body.style.cursor = 'grabbing'
    }

    function handleDragColorsEnd() {
        setAntVisualBug(false)
        document.body.style.cursor = 'auto'
        setTimeout(() => {
            setIsDraggingColors(false)
        }, 200)
    }

    function handleColorsMouseDown() {
        setAntVisualBug(true)
    }

    const url = `/product/${product.id}${product.variants[0].id === currentVariant.id ? '' : `?cl=${COLORS_POOL.find(color => color.id === currentVariant.color_id).title.replace('/', '+').toLowerCase()}`}`

    function handleMouseUpColor(event, color) {
        event.stopPropagation()
        event.preventDefault()
        setCurrentVariant(product.variants.find(vari => vari.color_id === color.id))
    }

    function handleBottomHoverClick(event) {
        event.stopPropagation()
        event.preventDefault()
    }

    useEffect(() => {
        if (!hover && !isDraggingColors) {
            const closeHoverTimeout = setTimeout(() => {
                setShowButtomHover(false)
            }, 200)
            setCloseHoverTimeout(closeHoverTimeout)
        }
        else
            setShowButtomHover(true)
    }, [hover, isDraggingColors])

    function handleOnMouseEnter() {
        setHover(true)
        if (closeHoverTimeout)
            clearTimeout(closeHoverTimeout)
    }

    function handleOnMouseLeave() {
        setHover(false)
    }

    return (
        <motion.div
            className={styles.container}
            initial='hidden'
            animate='visible'
            variants={motionVariants}
            ref={productRef}
            style={{
                height: width * 1.575,
                width: width,
                marginBottom: width * 0.2,
                textDecoration: 'none',
                ...style
            }}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
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
                            height: height
                        }}
                    >
                        {product.colors.map((color_id, i) =>
                            <Image
                                quality={100}
                                key={i}
                                src={product.images.filter(img => img.color_id === color_id)[product.image_hover_index].src}
                                sizes={`${height * 2 / 3}px`}
                                fill
                                alt={product.title}
                                style={{
                                    zIndex: currentVariant.color_id === color_id ? 3 : 2,
                                    opacity: currentVariant.color_id === color_id ? 3 : 2,
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
                        height: height,
                    }}
                >
                    {product.colors.map((color_id, i) =>
                        <Image
                            quality={100}
                            key={i}
                            src={product.images.filter(img => img.color_id === color_id)[product.image_showcase_index].src}
                            fill
                            sizes={`${height * 2 / 3}px`}
                            alt={product.title}
                            onLoadingComplete={() => setImageLoad(true)}
                            style={{
                                zIndex: currentVariant.color_id === color_id ? 1 : 0,
                                opacity: currentVariant.color_id === color_id ? 1 : 0,
                            }}
                        />
                    )}
                </div>
                {!imageLoad &&
                    <Skeleton
                        variant="rectangular"
                        width={width}
                        height={height}
                        sx={{
                            backgroundColor: 'rgb(50, 50, 50)',
                            borderTopRightRadius: '0.5rem',
                            borderTopLeftRadius: '0.5rem',
                            position: 'absolute',
                        }}
                    />
                }
                <div
                    className={styles.infos}
                >
                    {product.sold_out &&
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
                        {product.sold_out &&
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
                            {userCurrency.symbol} {(convertDolarToCurrency(product.min_price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)}
                        </p>
                    </div>
                    <div className={styles.infoBottomPadding}>
                    </div>
                </div>
            </Link>
            {supportsHoverAndPointer && showButtomHover &&
                <motion.div
                    onClick={handleBottomHoverClick}
                    className={styles.bottomHover}
                    ref={bottomHoverRef}
                    initial='hidden'
                    animate={!isDragging && (hover || (isDraggingColors && scrollColorsActive)) ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {
                            bottom: 0,
                        },
                        visible: {
                            bottom: '-12%',
                            boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
                        }
                    }}
                    style={{
                        justifyContent: scrollColorsActive ? 'flex-start' : 'center',
                    }}
                >
                    <motion.div
                        className='flex row align-end justify-center'
                        style={{
                            height: '100%',
                            gap: colorsButtonsGap,
                            paddingBottom: width * 0.035,
                            paddingLeft: width * 0.02,
                            paddingRight: width * 0.02,
                            cursor: isDraggingColors ? 'grabbing' : 'grab',
                        }}
                        dragConstraints={bottomHoverRef.current ? bottomHoverRef : { right: 0, left: 0 }}
                        initial={{ x: 0 }}
                        drag={scrollColorsActive ? 'x' : false}
                        dragElastic={0.25}
                        dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                        onDragStart={handleDragColorsStart}
                        onDragEnd={handleDragColorsEnd}
                        onMouseDown={handleColorsMouseDown}
                        onTouchStart={handleColorsMouseDown}
                    >
                        {product.colors.length > 1
                            ? product.colors.map((color_id, i) =>
                                <ColorButton
                                    key={i}
                                    style={{
                                        height: colorButtonSize,
                                        width: colorButtonSize,
                                        pointerEvents: isDraggingColors ? 'none' : 'auto',
                                    }}
                                    selected={currentVariant.color_id === color_id}
                                    color={COLORS_POOL.find(cl => cl.id === color_id)}
                                    onMouseUp={handleMouseUpColor}
                                    supportsHoverAndPointer={!isDragging && !isDraggingColors && supportsHoverAndPointer}
                                />
                            )
                            : <Link
                                href={url}
                                draggable={false}
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
                                        fontWeight: '700'
                                    }}
                                >
                                    MORE INFO
                                </Button>
                            </Link>
                        }
                    </motion.div>
                </motion.div>
            }
        </motion.div>
    )
}
