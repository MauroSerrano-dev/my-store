import { useEffect, useState } from 'react'
import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import styles from '@/styles/components/buttons-icon/CartIcon.module.css'
import { Button } from '@mui/material'
import ProductModal from '../products/ProductModal'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'

export default function CartIcon() {
    const {
        session,
        supportsHoverAndPointer,
        cart,
        router
    } = useAppContext()

    const [open, setOpen] = useState(false)
    const tNavbar = useTranslation('navbar').t

    useEffect(() => {
        // Em caso de deletar ultimo elemento do cart
        if (cart && cart.products.length === 0)
            setOpen(false)
    }, [cart])

    useEffect(() => {
        setOpen(false)
    }, [router])

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link
                href={`/cart`}
                className={`${styles.iconContainer} flex center noUnderline`}
            >
                <ShoppingCartOutlinedIcon
                    style={{
                        fontSize: 'calc(var(--navbar-height) * 0.36)',
                        color: 'var(--global-white)'
                    }}
                />
                {session !== undefined && cart && cart.products.length > 0 &&
                    <div
                        className={styles.cartCounter}
                        style={{
                            fontSize: cart.products.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '55%' : '72%'
                        }}
                    >
                        {cart.products.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '99+' : cart.products.reduce((acc, product) => acc + product.quantity, 0)}
                    </div>
                }
            </Link>
            {open && cart && cart.products.length > 0 && supportsHoverAndPointer &&
                <motion.div
                    className={styles.contentContainer}
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                        }
                    }}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div className={styles.contentVisible}>
                        <div className={styles.productsScroll}>
                            <div className={styles.products}>
                                {cart.products.map((product, i) =>
                                    <ProductModal
                                        product={product}
                                        key={i}
                                        index={i}
                                        setOpen={setOpen}
                                    />
                                )}
                            </div>
                        </div>
                        <Link
                            href={`/cart`}
                            className={`${styles.iconContainer} flex center noUnderline`}
                        >
                            <Button
                                variant='contained'
                                sx={{
                                    width: '100%',
                                    color: '#ffffff',
                                    fontWeight: '700',
                                }}
                            >
                                {tNavbar('cart_button')}
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            }
        </div>
    )
}