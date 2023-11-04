import styles from '@/styles/components/products/ProductCart.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useState } from 'react';
import { convertDolarToCurrency, SIZES_POOL, COLORS_POOL } from '../../../consts';
import Image from 'next/image';

const menuStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px'
}

export default function ProductCart(props) {
    const {
        product,
        setCart,
        index,
        userCurrency,
        supportsHoverAndPointer,
    } = props

    const [hoverQuantity, setHoverQuantity] = useState(false)
    const [focusQuantity, setFocusQuantity] = useState(false)

    const COLOR = COLORS_POOL[product.variant.color_id]
    const SIZE = SIZES_POOL.find(sz => sz.id === product.variant.size_id)

    const price = `${userCurrency.symbol} ${((convertDolarToCurrency(product.variant.price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100) * product.quantity).toFixed(2)}`

    const priceUnit = `${userCurrency.symbol} ${(convertDolarToCurrency(product.variant.price * (product.sold_out ? 1 - product.sold_out.percentage : 1), userCurrency.code) / 100).toFixed(2)} unit`

    function handleDeleteCartProduct() {
        setCart(prev => ({ ...prev, products: prev.products.filter(prod => prod.id !== product.id || prod.variant.id !== product.variant.id) }))
    }

    function changeProductField(field, newValue) {
        setCart(prev => (
            {
                ...prev,
                products: prev.products.map(prod => prod.id === product.id && prod.variant.id === product.variant.id
                    ? {
                        ...prod,
                        [field]: newValue
                    }
                    : prod
                )
            }
        ))
    }

    return (
        <motion.div
            className={styles.container}
            variants={{
                hidden: {
                    opacity: 0,
                    y: 20,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay: 0.5 * index,
                    }
                }
            }}
            initial='hidden'
            animate='visible'
        >
            <button
                onClick={() => handleDeleteCartProduct()}
                className={`${styles.deleteButton} buttonInvisible`}
            >
                <SlClose />
            </button>
            <Link
                className={styles.imageContainer}
                href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                    ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                    : SIZE.id !== product.default_variant.size_id
                        ? `?sz=${SIZE.title.toLowerCase()}`
                        : COLOR.id !== product.default_variant.color_id
                            ? `?cl=${COLOR.id_string}`
                            : ''
                    }`}
            >
                <Image
                    priority
                    quality={100}
                    src={product.image.src}
                    alt={product.title}
                    width={270}
                    height={300}
                    style={{
                        width: 'auto',
                        height: 'calc(var(--container-height) * 0.9)',
                    }}
                />
            </Link>
            <div className={styles.right}>
                <div className={styles.rightLeft}>
                    <div className={styles.productName}>
                        <Link href={`/product/${product.id}${COLOR.id !== product.default_variant.color_id && SIZE.id !== product.default_variant.size_id
                            ? `?sz=${SIZE.title.toLowerCase()}&cl=${COLOR.id_string}`
                            : SIZE.id !== product.default_variant.size_id
                                ? `?sz=${SIZE.title.toLowerCase()}`
                                : COLOR.id !== product.default_variant.color_id
                                    ? `?cl=${COLOR.id_string}`
                                    : ''
                            }`}
                        >
                            {product.title}
                        </Link>
                    </div>
                    <div className={styles.bodyContainer}>
                        <div className={styles.bodyTop}>
                            {product.sold_out &&
                                <div
                                    className={styles.soldOut}
                                >
                                    <p>
                                        {Math.round(100 * product.sold_out.percentage)}% OFF
                                    </p>
                                </div>
                            }
                        </div>
                        <div className={styles.bodyBottom}>
                            <div className='flex column' style={{ fontSize: 13, paddingBottom: '0.7rem' }}>
                                <p className='text-start'>Color: <span style={{ fontWeight: 600 }}>{COLOR.title}</span></p>
                                <p className='text-start'>Size: <span style={{ fontWeight: 600 }}>{SIZE.title}</span></p>
                            </div>
                            <FormControl sx={{ minWidth: 80, height: '25%', minHeight: 40 }}>
                                <InputLabel
                                    sx={{
                                        color: '#ffffff'
                                    }}
                                >
                                    Quantity
                                </InputLabel>
                                <Select
                                    value={product.quantity}
                                    onChange={(event) => changeProductField('quantity', event.target.value)}
                                    label="Quantity"
                                    MenuProps={{ disableScrollLock: true }}
                                    sx={{
                                        height: '100%',
                                        color: '#ffffff',
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: `${focusQuantity
                                                ? 'var(--primary)' :
                                                hoverQuantity || !supportsHoverAndPointer
                                                    ? '#ffffff'
                                                    : '#ffffff90'} !important`,
                                            transition: 'all ease-in-out 200ms'
                                        },
                                        '.MuiSelect-iconOutlined': {
                                            color: 'var(--global-white)'
                                        },
                                        '.MuiChip-root': {
                                            backgroundColor: '#363a3d',
                                            '--text-color': 'var(--global-white)',
                                        },
                                    }}
                                    onFocus={() => setFocusQuantity(true)}
                                    onBlur={() => setFocusQuantity(false)}
                                    onMouseEnter={() => setHoverQuantity(true)}
                                    onMouseLeave={() => setHoverQuantity(false)}
                                    onClick={() => setHoverQuantity(false)}
                                >
                                    <MenuItem value={1}
                                        sx={menuStyle}
                                    >
                                        1
                                    </MenuItem>
                                    <MenuItem
                                        value={2}
                                        sx={menuStyle}
                                    >
                                        2
                                    </MenuItem>
                                    <MenuItem
                                        value={3}
                                        sx={menuStyle}
                                    >
                                        3
                                    </MenuItem>
                                    <MenuItem
                                        value={4}
                                        sx={menuStyle}
                                    >
                                        4
                                    </MenuItem>
                                    <MenuItem
                                        value={5}
                                        sx={menuStyle}
                                    >
                                        5
                                    </MenuItem>
                                    <MenuItem
                                        value={6}
                                        sx={menuStyle}
                                    >
                                        6
                                    </MenuItem>
                                    <MenuItem
                                        value={7}
                                        sx={menuStyle}
                                    >
                                        7
                                    </MenuItem>
                                    <MenuItem
                                        value={8}
                                        sx={menuStyle}
                                    >
                                        8
                                    </MenuItem>
                                    <MenuItem
                                        value={9}
                                        sx={menuStyle}
                                    >
                                        9
                                    </MenuItem>
                                    <MenuItem
                                        value={10}
                                        sx={menuStyle}
                                    >
                                        10
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className={styles.rightRight}>
                    <p className={styles.rightP}>
                        Price:
                    </p>
                    <p className={styles.price}>
                        {price}
                    </p>
                    {product.quantity > 1 &&
                        <p className={styles.rightP}>
                            {priceUnit}
                        </p>
                    }
                </div>
            </div>
        </motion.div>
    )
}