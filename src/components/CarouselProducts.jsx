import styles from '@/styles/components/CarouselProducts.module.css'
import { IconButton } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { useEffect, useState } from 'react';
import Product from './Product';
import { convertDolarToCurrency } from '../../consts';

export default function CarouselProducts(props) {
    const {
        items,
        height,
        width,
        loop,
        animationDuration = 200,
        itemWidth = 200,
        gap = 20,
        userCurrency,
    } = props

    const [itemsArray, setItemsArray] = useState(
        items.concat(items).concat(items).map((item, i) => (
            {
                ...item,
                position: i - items.length
            }
        ))
    )

    useEffect(() => {
        if (loop) {
            setTimeout(() => {
                handleGoRight()
            }, animationDuration)
        }
    }, [itemsArray])

    useEffect(() => {
        setItemsArray(
            items.concat(items).concat(items).map((item, i) => (
                {
                    ...item,
                    position: i - items.length
                }
            )))
    }, [items])

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
                    <div
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
                            price={convertDolarToCurrency(item.variants[0].price, userCurrency.code)}
                            currencySymbol={userCurrency.symbol}
                            outOfStock={false}
                            img={item.images[item.image_showcase_index].src}
                            imgHover={item.images[item.image_hover_index].src}
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
                        top: -30
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
                        top: '-30'
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
