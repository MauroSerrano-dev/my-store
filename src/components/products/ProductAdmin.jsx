import styles from '@/styles/components/products/ProductAdmin.module.css'
import { useEffect, useState, useRef } from 'react'
import { Checkbox, Skeleton } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion"
import { COLORS_POOL, PRODUCTS_TYPES } from '@/consts'
import ColorButton from '../ColorButton'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useAppContext } from '../contexts/AppContext'
import MyButton from '@/components/material-ui/MyButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'

/**
 * @param {Object} props - Component props.
 * @param {Object} props.product - Product props.
 * @param {Object} props.style - Product style.
 * @param {string} props.width - Component width.
 * @param {boolean} props.responsive - Responsive width.
 * @param {boolean} props.supportsHoverAndPointer - Device supportsHoverAndPointer.
 */

export default function ProductAdmin(props) {
    const {
        width = 225,
        isDragging = false,
        product,
        inicialVariantId,
        style,
        onPromotionClick,
        selected,
        onChangeSelection,
    } = props

    const {
        supportsHoverAndPointer,
        userCurrency,
    } = useAppContext()

    const tCommon = useTranslation('common').t

    const height = width * 10 / 9

    const productRef = useRef(null)
    const bottomHoverRef = useRef(null)

    const [currentVariant, setCurrentVariant] = useState(inicialVariantId ? product.variants.find(vari => vari.id === inicialVariantId) : product.variants.find(vari => vari.color_id === product.colors_ids[0]))

    const [isDraggingColors, setIsDraggingColors] = useState(false)

    const [imageLoad, setImageLoad] = useState(false)

    const [antVisualBug, setAntVisualBug] = useState(false)

    const [hover, setHover] = useState(false)
    const [showButtomHover, setShowButtomHover] = useState(false)

    const [closeHoverTimeout, setCloseHoverTimeout] = useState()

    const colorButtonSize = width * 0.13
    const colorsButtonsGap = width * 0.031

    const scrollColorsActive = (colorButtonSize + colorsButtonsGap) * product.colors_ids.length > width

    const imagesList = product.default_art_position
        ? product.images.filter(img => img.position === product.default_art_position)
        : product.images

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

    const URL = `/admin/products/${product.type_id}/${product.id}`

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
            variants={{
                hidden: {
                    opacity: 0,
                },
                visible: {
                    opacity: 1,
                },
            }}
            transition={{
                duration: 0.2,
            }}
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
            <div className={styles.editButtons}>
                <div
                    className={styles.editButton}
                    style={{
                        width: width * 0.17,
                        height: width * 0.17,
                    }}
                >
                    <Checkbox
                        checked={selected}
                        onChange={onChangeSelection}
                        sx={{
                            color: '#ffffff'
                        }}
                    >
                    </Checkbox>
                </div>
                <Link
                    className={styles.editButton}
                    href={URL.concat('/edit')}
                    style={{
                        width: width * 0.17,
                        height: width * 0.17,
                    }}
                >
                    <EditOutlinedIcon
                        style={{
                            color: 'var(--global-white)',
                        }}
                    />
                </Link>
                <button
                    className={`${styles.editButton} buttonInvisible`}
                    style={{
                        width: width * 0.17,
                        height: width * 0.17,
                    }}
                    onClick={onPromotionClick}
                >
                    <SellOutlinedIcon
                        style={{
                            color: 'var(--global-white)',
                        }}
                    />
                </button>
            </div>
            <Link
                href={URL}
                className={`${styles.linkContainer} noUnderline`}
                draggable={false}
            >
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
                            priority={currentVariant.color_id === color_id}
                            quality={100}
                            key={i}
                            src={imagesList.filter(img => img.color_id === color_id)[product.image_showcase_index].src}
                            fill
                            sizes={`${height * 2 / 3}px`}
                            alt={product.title}
                            onLoad={() => setImageLoad(true)}
                            style={{
                                objectFit: 'cover',
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
                            fontSize: width < 150 ? width * 0.065 : width * 0.055,
                            height: width < 150 ? '20%' : '17%',
                            top: width < 150 ? '-10%' : '-8.5%',
                            backgroundColor: PRODUCTS_TYPES[product.type_id].color || 'var(--primary)',
                        }}
                    >
                        <p>
                            {
                                tCommon(PRODUCTS_TYPES[product.type_id].id)
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
                        <div
                            style={{
                                backgroundColor: product.disabled ? 'var(--color-error)' : 'var(--color-success)',
                                width: width * 0.06,
                                height: width * 0.06,
                                borderRadius: '100%',
                            }}
                        >
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
                                : PRODUCTS_TYPES[product.type_id].color || 'var(--primary)',
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