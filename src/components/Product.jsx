import styles from '@/styles/components/Product.module.css'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'

export default function Product(props) {
    const {
        responsive,
        img,
        imgHover,
        name,
        oldPrice,
        price
    } = props

    const [isHovered, setIsHovered] = useState(false)

    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState(false);

    useEffect(() => {
        // Use useEffect to set the supportsHoverAndPointer state after the component mounts
        setSupportsHoverAndPointer(
            window.matchMedia('(hover: hover)').matches &&
            window.matchMedia('(pointer: fine)').matches
        )
    }, [])

    function handleMouseEnter() {
        if (supportsHoverAndPointer) {
            console.log('a')
            setIsHovered(true)
        }
    }

    function handleMouseLeave() {
        if (supportsHoverAndPointer)
            setIsHovered(false)
    }

    return (
        <div
            className={styles.container}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                height: responsive ? '100%' : '400px',
                width: responsive ? '100%' : '230px'
            }}
        >
            {supportsHoverAndPointer &&
                <div
                    className={styles.imgHoverContainer}
                    style={{
                        opacity: isHovered ? 1 : 0
                    }}
                >
                    <img
                        src={imgHover}
                        className={styles.img}
                    />
                </div>
            }
            <div className={styles.imgContainer}>
                <img
                    src={img}
                    className={styles.img}
                />
            </div>
            <div className={styles.infos}>
                <p className={styles.name}>{name}</p>
                {oldPrice &&
                    <p className={styles.oldPrice}>{oldPrice}</p>
                }
                <p className={styles.price}>{price}</p>
            </div>
            {supportsHoverAndPointer &&
                <div
                    className={styles.buttonMore}
                    style={{
                        bottom: isHovered ? '-12%' : '0'
                    }}
                >
                    <Button
                        variant='contained'
                        size='small'
                        sx={{
                            color: 'var(--text-white)'
                        }}
                    >
                        More Options
                    </Button>
                </div>
            }
        </div>
    )
}
