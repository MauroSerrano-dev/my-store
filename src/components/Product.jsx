import styles from '@/styles/components/Product.module.css'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'
import { motion } from "framer-motion";
import { convertDolarToCurrency } from '../../consts';
import ColorButton from './ColorButton';

/**
 * @param {object} props - Component props.
 * @param {object} props.product - Product props.
 * @param {object} props.motionVariants - Component motionVariants.
 * @param {string} props.width - Component width.
 * @param {boolean} props.responsive - Responsive width.
 * @param {boolean} props.loading - Website loading.
 * @param {boolean} props.supportsHoverAndPointer - Device supportsHoverAndPointer.
 * @param {boolean} props.outOfStock - Product outOfStock.
 * @param {function} props.setLoading - Website setLoading.
 */

const COLORS_LIMIT_TO_SCROLL = 6

export default function Product(props) {
    const {
        responsive,
        outOfStock,
        userCurrency,
        width = '225px',
        motionVariants,
        supportsHoverAndPointer,
        setLoading,
        loading,
        product,
    } = props

    const [isHovered, setIsHovered] = useState(false)
    const productRef = useRef(null)
    const bottomHoverRef = useRef(null)
    const [productWidth, setProductWidth] = useState() //string in px
    const [currentVariant, setCurrentVariant] = useState(product.variants[0])
    const [dragStartX, setDragStartX] = useState(null)
    const [dragStartY, setDragStartY] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const url = `/product/${product.id}${product.variants[0].id === currentVariant.id ? '' : `?cl=${product.colors.find(c => currentVariant.color_id === c.id).title.toLowerCase()}`}`

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
                setProductWidth(`${productRef.current.offsetWidth}px`);
            }
        }

        window.addEventListener('resize', updateProductWidth);

        updateProductWidth();

        return () => {
            window.removeEventListener('resize', updateProductWidth);
        }
    }, [])

    function handleChangeColor(event, option) {
        event.stopPropagation()
        event.preventDefault()
        setCurrentVariant(product.variants.find(vari => vari.color_id === option.id))
    }

    function handleBottomHoverClick(event) {
        event.stopPropagation()
        event.preventDefault()
    }

    function handleBottomHoverMouseDown(event) {
        const wrapper = bottomHoverRef.current;

        if (!wrapper) return;

        // Obtenha a posição inicial do mouse e a posição do rolagem
        const startX = event.clientX + wrapper.scrollLeft;
        const startY = event.clientY + wrapper.scrollTop;

        // Armazene a posição inicial em estados
        setDragStartX(startX);
        setDragStartY(startY);
        setIsDragging(true);
    }

    function handleBottomHoverMouseMove(event) {
        if (!isDragging) return;

        const wrapper = bottomHoverRef.current;

        if (!wrapper) return;

        // Calcule a distância percorrida pelo mouse
        const deltaX = event.clientX + wrapper.scrollLeft - dragStartX;
        const deltaY = event.clientY + wrapper.scrollTop - dragStartY;

        // Aplique a rolagem com base no movimento do mouse
        wrapper.scrollLeft -= deltaX;
        wrapper.scrollTop -= deltaY;

        // Atualize a posição inicial do mouse
        setDragStartX(event.clientX + wrapper.scrollLeft);
        setDragStartY(event.clientY + wrapper.scrollTop);
    }

    function handleBottomHoverMouseUp() {
        setIsDragging(false);
    }

    function handleBottomHoverMouseLeave() {
        setIsDragging(false);
    }

    return (
        <motion.div
            className={styles.container}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variants={motionVariants}
            initial='hidden'
            animate='visible'
            ref={productRef}
            style={{
                height: responsive ? `calc(${productWidth} * 1.575)` : `calc(${productWidth} * 1.575)`,
                width: responsive ? '100%' : width,
                marginBottom: `calc(${productWidth} * 0.2)`,
                textDecoration: 'none',
                pointerEvents: loading ? 'none' : 'auto',
            }}
        >
            <Link
                href={url}
                onClick={() => setLoading(true)}
                className={`${styles.linkContainer} noUnderline`}
            >
                {supportsHoverAndPointer &&
                    <div
                        className={styles.imgHoverContainer}
                        style={{
                            opacity: isHovered ? 1 : 0,
                            zIndex: 2
                        }}
                    >
                        {product.colors.map((color, i) =>
                            <img
                                key={i}
                                src={product.images.filter(img => img.color_id === color.id)[product.image_hover_index].src}
                                className={styles.img}
                                alt={product.title}
                                style={{
                                    position: i > 0 ? 'absolute' : 'relative',
                                    zIndex: currentVariant.color_id === color.id ? 3 : 2,
                                    opacity: currentVariant.color_id === color.id ? 3 : 2,
                                }}
                            />
                        )}
                    </div>
                }
                <div className={styles.imgContainer}>
                    {product.colors.map((color, i) =>
                        <img
                            key={i}
                            src={product.images.filter(img => img.color_id === color.id)[product.image_showcase_index].src}
                            className={styles.img}
                            alt={product.title}
                            style={{
                                position: i > 0 ? 'absolute' : 'relative',
                                zIndex: currentVariant.color_id === color.id ? 1 : 0,
                                opacity: currentVariant.color_id === color.id ? 1 : 0,
                            }}
                        />
                    )}
                </div>
                <div className={styles.infos}>
                    {product.sold_out.percentage &&
                        <div
                            className={styles.soldOut}
                        >
                            <p
                                style={{
                                    fontSize: `calc(${productWidth} * 0.055)`
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
                        {product.title}
                    </p>
                    <div className={styles.priceContainer}>
                        {product.sold_out.percentage &&
                            <p
                                className={styles.oldPrice}
                                style={{
                                    fontSize: `calc(${productWidth} * 0.056)`
                                }}
                            >
                                {userCurrency.symbol} {(convertDolarToCurrency(product.min_price, userCurrency.code) / 100).toFixed(2)}
                            </p>
                        }
                        <p
                            className={styles.price}
                            style={{
                                fontSize: `calc(${productWidth} * 0.085)`
                            }}
                        >
                            {userCurrency.symbol} {(convertDolarToCurrency(product.min_price * (product.sold_out.percentage ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)}
                        </p>
                    </div>
                </div>
            </Link>
            {supportsHoverAndPointer &&
                <div
                    onClick={handleBottomHoverClick}
                    className={styles.bottomHover}
                    ref={bottomHoverRef}
                    onMouseDown={product.colors.length > COLORS_LIMIT_TO_SCROLL ? handleBottomHoverMouseDown : undefined}
                    onMouseMove={product.colors.length > COLORS_LIMIT_TO_SCROLL ? handleBottomHoverMouseMove : undefined}
                    onMouseUp={product.colors.length > COLORS_LIMIT_TO_SCROLL ? handleBottomHoverMouseUp : undefined}
                    onMouseLeave={product.colors.length > COLORS_LIMIT_TO_SCROLL ? handleBottomHoverMouseLeave : undefined}
                    style={{
                        bottom: isHovered ? '-12%' : '0',
                        justifyContent: product.colors.length > COLORS_LIMIT_TO_SCROLL ? 'flex-start' : 'center',
                    }}
                >
                    {product.colors.length > 1
                        ?
                        <div
                            className='flex row align-end justify-center'
                            style={{
                                height: '100%',
                                gap: '0.4rem',
                                paddingBottom: `calc(${productWidth} * 0.03)`,
                                paddingLeft: `calc(${productWidth} * 0.02)`,
                                paddingRight: `calc(${productWidth} * 0.02)`,
                            }}
                        >
                            {product.colors.map((color, i) =>
                                <ColorButton
                                    key={i}
                                    index={i}
                                    style={{
                                        height: `calc(${productWidth} * 0.13)`,
                                        width: `calc(${productWidth} * 0.13)`,
                                    }}
                                    selected={currentVariant.color_id === color.id}
                                    option={color}
                                    onChange={handleChangeColor}
                                />
                            )}
                        </div>
                        : <Link
                            href={url}
                            onClick={() => setLoading(true)}
                            style={{
                                width: '75%'
                            }}
                        >
                            <Button
                                variant='contained'
                                size='small'
                                sx={{
                                    color: 'var(--text-white)',
                                    width: '100%',
                                    fontSize: `calc(${productWidth} * 0.053)`,
                                    fontWeight: 'bold'
                                }}
                            >
                                MORE INFO
                            </Button>
                        </Link>
                    }
                </div>
            }
        </motion.div>
    )
}
