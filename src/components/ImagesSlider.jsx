import styles from '@/styles/components/ImagesSlider.module.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';

export default function ImagesSlider(props) {
    const {
        images,
        style,
        width = 450,
        height = width * 10 / 9,
        index,
        onChange,
        supportsHoverAndPointer,
    } = props

    const carouselRef = useRef(null)
    const optionsRef = useRef(null)
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
            console.log('clearTime')
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
            ensureOptionVisible(newIndex)
            if (onChange)
                onChange(newIndex)
            else
                setCurrentImgIndex(newIndex)
            setSlideMoving(false)
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
        if (onChange)
            onChange(i)
        else
            setCurrentImgIndex(i)
    }

    useEffect(() => {
        if (index)
            setCarouselAnchor(index * -width)
    }, [index])

    function ensureOptionVisible(selectedIndex) {
        const innerOptionsElement = innerOptionsRef.current;
        if (innerOptionsElement) {
            const optionElements = innerOptionsElement.children;
            const optionElement = optionElements[selectedIndex];
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
                    transition={{ type: 'spring', stiffness: 120, damping: 25 }}
                    drag="x"
                    dragElastic={0.25}
                    dragTransition={{ power: supportsHoverAndPointer ? 0.04 : 0.2, timeConstant: 200 }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                >
                    {images.map((img, i) =>
                        <img
                            key={i}
                            className={styles.imgView}
                            src={img.src}
                        />
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
                        gap: width * 0.025,
                        cursor: isDraggingOptions ? 'grabbing' : 'grab',
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
                    {images.map((img, i) =>
                        <div
                            className={styles.imgOptionContainer}
                            key={i}
                            onClick={() => handleOptionClick(i)}
                            onTouchStart={() => handleOptionClick(i)}
                            style={{
                                pointerEvents: isDraggingOptions ? 'none' : 'auto'
                            }}
                        >
                            <div
                                className={styles.optionShadow}
                                style={{
                                    opacity: (index ? index : currentImgIndex) === i
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
                </motion.div>
            </motion.div>
        </div>
    )
}
