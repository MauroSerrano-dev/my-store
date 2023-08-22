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
                                : <img src='logos/QT-logo.png' alt='Quiz-Time-Logo' style={{ height: '70%' }} />
                            }
                        </a>
                    </Link>
                </div>
                <div id={styles.middle}>
                    <div className={`${navActive ? styles.active : undefined} ${styles.nav_menu_list}`}>
                        {MENU_LIST.map((option, i) =>
                            <div onClick={() => { setNavActive(false) }}
                                key={option.name}>
                                <Link legacyBehavior href={option.href}>
                                    <a>
                                        <h1
                                            className={styles.navOption}
                                            id={option.href === pathname ? styles.currentPage : undefined}
                                        >
                                            {option.name}
                                        </h1>
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div id={styles.rightSide}>
                    {session &&
                        <div id={styles.rightSideLogin}>
                            <AvatarMenu session={session} signOut={signOut} />
                        </div>
                    }
                    {!session &&
                        <div>
                            <Button variant="outlined" id={styles.loginButton} onClick={() => signIn()}>Login</Button>
                        </div>
                    }
                    <div onClick={() => setNavActive(!navActive)} id={styles.nav_menu_bar}>
                        <div className={`${navActive ? styles.active2 : styles.disactive} ${styles.navButton}`}></div>
                        <div className={`${navActive ? styles.active : styles.disactive2} ${styles.navButton}`}></div>
                        <div className={`${navActive ? styles.active2 : styles.disactive3} ${styles.navButton}`}></div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}