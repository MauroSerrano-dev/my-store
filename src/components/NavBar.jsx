import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { motion } from "framer-motion"
import Logo from './Logo';
import SearchBar from './SearchBar';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AvatarMenu from './AvatarMenu';
import CartIcon from './CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function NavBar(props) {
    const {
        session,
        logout,
        cart,
        setCart,
        isScrollAtTop,
        setIsScrollAtTop
    } = props

    const [showSearchBar, setShowSearchBar] = useState(true)

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.bodyContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0, ease: [.48, 0, .15, 1.01] }}
            >
                <div className={styles.leftSide}>
                    <Link legacyBehavior href={'/'}>
                        <a>
                            <Logo height='100%' hover />
                        </a>
                    </Link>
                </div>
                <div
                    className={styles.middle}
                >
                    <SearchBar
                        show={isScrollAtTop}
                    />
                    <div
                        className={styles.categoriesContainer}
                        style={{
                            bottom: isScrollAtTop
                                ? '-39px'
                                : '22px',
                        }}
                    >
                        <p>T-SHIRTS</p>
                        <p>HOODIES</p>
                        <p>MUGS</p>
                        <p>BAGS</p>
                        <p>ACCESSORIES</p>
                        <p>KITCHEN</p>
                        <p>PILLOWS</p>
                        <p>SHOES</p>
                        <p>SOCKS</p>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div
                        className={styles.iconContainer}
                        onClick={() => setIsScrollAtTop(true)}
                        style={{
                            pointerEvents: isScrollAtTop
                                ? 'none'
                                : 'auto',
                            opacity: isScrollAtTop
                                ? 0
                                : 1
                        }}
                    >
                        <SearchRoundedIcon
                            style={{
                                fontSize: 'calc(var(--bar-height) * 0.38)',
                                color: 'var(--global-white)',
                                position: 'relative',
                                top: '1px',
                            }}
                        />
                    </div>
                    <Link legacyBehavior href={'/wishlist'}>
                        <a>
                            <div
                                className={styles.iconContainer}
                            >
                                <FavoriteBorderRoundedIcon
                                    style={{
                                        fontSize: 'calc(var(--bar-height) * 0.38)',
                                        color: 'var(--global-white)',
                                        position: 'relative',
                                        top: '1px',
                                    }}
                                />
                            </div>
                        </a>
                    </Link>
                    <CartIcon
                        session={session}
                        cart={cart}
                        setCart={setCart}
                    />
                    <AvatarMenu
                        session={session}
                        logout={logout}
                    />
                </div>
            </motion.div>
        </div>
    )
}