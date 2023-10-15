import styles from '@/styles/components/ImagesSlider.module.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';

export default function ImagesSlider(props) {
    const {
        images,
        style,
        width = 450,
        height = width * 10 / 9,
        supportsHoverAndPointer,
        colors,
        currentColor,
    } = props

    const carouselRef = useRef(null)
    const optionsRef = useRef(null)
    const optionsContainerRef = useRef(null)
    const innerRef = useRef(null)
    const innerOptionsRef = useRef(null)

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const [carouselAnchor, setCarouselAnchor] = useState(0)
    const [optionAnchor, setOptionAnchor] = useState(0)

    const [draggingOffSetTimeOut, setDraggingOffSetTimeOut] = useState()

    const [isDragging, setIsDragging] = useState(false)
    const [slideMoving, setSlideMoving] = useState(false)
    const [isDraggingOptions, setIsDraggingOptions] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false)
    const [antVisualBugOptions, setAntVisualBugOptions] = useState(false)

    function handleDragStart() {
        setIsDragging(true)
        setSlideMoving(true)
        document.body.style.cursor = 'grabbing'
        if (slideMoving) {
            clearTimeout(draggingOffSetTimeOut)
        }
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

            if (multiploMaisProximoDeXTranslate === carouselAnchor)
                setCarouselAnchor(multiploMaisProximoDeXTranslate + 0.00000001) // solução temporaria
            else
                setCarouselAnchor(multiploMaisProximoDeXTranslate)
            setCurrentImgIndex(newIndex)
            setSlideMoving(false)
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
                    setOptionAnchor(-scrollOffset + xTranslate)
                } else if (optionRect.left < containerRect.left) {
                    const computedStyle = window.getComputedStyle(innerOptionsElement)
                    const transform = computedStyle.getPropertyValue('transform')
                    const transformMatrix = new DOMMatrix(transform)
                    const xTranslate = transformMatrix.m41
                    const scrollOffset = optionRect.left - containerRect.left
                    setOptionAnchor(-scrollOffset + xTranslate)
                }
            }
        }
    }

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
                }}
            >
                <motion.div
                    className={styles.inner}
                    ref={innerRef}
                    dragConstraints={carouselRef}
                    initial={{ x: 0 }}
                    animate={{ x: carouselAnchor }}
                    transition={{ type: 'spring', stiffness: 1000, damping: 200 }}
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
                            {images.filter(img => img.color_id === cl.id).map((img, j) =>
                                <img
                                    key={j}
                                    className={styles.imgView}
                                    src={img.src}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
            <motion.div
                className={styles.options}
                ref={optionsRef}
                style={{
                    paddingTop: width * 0.025,
                    width: width,
                    height: height * 0.25,
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
                    dragConstraints={optionsRef}
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
                                gap: width * 0.025,
                                position: i === 0 ? 'relative' : 'absolute',
                                zIndex: cl.id === currentColor.id ? 1 : 0,
                                opacity: cl.id === currentColor.id ? 1 : 0,
                            }}
                        >
                            {images.filter(img => img.color_id === currentColor.id).map((img, j) =>
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
                                            opacity: currentImgIndex === j
                                                ? 0
                                                : undefined
                                        }}
                                    >
                                    </div>
                                    <img
                                        className={styles.imgOption}
                                        src={img.src}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div >
    )
}
