import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { motion } from "framer-motion"
import Logo from './Logo';
import SearchBar from './SearchBar';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import Cookies from 'js-cookie';
import AvatarMenu from './AvatarMenu';

export default function NavBar(props) {
    const { session, signIn, signOut, cart } = props

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.bodyContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0, ease: [.48, 0, .15, 1.01] }}
            >
                <div className={styles.leftSide}>
                    {/* <MenuToggle toggle={() => toggleOpen()} /> */}
                    <Link legacyBehavior href={'/'}>
                        <a>
                            <Logo height='100%' hover />
                        </a>
                    </Link>
                </div>
                <div className={styles.middle}>
                    <SearchBar />
                </div>
                <div className={styles.rightSide}>
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
                    <Link legacyBehavior href={'/cart'}>
                        <a>
                            <div
                                className={styles.iconContainer}
                            >
                                <ShoppingCartOutlinedIcon
                                    style={{
                                        fontSize: 'calc(var(--bar-height) * 0.38)',
                                        color: 'var(--global-white)'
                                    }}
                                />
                                {session !== undefined &&
                                    <div
                                        className={styles.cartCounter}
                                        style={{
                                            fontSize: cart.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '55%' : '72%'
                                        }}
                                    >
                                        {cart.reduce((acc, product) => acc + product.quantity, 0) > 99 ? '99+' : cart.reduce((acc, product) => acc + product.quantity, 0)}
                                    </div>
                                }
                            </div>
                        </a>
                    </Link>
                    <AvatarMenu
                        session={session}
                        signOut={signOut}
                    />
                </div>
            </motion.div>
        </div>
    )
}