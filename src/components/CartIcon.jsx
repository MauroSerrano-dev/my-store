import { useEffect, useState } from 'react'
import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import styles from '@/styles/components/CartIcon.module.css'
import { Button } from '@mui/material'
import ProductModal from './ProductModal'

export default function CartIcon(props) {
    const {
        session,
        cart,
        setCart
    } = props

    const [open, setOpen] = useState(false)

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link legacyBehavior href={`/cart`}>
                <a className={`${styles.iconContainer} flex center noUnderline`}>
                    <ShoppingCartOutlinedIcon
                        style={{
                            fontSize: 'calc(var(--bar-height) * 0.38)',
                            color: 'var(--global-white)'
                        }}
                    />
                    {session !== undefined && cart.length > 0 &&
                        <div
                            className={styles.cartCounter}
                            style={{
                                fontSize: cart.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '55%' : '72%'
                            }}
                        >
                            {cart.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '99+' : cart.reduce((acc, product) => acc + product.quantity, 0)}
                        </div>
                    }
                </a>
            </Link>
            {
                open && cart.length > 0 &&
                <div
                    className={styles.contentContainer}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div className={styles.contentVisible}>
                        <div className={styles.productsScroll}>
                            <div className={styles.products}>
                                {cart.map((product, i) =>
                                    <ProductModal
                                        product={product}
                                        key={i}
                                        index={i}
                                        session={session}
                                        setCart={setCart}
                                        setOpen={setOpen}
                                    />
                                )}
                            </div>
                        </div>
                        <Link legacyBehavior href={`/cart`}>
                            <a className={`${styles.iconContainer} flex center noUnderline`}>
                                <Button
                                    variant='contained'
                                    sx={{
                                        width: '100%',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        marginTop: '0.7rem',
                                    }}
                                >
                                    Go to Cart
                                </Button>
                            </a>
                        </Link>
                    </div>
                </div>
            }
        </div >
    )
}