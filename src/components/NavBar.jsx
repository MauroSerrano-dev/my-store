import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { useRouter } from 'next/router'
import { Button } from '@mui/material';
import AvatarMenu from './AvatarMenu';
import { MenuToggle } from './MenuToggle';
import { useCycle } from 'framer-motion';
import { motion } from "framer-motion"
import Logo from './Logo';
import SearchBar from './SearchBar';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const MENU_LIST = [
    { name: 'Lobby', href: '/lobby' },
].concat(process.env.NODE_ENV === 'development'
    ? [{ name: 'Quiz Builder', href: '/quiz-builder' }]
    : []
)

export default function NavBar(props) {
    const { session, signIn, signOut } = props
    const [navActive, setNavActive] = useState(false)
    const { pathname } = useRouter()
    const [isOpen, toggleOpen] = useCycle(false, true);
    const [cartItemsCounter, setCartItemsCounter] = useState(0);

    return (
        <div id={styles.container}>
            <motion.div
                id={styles.bodyContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0, ease: [.48, 0, .15, 1.01] }}
            >
                <div id={styles.leftSide}>
                    {/* <MenuToggle toggle={() => toggleOpen()} /> */}
                    <Link legacyBehavior href={'/'}>
                        <a>
                            <Logo height='70%' hover />
                        </a>
                    </Link>
                </div>
                <div id={styles.middle}>
                    <SearchBar />
                </div>
                <div id={styles.rightSide}>
                    <PersonOutlineOutlinedIcon
                        className={styles.userIcon}
                        sx={{
                            scale: '1.9'
                        }}
                    />
                    <div className={styles.cartContainer}>
                        <ShoppingCartOutlinedIcon
                            sx={{
                                scale: '1.5',
                            }}
                        />
                        <div
                            className={styles.cartCounter}
                            style={{
                                fontSize: cartItemsCounter > 99 ? '65%' : '80%'
                            }}
                        >
                            {cartItemsCounter > 99 ? '99+' : cartItemsCounter}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}