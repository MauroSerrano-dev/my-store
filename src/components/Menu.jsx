import styles from '@/styles/components/Menu.module.css'
import Logo from './svgs/Logo';
import { SlClose } from "react-icons/sl";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useState } from 'react';
import { motion } from "framer-motion";
import { MENU_FORWARD_OPTIONS, MENU_OPTIONS } from '@/consts';
import { useTranslation } from 'next-i18next';
import { useAppContext } from './contexts/AppContext';

export default function Menu(props) {
    const {
        switchMenu,
        menuOpen,
    } = props

    const {
        session,
        windowWidth,
    } = useAppContext()

    const [optionMenu, setOptionMenu] = useState()
    const [optionMenuDelay, setOptionMenuDelay] = useState()

    const tMenu = useTranslation('menu').t
    const tCommon = useTranslation('common').t

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
                initial={windowWidth < 420 ? 'hiddenMobile' : 'hidden'}
                animate={
                    menuOpen
                        ? 'visible'
                        : windowWidth < 420
                            ? 'hiddenMobile'
                            : 'hidden'
                }
                variants={{
                    hiddenMobile: {
                        transform: 'translateX(-100vw)',
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.35,
                        },
                    },
                    hidden: {
                        transform: 'translateX(-350px)',
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.35,
                        }
                    },
                    visible: {
                        transform: 'translateX(0px)',
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.35,
                        }
                    }
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
                            transform: 'translateX(0px)',
                            transition: {
                                ease: 'easeInOut',
                                duration: 0.35,
                            }
                        },
                        visible: {
                            transform: 'translateX(-110%)',
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
                                {tMenu('welcome')} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{session.first_name ? session.first_name + ' ' + session.last_name : session.last_name}</span>
                            </div>
                        }
                        {session === null &&
                            <div>
                                {tMenu('Hello')}! <Link href={'/login'} onClick={handleCloseMenu} className='noUnderline'>Log in</Link> {tMenu('or')} <Link href={'/signin'} onClick={handleCloseMenu} className='noUnderline'>Sign up</Link>
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
                                {tMenu(option.id)}
                            </Link>
                            : <div
                                key={i}
                                onClick={() => {
                                    setOptionMenuDelay(option.value)
                                    setOptionMenu(option.value)
                                }}
                                className={styles.menuItem}
                            >
                                {tMenu(option.id)}
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
                                    {tCommon(option.id)}
                                </Link>
                                : <div
                                    key={i}
                                    onClick={() => setOptionMenu(option.value)}
                                    className={styles.menuItem}
                                >
                                    {tCommon(option.id)}
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
        </div>
    )
}