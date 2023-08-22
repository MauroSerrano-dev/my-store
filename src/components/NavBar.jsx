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
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
                            {windowWidth > 450
                                ? <Logo height='70%' hover />
                                : <img src='logos/logo-black.png' alt='logo' style={{ height: '70%' }} />
                            }
                        </a>
                    </Link>
                </div>
                <div id={styles.middle}>
                    <SearchBar />
                </div>
                <div id={styles.rightSide}>
                    <PersonOutlineOutlinedIcon
                        sx={{
                            scale: '1.9'
                        }}
                    />
                    <ShoppingCartOutlinedIcon
                        sx={{
                            scale: '1.6'
                        }}
                    />
                </div>
            </motion.div>
        </div>
    )
}