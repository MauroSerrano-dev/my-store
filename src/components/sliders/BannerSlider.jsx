import styles from '@/styles/components/sliders/BannerSlider.module.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { useAppContext } from '@/components/contexts/AppContext';
import Image from 'next/image';
import { Skeleton } from '@mui/material';
import Link from 'next/link';

export default function BannerSlider(props) {
    const {
        images,
        style,
        autoplay = true,
    } = props

    const {
        windowWidth,
        supportsHoverAndPointer,
    } = useAppContext()

    const carouselRef = useRef(null)
    const innerRef = useRef(null)

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const [carouselAnchor, setCarouselAnchor] = useState(0)

    const [draggingOffSetTimeOut, setDraggingOffSetTimeOut] = useState()
    const [autoSetTimeOut, setAutoSetTimeOut] = useState()

    const [isDragging, setIsDragging] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false)

    useEffect(() => {
        autoRun()
    }, [currentImgIndex, windowWidth])

    function autoRun() {
        if (autoplay) {
            clearTimeout(autoSetTimeOut)
            const timeOut = setTimeout(() => {
                handleOptionClick(currentImgIndex + 2 > images.length ? 0 : currentImgIndex + 1)
            }, 5000)
            setAutoSetTimeOut(timeOut)
        }
    }

    function handleDragStart() {
        setIsDragging(true)
        document.body.style.cursor = 'grabbing'
        clearTimeout(autoSetTimeOut)
        clearTimeout(draggingOffSetTimeOut)
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

            const newIndex = Math.abs(Math.round(xTranslate / windowWidth))

            const multiploMaisProximoDeXTranslate = newIndex * -windowWidth

            setCarouselAnchor(prev => prev === multiploMaisProximoDeXTranslate
                ? multiploMaisProximoDeXTranslate + 0.00000001 // solução temporaria
                : multiploMaisProximoDeXTranslate
            )

            setCurrentImgIndex(newIndex)
            autoRun()
        }, 200)
        setDraggingOffSetTimeOut(timeOut)
    }

    function handleMouseDown() {
        setAntVisualBug(true)
    }

    function handleOptionClick(i) {
        if (windowWidth) {
            setCarouselAnchor(-windowWidth * i)
            setCurrentImgIndex(i)
        }
    }

    return (
        <div
            className={styles.container}
            style={{
                ...style,
            }}
        >
            {images.length > 1
                ? <motion.div
                    className={styles.view}
                    ref={carouselRef}
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
                        {images.map((img, i) =>
                            <Link
                                className={`${styles.bannerImage} noUnderline`}
                                draggable={false}
                                href={img.href}
                                key={i}
                                style={{
                                    pointerEvents: isDragging ? 'none' : 'auto'
                                }}
                            >
                                <Image
                                    priority
                                    quality={100}
                                    src={img.src}
                                    alt={img.alt}
                                    sizes='100%'
                                    fill
                                    draggable={false}
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                    }}
                                />
                            </Link>
                        )}
                    </motion.div>
                    <div className={styles.options}>
                        {images.length > 1 && images.map((img, i) =>
                            <button
                                key={i}
                                className={`${styles.option} buttonInvisible`}
                                onClick={() => handleOptionClick(i)}
                            >
                                <div
                                    className={styles.optionCircle}
                                    style={{
                                        backgroundColor: currentImgIndex === i ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'
                                    }}
                                >
                                </div>
                            </button>
                        )}
                    </div>
                </motion.div>
                : <Link
                    className={`${styles.bannerImage} noUnderline`}
                    draggable={false}
                    href={images[0].href}
                >
                    <Image
                        priority
                        quality={100}
                        src={images[0].src}
                        sizes='100%'
                        fill
                        alt={images[0].alt}
                        draggable={false}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'top',
                        }}
                    />
                </Link>
            }
        </div>
    )
}