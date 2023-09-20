import styles from '@/styles/components/ProductCart.module.css'
import { SlClose } from "react-icons/sl";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { TYPES_POOL, convertDolarToCurrency } from '../../consts';

const menuStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px'
}

export default function ProductCart(props) {
    const {
        session,
        product,
        setCart,
        index,
        userCurrency
    } = props

    const [hoverQuantity, setHoverQuantity] = useState(false)
    const [focusQuantity, setFocusQuantity] = useState(false)
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState(false)

    const [hoverSize, setHoverSize] = useState(false)
    const [focusSize, setFocusSize] = useState(false)

    useEffect(() => {
        setSupportsHoverAndPointer(
            window.matchMedia('(hover: hover)').matches &&
            window.matchMedia('(pointer: fine)').matches
        )
    }, [])

    function handleDeleteCartProduct() {
        setCart(prev => prev.filter(prod => prod.id !== product.id || prod.variant_id !== product.variant_id))
    }

    function changeProductField(field, newValue) {
        setCart(prev =>
            prev.map(prod => prod.id === product.id && prod.variant_id === product.variant_id
                ? {
                    ...prod,
                    [field]: newValue
                }
                : prod
            )
        )
    }

    function changeSize(newSize) {

        setCart(prev =>
            prev.map(prod =>
                prod.id === product.id && prod.variant_id === product.variant_id
                    ? {
                        ...prod,
                        size: newSize,
                        variant_id: prod.variants.find(vari => vari.options.includes(prod.color.id) && vari.options.includes(newSize.id)).id,
                        price: prod.variants.find(vari => vari.options.includes(prod.color.id) && vari.options.includes(newSize.id)).price,
                    }
                    : prod
            )
        )
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
            <SlClose
                onClick={() => handleDeleteCartProduct()}
                color='#ffffff'
                style={{
                    fontSize: '22px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                }}
            />
            <Link legacyBehavior href={`/product?id=${product.id}`}>
                <a className={styles.imageContainer}>
                    <img
                        className={styles.image}
                        src={product.image}
                    />
                </a>
            </Link>
            <div className={styles.middle}>
                <Link legacyBehavior href={`/product?id=${product.id}`}>
                    <a>
                        <h4>{product.title}</h4>
                    </a>
                </Link>
                <div
                    className={styles.inputsContainer}
                >
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
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
                                height: '50px',
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
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
                        <InputLabel
                            sx={{
                                color: '#ffffff'
                            }}
                        >
                            Size
                        </InputLabel>
                        <Select
                            value={product.size.id}
                            onChange={(event) => changeSize(TYPES_POOL.find(t => t.id === product.type).sizes.find(size => size.id === event.target.value))}
                            autoWidth
                            label="Size"
                            MenuProps={{ disableScrollLock: true }}
                            sx={{
                                height: '50px',
                                color: '#ffffff',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: `${focusSize
                                        ? 'var(--primary)' :
                                        hoverSize || !supportsHoverAndPointer
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
                            onFocus={() => setFocusSize(true)}
                            onBlur={() => setFocusSize(false)}
                            onMouseEnter={() => setHoverSize(true)}
                            onMouseLeave={() => setHoverSize(false)}
                            onClick={() => setHoverSize(false)}
                        >
                            {TYPES_POOL.find(t => t.id === product.type).sizes.map((size, i) =>
                                <MenuItem value={size.id}
                                    key={i}
                                    sx={menuStyle}
                                >
                                    {size.title}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.priceContainer}>
                <p>
                    Price:
                </p>
                <h2>
                    {`${userCurrency.symbol} ${(convertDolarToCurrency(product.price, userCurrency.code) * product.quantity / 100).toFixed(2)}`}
                </h2>
                {product.quantity > 1 &&
                    <p style={{ fontSize: '13px', color: '#c2c2c2' }}>
                        {`${userCurrency.symbol} ${(convertDolarToCurrency(product.price, userCurrency.code) / 100).toFixed(2)} unit`}
                    </p>
                }
            </div>
        </motion.div>
    )
}