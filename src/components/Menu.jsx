import styles from '../styles/components/Menu.module.css'
import Logo from './Logo';
import { SlClose } from "react-icons/sl";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import { useState } from 'react';
import { motion } from "framer-motion";

const MENU_OTIONS = [
    { title: 'Home', type: 'link', href: '/' },
    { title: 'Departments', type: 'forward', value: 'departments' },
]

export default function Menu(props) {
    const { switchMenu, menuOpen } = props
    const [optionHover, setOptionHover] = useState()
    const [optionMenu, setOptionMenu] = useState()

    return (
        <div
            className={styles.menuContainer}
        >
            <div
                className={styles.menuBackground}
                onClick={switchMenu}
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
                    <SlClose
                        onClick={switchMenu}
                        color='#ffffff'
                        className='noSelection'
                        style={{
                            fontSize: '21px',
                            cursor: 'pointer',
                            color: 'var(--global-black)',
                        }}
                    />
                </div>
                <motion.div
                    className={styles.menuBody}
                    initial='hidden'
                    animate={optionMenu ? 'visible' : 'hidden'}
                    variants={{
                        hidden: {
                            left: '0px',
                        },
                        visible: {
                            left: '-350px',
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
                        Hello! <Link legacyBehavior href={'/login'}><a onClick={switchMenu} className='noUnderline'>Log in</a></Link> or <Link legacyBehavior href={'/signin'}><a onClick={switchMenu} className='noUnderline'>Sign up</a></Link>
                    </div>
                    {MENU_OTIONS.map((option, i) =>
                        option.type === 'link'
                            ? <Link
                                legacyBehavior href={option.href}
                                key={i}
                            >
                                <a
                                    onClick={switchMenu}
                                    className={`${styles.menuItem} noUnderline`}
                                    onMouseEnter={() => setOptionHover(i)}
                                    onMouseLeave={() => setOptionHover()}
                                    style={{
                                        fontWeight: optionHover === i
                                            ? 'bold'
                                            : '300'
                                    }}
                                >
                                    {option.title}
                                </a>
                            </Link>
                            : <div
                                key={i}
                                onClick={() => setOptionMenu(option.value)}
                                className={styles.menuItem}
                                onMouseEnter={() => setOptionHover(i)}
                                onMouseLeave={() => setOptionHover()}
                                style={{
                                    fontWeight: optionHover === i
                                        ? 'bold'
                                        : '300'
                                }}
                            >
                                {option.title}
                                {option.type === 'forward' &&
                                    <IoIosArrowForward
                                        strokeWidth={optionHover === i ? 20 : 0}
                                        size={19}
                                        color={optionHover === i ? 'var(--global-black)' : '#575757'}
                                    />
                                }
                            </div>
                    )}
                </motion.div>
                <motion.div
                    className={styles.bodyForward}
                    onClick={() => setOptionMenu()}
                    initial='hidden'
                    animate={optionMenu ? 'visible' : 'hidden'
                    }
                    variants={{
                        hidden: {
                            left: '100%',
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
                </motion.div>
            </div>
        </div>
    )
}