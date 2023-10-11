import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/components/carousels/Carousel.module.css'
import { Skeleton } from '@mui/material';

export default function Carousel(props) {
    const {
        items,
        supportsHoverAndPointer,
        itemStyle,
        skeletonStyle,
    } = props

    const carouselRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [antVisualBug, setAntVisualBug] = useState(false) //você é um gênio

    function handleDragStart() {
        setIsDragging(true)
    }

    function handleDragEnd() {
        setAntVisualBug(false)
        setTimeout(() => {
            setIsDragging(false)
        }, 200)
    }


    function handleMouseDown() {
        setAntVisualBug(true)
    }

    return (
        <motion.div
            className={styles.container}
            ref={carouselRef}
        >
            <motion.div
                className={styles.inner}
                dragConstraints={carouselRef}
                initial={{ x: 0 }}
                drag="x"
                dragElastic={0.25}
                dragTransition={{ power: supportsHoverAndPointer ? 0.07 : 0.3, timeConstant: 200 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{
                    zIndex: 1,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    position: 'relative',
                    ...itemStyle,
                }}
            >
                {items.length > 0
                    ? items.map((item, i) =>
                        <div
                            key={i}
                            style={{
                                pointerEvents: isDragging ? 'none' : 'auto',
                                willChange: 'transform',
                            }}
                        >
                            {item}
                        </div>
                    )
                    : <div
                        className={styles.inner}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skel, i) =>
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                sx={{
                                    backgroundColor: 'rgb(50, 50, 50)',
                                    borderRadius: '0.5rem',
                                    ...skeletonStyle,
                                }}
                            />
                        )}
                    </div>
                }
            </motion.div>
        </motion.div>
    )
}