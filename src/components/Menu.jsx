import styles from '../styles/components/Menu.module.css'
import Logo from './Logo';
import { SlClose } from "react-icons/sl";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useState } from 'react';
import { motion } from "framer-motion";
import { MENU_FORWARD_OPTIONS, MENU_OPTIONS } from '../../consts';

export default function Menu(props) {
    const { switchMenu, menuOpen } = props
    const [optionMenu, setOptionMenu] = useState()
    const [optionMenuDelay, setOptionMenuDelay] = useState()

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
            <div
                className={styles.menuBackground}
                onClick={handleCloseMenu}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(2px)',
                    opacity: menuOpen ? 1 : 0,
                    transition: 'opacity ease-in-out 350ms',
                    pointerEvents: menuOpen ? 'auto' : 'none',
                }}
            >
            </div>
            <div
                className={styles.menu}
                style={{
                    transition: 'all ease-in-out 350ms'
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
                        Hello! <Link legacyBehavior href={'/login'}><a onClick={handleCloseMenu} className='noUnderline'>Log in</a></Link> or <Link legacyBehavior href={'/signin'}><a onClick={handleCloseMenu} className='noUnderline'>Sign up</a></Link>
                    </div>
                    {MENU_OPTIONS.map((option, i) =>
                        option.type === 'link'
                            ? <Link
                                legacyBehavior href={option.href}
                                key={i}
                            >
                                <a
                                    onClick={handleCloseMenu}
                                    className={`${styles.menuItem} noUnderline`}
                                >
                                    {option.title}
                                </a>
                            </Link>
                            : <div
                                key={i}
                                onClick={() => {
                                    setOptionMenuDelay(option.value)
                                    setOptionMenu(option.value)
                                }}
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
                                    legacyBehavior href={option.href}
                                    key={i}
                                >
                                    <a
                                        onClick={handleCloseMenu}
                                        className={`${styles.menuItem} noUnderline`}
                                    >
                                        {option.title}
                                    </a>
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
            </div>
        </div>
    )
}