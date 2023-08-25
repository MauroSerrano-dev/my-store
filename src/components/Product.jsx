import styles from '@/styles/components/Product.module.css'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'

export default function Product(props) {
    const {
        responsive,
        img,
        imgHover,
        name,
        price,
        soldOut,
        outOfStock,
        currencySymbol
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
                {soldOut !== undefined &&
                    <div className={styles.soldOut}>
                        <p>{Math.round(100 * (1 - (soldOut / price)))}% OFF</p>
                    </div>
                }
                {outOfStock &&
                    <div className={styles.outOfStock}>
                        <p>OUT OF STOCK</p>
                    </div>
                }
                <p className={styles.name}>{name}</p>
                {soldOut !== undefined  &&
                    <p className={styles.oldPrice}>
                        {currencySymbol}{soldOut !== undefined ? price.toFixed(2) : soldOut.toFixed(2)}
                    </p>
                }
                <p className={styles.price}>
                    {currencySymbol}{soldOut !== undefined ? soldOut.toFixed(2) : price.toFixed(2)}
                </p>
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
                        MORE OPTIONS
                    </Button>
                </div>
            }
        </div>
    )
}
