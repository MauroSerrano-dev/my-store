import styles from '@/styles/components/ImagesSlider.module.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { useAppContext } from './contexts/AppContext';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

export default function ImagesSlider(props) {
    const {
        images,
        style,
        width = 450,
        height = width * 10 / 9,
        colors,
        currentColor,
        currentPosition,
    } = props

    const {
        windowWidth,
        supportsHoverAndPointer,
    } = useAppContext()

    const fullScreen = width === windowWidth

    const carouselRef = useRef(null)
    const optionsRef = useRef(null)
    const optionsContainerRef = useRef(null)
    const innerRef = useRef(null)
    const innerOptionsRef = useRef(null)

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const [carouselAnchor, setCarouselAnchor] = useState(0)
    const [optionAnchor, setOptionAnchor] = useState(0)

    const [draggingOffSetTimeOut, setDraggingOffSetTimeOut] = useState()

    const [imagesLoad, setImagesLoad] = useState([])
    const [optionsImagesLoad, setOptionsImagesLoad] = useState([])

    const [isDragging, setIsDragging] = useState(false)
    const [isDraggingOptions, setIsDraggingOptions] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false)
    const [antVisualBugOptions, setAntVisualBugOptions] = useState(false)

    const OPTIONS_HEIGHT = height * 0.25
    const OPTIONS_PADDING_TOP = width * 0.025
    const OPTIONS_GAP = width * 0.025

    function handleDragStart() {
        setIsDragging(true)
        document.body.style.cursor = 'grabbing'
        clearTimeout(draggingOffSetTimeOut)
    }

    function handleDragOptionsStart() {
        setIsDraggingOptions(true)
        document.body.style.cursor = 'grabbing'
    }

    function handleDragEnd() {
        setAntVisualBug(false)
        document.body.style.cursor = 'auto'
        setIsDragging(false)

        const timeOut = setTimeout(() => {
            const innerElement = innerRef.current
            const computedStyle = window.getComputedStyle(innerElement)
            const transform = computedStyle.getPropertyValue('transform')
            const transformMatrix = new DOMMatrix(transform)
            const xTranslate = transformMatrix.m41

            const newIndex = Math.abs(Math.round(xTranslate / width))

            const multiploMaisProximoDeXTranslate = newIndex * -width

            setCarouselAnchor(prev => prev === multiploMaisProximoDeXTranslate
                ? multiploMaisProximoDeXTranslate + 0.00000001 // solução temporaria
                : multiploMaisProximoDeXTranslate
            )

            setCurrentImgIndex(newIndex)
            ensureOptionVisible(newIndex)
        }, 200)
        setDraggingOffSetTimeOut(timeOut)
    }
    function handleDragOptionsEnd() {
        setAntVisualBugOptions(false)
        document.body.style.cursor = 'auto'
        setIsDraggingOptions(false)
    }

    function handleMouseDown() {
        setAntVisualBug(true)
    }

    function handleMouseOptionsDown() {
        setAntVisualBugOptions(true)
    }

    function handleOptionClick(i) {
        setCarouselAnchor(-width * i)
        setCurrentImgIndex(i)
        ensureOptionVisible(i)
    }

    function ensureOptionVisible(selectedIndex) {
        const innerOptionsElement = innerOptionsRef.current;
        if (innerOptionsElement) {
            const optionElement = optionsContainerRef.current.children[selectedIndex];
            if (optionElement) {
                const containerRect = optionsRef.current.getBoundingClientRect()
                const optionRect = optionElement.getBoundingClientRect()

                if (optionRect.right > containerRect.right) {
                    const computedStyle = window.getComputedStyle(innerOptionsElement)
                    const transform = computedStyle.getPropertyValue('transform')
                    const transformMatrix = new DOMMatrix(transform)
                    const xTranslate = transformMatrix.m41
                    const scrollOffset = optionRect.right - containerRect.right
                    setOptionAnchor(prev => prev === -scrollOffset + xTranslate
                        ? -scrollOffset + xTranslate + 0.00000001 // solução temporaria
                        : -scrollOffset + xTranslate
                    )
                } else if (optionRect.left < containerRect.left) {
                    const computedStyle = window.getComputedStyle(innerOptionsElement)
                    const transform = computedStyle.getPropertyValue('transform')
                    const transformMatrix = new DOMMatrix(transform)
                    const xTranslate = transformMatrix.m41
                    const scrollOffset = optionRect.left - containerRect.left
                    setOptionAnchor(prev => prev === -scrollOffset + xTranslate
                        ? -scrollOffset + xTranslate + 0.00000001 // solução temporaria
                        : -scrollOffset + xTranslate
                    )
                }
            }
        }
    }

    useEffect(() => {
        console.log('currentPosition', currentPosition, images)
    }, [currentPosition])

    return (
        <div
            className={styles.container}
            style={{
                ...style,
            }}
        >
            <motion.div
                className={styles.view}
                ref={carouselRef}
                style={{
                    width: width,
                    height: height,
                    borderRadius: fullScreen ? 0 : '0.3rem',
                }}
            >
                <motion.div
                    className={styles.inner}
                    ref={innerRef}
                    dragConstraints={carouselRef.current ? carouselRef : { right: 0, left: 0 }}
                    initial={{ x: 0 }}
                    animate={{ x: carouselAnchor }}
                    transition={{ type: 'spring', stiffness: 2000, damping: 400 }}
                    drag="x"
                    dragElastic={0.25}
                    dragTransition={{ power: supportsHoverAndPointer ? 0.04 : 0.25, timeConstant: 200 }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                >
                    {colors.map((cl, i) =>
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                height: '100%',
                                position: i === 0 ? 'relative' : 'absolute',
                                zIndex: cl.id === currentColor.id ? 1 : 0,
                                opacity: cl.id === currentColor.id ? 1 : 0,
                            }}
                        >
                            {images.filter(img => img.color_id === cl.id && (!img.position || img.position === currentPosition)).map((img, j) =>
                                <div
                                    key={j}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderTopLeftRadius: j === 0 && !fullScreen ? '0.3rem' : 0,
                                        borderBottomLeftRadius: j === 0 ? '0.3rem' : 0,
                                        borderTopRightRadius: j === images.filter(img => img.color_id === cl.id).length - 1 && !fullScreen ? '0.3rem' : 0,
                                        borderBottomRightRadius: j === images.filter(img => img.color_id === cl.id).length - 1 ? '0.3rem' : 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: width,
                                            height: height,
                                        }}
                                    >
                                        <Image
                                            priority
                                            src={img.src}
                                            quality={100}
                                            alt='product preview'
                                            fill
                                            sizes={`${height * 2 / 3}px`}
                                            style={{
                                                pointerEvents: 'none',
                                                objectFit: 'cover',
                                                opacity: imagesLoad.includes(`${i}${j}`) ? 1 : 0,
                                                transition: 'opacity ease-in-out 200ms'
                                            }}
                                            onLoad={() => {
                                                setImagesLoad(prev => [...prev, `${i}${j}`])
                                            }}
                                        />
                                    </div>
                                    {!imagesLoad.includes(`${i}${j}`) &&
                                        <Skeleton
                                            variant="rectangular"
                                            width={width}
                                            height={height}
                                            sx={{
                                                backgroundColor: 'rgb(50, 50, 50)',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
            <motion.div
                className={styles.options}
                ref={optionsRef}
                style={{
                    paddingTop: OPTIONS_PADDING_TOP,
                    width: width,
                    height: OPTIONS_HEIGHT,
                }}
            >
                <motion.div
                    ref={innerOptionsRef}
                    className='flex'
                    style={{
                        height: '100%',
                        cursor: isDraggingOptions ? 'grabbing' : 'grab',
                        position: 'relative',
                    }}
                    dragConstraints={optionsRef.current ? optionsRef : { right: 0, left: 0 }}
                    initial={{ x: 0 }}
                    animate={{ x: optionAnchor }}
                    transition={{ type: 'spring', stiffness: 120, damping: 25 }}
                    drag="x"
                    dragElastic={0.25}
                    dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                    onDragStart={handleDragOptionsStart}
                    onDragEnd={handleDragOptionsEnd}
                    onMouseDown={handleMouseOptionsDown}
                    onTouchStart={handleMouseOptionsDown}
                >
                    {colors.map((cl, i) =>
                        <div
                            ref={optionsContainerRef}
                            key={i}
                            style={{
                                display: 'flex',
                                height: '100%',
                                gap: OPTIONS_GAP,
                                position: i === 0 ? 'relative' : 'absolute',
                                zIndex: cl.id === currentColor.id ? 1 : 0,
                                opacity: cl.id === currentColor.id ? 1 : 0,
                            }}
                        >
                            {images.filter(img => img.color_id === currentColor.id && (!img.position || img.position === currentPosition)).map((img, j) =>
                                <div
                                    className={styles.imgOptionContainer}
                                    key={j}
                                    onClick={() => handleOptionClick(j)}
                                    style={{
                                        pointerEvents: isDraggingOptions ? 'none' : 'auto'
                                    }}
                                >
                                    <div
                                        className={styles.optionShadow}
                                        style={{
                                            opacity: currentImgIndex !== j && optionsImagesLoad.includes(`${i}${j}`)
                                                ? undefined
                                                : 0,
                                            transition: 'opacity ease-in-out 200ms',
                                            zIndex: 1
                                        }}
                                    >
                                    </div>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: (OPTIONS_HEIGHT - OPTIONS_PADDING_TOP) * 0.9,
                                            height: OPTIONS_HEIGHT - OPTIONS_PADDING_TOP
                                        }}
                                    >
                                        <Image
                                            priority
                                            src={img.src}
                                            quality={100}
                                            sizes={`${OPTIONS_HEIGHT * 2 / 3}px`}
                                            alt='product image'
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                                opacity: optionsImagesLoad.includes(`${i}${j}`) ? 1 : 0,
                                                transition: 'opacity ease-in-out 200ms'
                                            }}
                                            onLoad={() => {
                                                setOptionsImagesLoad(prev => [...prev, `${i}${j}`])
                                            }}
                                        />
                                    </div>
                                    {!optionsImagesLoad.includes(`${i}${j}`) &&
                                        <Skeleton
                                            variant="rectangular"
                                            width={(OPTIONS_HEIGHT - OPTIONS_PADDING_TOP) * 0.9}
                                            height={OPTIONS_HEIGHT - OPTIONS_PADDING_TOP}
                                            sx={{
                                                backgroundColor: 'rgb(50, 50, 50)',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div >
    )
}