import styles from '@/styles/components/ProductCart.module.css'
import { SlClose } from "react-icons/sl";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Link from 'next/link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';

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
        index
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

    function handleDeleteCartProduct(productId) {
        setCart(prev => {
            const newCart = prev.filter(prod => prod.id !== productId)
            if (session) {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.user.id,
                        cart: newCart,
                    })
                }
                fetch("/api/cart", options)
                    .catch(err => console.error(err))
            }
            else {
                Cookies.set('cart', JSON.stringify(newCart))
            }
            return newCart
        })
    }

    function changeProductField(field, newValue, productId) {
        setCart(prev => {
            const newCart = prev.map(prod => prod.id === productId
                ? {
                    ...prod,
                    [field]: newValue
                }
                : prod
            )
            if (session) {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.user.id,
                        cart: newCart,
                    })
                }
                fetch("/api/cart", options)
                    .catch(err => console.error(err))
            }
            else {
                Cookies.set('cart', JSON.stringify(newCart))
            }
            return newCart
        })
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
                onClick={() => handleDeleteCartProduct(product.id)}
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
                            onChange={(event) => changeProductField('quantity', event.target.value, product.id)}
                            label="Quantity"
                            sx={{
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
                            defaultValue={'M'}
                            onChange={() => console.log()}
                            autoWidth
                            label="Size"
                            sx={{
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
                            <MenuItem value={'S'}
                                sx={menuStyle}
                            >
                                S
                            </MenuItem>
                            <MenuItem
                                value={'M'}
                                sx={menuStyle}
                            >
                                M
                            </MenuItem>
                            <MenuItem
                                value={'L'}
                                sx={menuStyle}
                            >
                                L
                            </MenuItem>
                            <MenuItem
                                value={'XL'}
                                sx={menuStyle}
                            >
                                XL
                            </MenuItem>
                            <MenuItem
                                value={'XXL'}
                                sx={menuStyle}
                            >
                                XXL
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.priceContainer}>
                <p>
                    Price:
                </p>
                <h2>
                    {`$${((product.price / 100) * product.quantity).toFixed(2)}`}
                </h2>
            </div>
        </motion.div>
    )
}