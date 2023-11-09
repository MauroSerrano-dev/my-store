import styles from '../styles/components/Menu.module.css'
import Logo from './svgs/Logo';
import { SlClose } from "react-icons/sl";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useState } from 'react';
import { motion } from "framer-motion";
import { MENU_FORWARD_OPTIONS, MENU_OPTIONS } from '../../consts';
import { useTranslation } from 'react-i18next';

export default function Menu(props) {
    const {
        switchMenu,
        menuOpen,
        session,
        windowWidth,
    } = props
    const [optionMenu, setOptionMenu] = useState()
    const [optionMenuDelay, setOptionMenuDelay] = useState()

    const tMenu = useTranslation('menu').t

    function handleCloseMenu() {
        switchMenu()
        setTimeout(() => {
            setOptionMenu()
            setOptionMenuDelay()
        }, 350)
    }

    function handleGoBack() {
        setOptionMenu()
        setTimeout(() => {
            setOptionMenuDelay()
        }, 350)
    }

    return (
        <div
            className={styles.menuContainer}
        >
            <motion.div
                className={styles.menuBackground}
                onClick={handleCloseMenu}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(2px)',
                    transition: 'opacity ease-in-out 350ms',
                    pointerEvents: menuOpen ? 'auto' : 'none',
                }}
                initial='hidden'
                animate={menuOpen ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        opacity: 0,
                    },
                    visible: {
                        opacity: 1,
                    }
                }}
            >
            </motion.div>
            <motion.div
                className={styles.menu}
                initial='closed'
                animate={
                    menuOpen
                        ? windowWidth < 420
                            ? 'openMobile'
                            : 'open'
                        : 'closed'
                }
                variants={{
                    closed: {
                        left: windowWidth < 420
                            ? '-100%'
                            : '-350px'
                    },
                    open: {
                        left: '0px',
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.35,
                        },
                    },
                    openMobile: {
                        left: '0px',
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.35,
                        },
                    },
                }}
            >
                <div className={styles.menuHead}>
                    <Logo
                        height='100%'
                        fill='black'
                    />
                    <button
                        className='flex center buttonInvisible'
                    >
                        <SlClose
                            onClick={handleCloseMenu}
                            color='#ffffff'
                            className='noSelection'
                            style={{
                                fontSize: '21px',
                                cursor: 'pointer',
                                color: 'var(--global-black)',
                            }}
                        />
                    </button>
                </div>
                <motion.div
                    className={styles.menuBody}
                    initial='hidden'
                    animate={optionMenu ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {
                            left: '0px',
                            transition: {
                                ease: 'easeInOut',
                                duration: 0.35,
                            }
                        },
                        visible: {
                            left: '-110%',
                            transition: {
                                ease: 'easeInOut',
                                duration: 0.35,
                            }
                        }
                    }}
                >
                    <div className={styles.subTitle}>
                        <PersonOutlineOutlinedIcon
                            style={{
                                fontSize: '25px',
                            }}
                        />
                        {session &&
                            <div>
                                {tMenu('Welcome')}! <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{session.first_name ? session.first_name + ' ' + session.last_name : session.last_name}</span>
                            </div>
                        }
                        {session === null &&
                            <div>
                                Hello! <Link href={'/login'} onClick={handleCloseMenu} className='noUnderline'>Log in</Link> or <Link href={'/signin'} onClick={handleCloseMenu} className='noUnderline'>Sign up</Link>
                            </div>
                        }
                    </div>
                    {MENU_OPTIONS.map((option, i) =>
                        option.type === 'link'
                            ? <Link
                                href={option.href}
                                key={i}
                                onClick={handleCloseMenu}
                                className={`${styles.menuItem} noUnderline`}
                            >
                                {tMenu(option.title)}
                            </Link>
                            : <div
                                key={i}
                                onClick={() => {
                                    setOptionMenuDelay(option.value)
                                    setOptionMenu(option.value)
                                }}
                                className={styles.menuItem}
                            >
                                {tMenu(option.title)}
                                {option.type === 'forward' &&
                                    <IoIosArrowForward
                                        className={styles.forwardButton}
                                    />
                                }
                            </div>
                    )}
                </motion.div>
                {optionMenuDelay &&
                    <motion.div
                        className={styles.bodyForward}
                        initial='hidden'
                        animate={optionMenu ? 'visible' : 'hidden'
                        }
                        variants={{
                            hidden: {
                                left: '100%',
                                transition: {
                                    ease: 'easeInOut',
                                    duration: 0.35,
                                },
                            },
                            visible: {
                                left: '0px',
                                transition: {
                                    ease: 'easeInOut',
                                    duration: 0.35,
                                },
                            },
                        }}
                    >
                        <button
                            onClick={handleGoBack}
                            className={`flex center buttonInvisible ${styles.backButton}`}
                        >
                            <IoIosArrowBack />
                        </button>
                        {MENU_FORWARD_OPTIONS[optionMenuDelay].map((option, i) =>
                            option.type === 'link'
                                ? <Link
                                    href={option.href}
                                    key={i}
                                    onClick={handleCloseMenu}
                                    className={`${styles.menuItem} noUnderline`}
                                >
                                    {option.title}
                                </Link>
                                : <div
                                    key={i}
                                    onClick={() => setOptionMenu(option.value)}
                                    className={styles.menuItem}
                                >
                                    {option.title}
                                    {option.type === 'forward' &&
                                        <IoIosArrowForward
                                            className={styles.forwardButton}
                                        />
                                    }
                                </div>
                        )}
                    </motion.div>
                }
            </motion.div>
        </div >
    )
}