import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { motion } from "framer-motion"
import Logo from './Logo';
import SearchBar from './SearchBar';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function NavBar(props) {
    const [cartItemsCounter, setCartItemsCounter] = useState(0);

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
                            <Logo height='70%' hover />
                        </a>
                    </Link>
                </div>
                <div className={styles.middle}>
                    <SearchBar />
                </div>
                <div className={styles.rightSide}>
                    <PersonOutlineOutlinedIcon
                        className={styles.userIcon}
                    />
                    <div className={styles.cartContainer}>
                        <ShoppingCartOutlinedIcon
                            className={styles.shoppingCartIcon}
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