import styles from '@/styles/components/products/Product.module.css'
import { useEffect, useState, useRef } from 'react'
import { Skeleton } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion"
import { COLORS_POOL, PRODUCTS_TYPES, LIMITS } from '@/consts'
import ColorButton from '../ColorButton'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import HeartButton from '../buttons-icon/HeartButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { showToast } from '@/utils/toasts'
import { useAppContext } from '../contexts/AppContext'
import MyButton from '@/components/material-ui/MyButton';

/**
 * @param {object} props - Component props.
 * @param {object} props.product - Product props.
 * @param {object} props.motionVariants - Component motionVariants.
 * @param {object} props.style - Product style.
 * @param {string} props.width - Component width.
 * @param {boolean} props.responsive - Responsive width.
 * @param {boolean} props.supportsHoverAndPointer - Device supportsHoverAndPointer.
 */

export default function Product(props) {
    const {
        width = 225,
        isDragging = false,
        product,
        inicialVariantId,
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
        hideWishlistButton,
        showDeleteButton,
        onDeleteClick,
    } = props

    const {
        setSession,
        session,
        supportsHoverAndPointer,
        userCurrency,
    } = useAppContext()

    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    const height = width * 10 / 9

    const productRef = useRef(null)
    const bottomHoverRef = useRef(null)

    const [currentVariant, setCurrentVariant] = useState(inicialVariantId ? product.variants.find(vari => vari.id === inicialVariantId) : product.variants[0])

    const [isDraggingColors, setIsDraggingColors] = useState(false)

    const [imageLoad, setImageLoad] = useState(false)

    const [antVisualBug, setAntVisualBug] = useState(false)

    const [hover, setHover] = useState(false)
    const [showButtomHover, setShowButtomHover] = useState(false)

    const [closeHoverTimeout, setCloseHoverTimeout] = useState()

    const colorButtonSize = width * 0.13
    const colorsButtonsGap = width * 0.031

    const scrollColorsActive = (colorButtonSize + colorsButtonsGap) * product.colors_ids.length > width

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

    const URL = `/product/${product.id}${product.variants[0].id === currentVariant.id ? '' : `?cl=${COLORS_POOL[currentVariant.color_id].id_string}`}`

    function handleMouseUpColor(event, color) {
        event.stopPropagation()
        event.preventDefault()
        setCurrentVariant(currentVariant.find(vari => vari.color_id === color.id))
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

    function handleWishlist(event) {
        event.preventDefault()

        const add = !session.wishlist_products_ids.includes(product.id)

        if (add && session.wishlist_products_ids.length >= LIMITS.wishlist_products) {
            showToast({ msg: tToasts('wishlist_limit'), type: 'error' })
            return
        }

        setSession(prevSession => (
            {
                ...prevSession,
                wishlist_products_ids: add
                    ? session.wishlist_products_ids.concat(product.id)
                    : session.wishlist_products_ids.filter(prod_id => prod_id !== product.id)
            }
        ))

        const options = {
            method: add ? 'POST' : 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                wishlist_id: session.wishlist_id,
                product: { id: product.id }
            }),
        }

        fetch("/api/wishlists/wishlist-products", options)
            .then(response => response.json())
            .catch(err => {
                setSession(prevSession => (
                    {
                        ...prevSession,
                        wishlist_products_ids: add
                            ? session.wishlist_products_ids.filter(prod_id => prod_id !== product.id)
                            : session.wishlist_products_ids.concat(product.id)
                    }
                ))
                console.error(err)
            })
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
                marginBottom: supportsHoverAndPointer ? width * 0.2 : 0,
                textDecoration: 'none',
                ...style
            }}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {!hideWishlistButton && session && supportsHoverAndPointer &&
                <motion.div
                    className={styles.wishlistButton}
                    onClick={handleWishlist}
                    initial='hidden'
                    animate={hover ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                        },
                    }}
                >
                    <HeartButton
                        style={{
                            top: '1px',
                            color: 'var(--global-white)'
                        }}
                        checked={session.wishlist_products_ids.includes(product.id)}
                        size={width * 0.13}
                    />
                </motion.div>
            }
            {showDeleteButton &&
                <button
                    className={`${styles.wishlistButton} buttonInvisible`}
                    onClick={onDeleteClick}
                >
                    <CloseRoundedIcon
                        style={{
                            fontSize: width * 0.12,
                        }}
                    />
                </button>
            }
            <Link
                href={URL}
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
                        {product.colors_ids.map((color_id, i) =>
                            <Image
                                quality={100}
                                key={i}
                                src={product.images.filter(img => img.color_id === color_id)[product.image_hover_index].src}
                                sizes={`${height * 2 / 3}px`}
                                fill
                                alt={product.title}
                                style={{
                                    zIndex: currentVariant.color_id === color_id ? 3 : 2,
                                    opacity: currentVariant.color_id === color_id ? 1 : 0,
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
                    {product.colors_ids.map((color_id, i) =>
                        <Image
                            priority={i === 0}
                            quality={100}
                            key={i}
                            src={product.images.filter(img => img.color_id === color_id)[product.image_showcase_index].src}
                            fill
                            sizes={`${height * 2 / 3}px`}
                            alt={product.title}
                            onLoad={() => setImageLoad(true)}
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
                    <div
                        className={styles.tagContainer}
                        style={{
                            fontSize: width < 150 ? width * 0.07 : width * 0.055,
                            height: width < 150 ? '20%' : '17%',
                            top: width < 150 ? '-10%' : '-8.5%',
                            backgroundColor: PRODUCTS_TYPES.find(type => type.id === product.type_id).color || 'var(--primary)',
                        }}
                    >
                        <p>
                            {
                                tCommon(PRODUCTS_TYPES.find(type => type.id === product.type_id).id)
                            }
                        </p>
                    </div>
                    <div
                        className={styles.nameContainer}
                    >
                        <p
                            className={styles.name}
                            style={{
                                fontSize: width * 0.07
                            }}
                        >
                            {product.title}
                        </p>
                    </div>
                    <div className={styles.priceContainer}>
                        <div className={styles.prices}>
                            {product.promotion &&
                                <p
                                    className={styles.oldPrice}
                                    style={{
                                        fontSize: width * 0.056
                                    }}
                                >
                                    {userCurrency?.symbol} {(Math.round((product.promotion ? product.promotion.min_price_original : product.min_price) * userCurrency?.rate) / 100).toFixed(2)}
                                </p>
                            }
                            <p
                                className={styles.price}
                                style={{
                                    fontSize: width * 0.085,
                                }}
                            >
                                {userCurrency?.symbol} {(Math.round(product.min_price * userCurrency?.rate) / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    {
                        supportsHoverAndPointer &&
                        <div
                            className={styles.infoBottomPadding}
                            style={{
                                width: product.colors_ids.length <= 1 ? '75%' : `${Math.min(product.colors_ids.length * 18, 100)}%`,
                                borderBottom: !isDragging && (hover || (isDraggingColors && scrollColorsActive))
                                    ? '1px rgba(0, 0, 0, 0.35) solid'
                                    : '1px transparent solid',
                                boxShadow: !isDragging && (hover || (isDraggingColors && scrollColorsActive))
                                    ? '0px 0.5px 3px 0.2px rgba(0, 0, 0, 0.2), 0px 1px 3px 0.5px rgba(0, 0, 0, 0.14), 0px 2px 3px 1px rgba(0, 0, 0, 0.12)'
                                    : 'none'
                            }}
                        >
                        </div>
                    }
                </div>
                {product.promotion &&
                    <div
                        className={styles.promotionContainer}
                        style={{
                            fontSize: width < 190 ? width * 0.07 : width * 0.055,
                            paddingTop: width * 0.012,
                            paddingBottom: width * 0.015,
                            paddingLeft: width * 0.03,
                            paddingRight: width * 0.03,
                            top: width * 0.03,
                            left: width * 0.03,
                            backgroundColor: product.promotion
                                ? 'var(--promotion-color)'
                                : PRODUCTS_TYPES.find(type => type.id === product.type_id).color || 'var(--primary)',
                        }}
                    >
                        <p>
                            {
                                Math.round(100 * product.promotion.percentage) + '% OFF'
                            }
                        </p>
                    </div>
                }
            </Link>
            {
                supportsHoverAndPointer && showButtomHover &&
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
                        {product.colors_ids.length > 1
                            ? product.colors_ids.map((color_id, i) =>
                                <ColorButton
                                    key={i}
                                    style={{
                                        height: colorButtonSize,
                                        width: colorButtonSize,
                                        pointerEvents: isDraggingColors ? 'none' : 'auto',
                                    }}
                                    selected={currentVariant.color_id === color_id}
                                    color={COLORS_POOL[color_id]}
                                    onMouseUp={handleMouseUpColor}
                                    supportsHoverAndPointer={!isDragging && !isDraggingColors && supportsHoverAndPointer}
                                />
                            )
                            : <Link
                                href={URL}
                                draggable={false}
                                style={{
                                    width: width * 0.7,
                                }}
                            >
                                <MyButton
                                    size='small'
                                    style={{
                                        color: 'var(--text-white)',
                                        width: '100%',
                                        fontSize: width * 0.053,
                                        fontWeight: '700'
                                    }}
                                >
                                    {tCommon('more_info_button')}
                                </MyButton>
                            </Link>
                        }
                    </motion.div>
                </motion.div>
            }
        </motion.div>
    )
}