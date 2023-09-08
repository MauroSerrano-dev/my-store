import styles from '@/styles/components/Carousel.module.css'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { useEffect, useState } from 'react';
import Product from './Product';

export default function Carousel(props) {
    const {
        items,
        height,
        width,
        loop,
        animationDuration = 200,
        itemWidth = 200,
        gap = 20,
        type = 'imgs'
    } = props

    const [itemsArray, setItemsArray] = useState(items.concat(items).concat(items).map((item, i) => (
        {
            ...item,
            position: i - items.length
        }
    )))

    useEffect(() => {
        if (loop) {
            setTimeout(() => {
                handleGoRight()
            }, animationDuration)
        }
    }, [itemsArray])

    function handleGoLeft() {
        setItemsArray(prev => prev.map((item, i) => (
            {
                ...item,
                position: item.position + 1 > items.length * 2 - 1 ? items.length * (-1) : item.position + 1
            }
        )
        ))
    }

    function handleGoRight() {
        setItemsArray(prev => prev.map((item, i) => (
            {
                ...item,
                position: item.position - 1 < items.length * (-1) ? items.length * 2 - 1 : item.position - 1
            }
        )
        ))
    }

    return (
        <div
            className={styles.container}
            style={{
                height: height,
                width: width
            }}
        >
            <div
                className={styles.itemsContainer}
            >

                {itemsArray.map((item, i) =>
                    type === 'imgs'
                        ? <div
                            className={styles.item}
                            key={i}
                            style={{
                                left: `${(item.position) * (itemWidth + gap)}px`,
                                width: `${itemWidth}px`,
                                transition: item.position < items.length / 2 * (-1) || item.position > items.length * 1.5
                                    ? `all ${loop
                                        ? 'linear'
                                        : 'ease-in-out'} 0ms`
                                    : `all ${loop
                                        ? 'linear'
                                        : 'ease-in-out'} ${animationDuration}ms`
                            }}
                        >
                            <img
                                className={styles.itemImg}
                                src={item.img}
                                alt='category-image'
                            />
                        </div>
                        : <div
                            className={styles.product}
                            key={i}
                            style={{
                                left: `${(item.position) * (itemWidth + gap)}px`,
                                width: `${itemWidth}px`,
                                transition: item.position < items.length / 2 * (-1) || item.position > items.length * 1.5
                                    ? `all ${loop
                                        ? 'linear'
                                        : 'ease-in-out'} 0ms`
                                    : `all ${loop
                                        ? 'linear'
                                        : 'ease-in-out'} ${animationDuration}ms`
                            }}
                        >
                            <Product
                                responsive
                                name={item.title}
                                price={item.variants[0].price}
                                currencySymbol='$'
                                outOfStock={false}
                                img={item.image_showcase.src}
                                imgHover={item.image_hover.src}
                                url={`/product?id=${item.id}`}
                            />
                        </div>
                )}
            </div>
            {!loop &&
                <IconButton
                    onClick={handleGoLeft}
                    color='primary'
                    size='small'
                    aria-label="Left"
                    sx={{
                        position: 'relative',
                        left: -22,
                        backgroundColor: '#3b3a38',
                        transition: 'all 200ms ease-in-out',
                        scale: '0.8',
                        top: type === 'products' ? -30 : undefined
                    }}
                >
                    <KeyboardArrowLeftRoundedIcon
                        style={{
                            width: `${30}px`,
                            height: `${30}px`,
                            scale: '130%',
                        }}
                    />
                </IconButton>
            }
            {!loop &&
                <IconButton
                    onClick={handleGoRight}
                    color='primary'
                    size='small'
                    aria-label="Right"
                    sx={{
                        position: 'relative',
                        right: -22,
                        backgroundColor: '#3b3a38',
                        transition: 'all 200ms ease-in-out',
                        scale: '0.8',
                        top: type === 'products' ? -30 : undefined
                    }}
                >
                    <KeyboardArrowRightRoundedIcon
                        style={{
                            width: `${30}px`,
                            height: `${30}px`,
                            scale: '130%',
                        }}
                    />
                </IconButton>
            }
        </div>
    )
}
