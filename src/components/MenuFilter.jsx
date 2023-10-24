import styles from '../styles/components/MenuFilter.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SlClose } from "react-icons/sl";

export default function MenuFilter(props) {
    const {
        show = false,
        open = false,
        onClose,
    } = props

    const [searchFocus, setSearchFocus] = useState(false)

    useEffect(() => {
        if (open) {
            document.documentElement.style.overflowY = "hidden"
            document.body.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }

        return () => {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }
    }, [open])

    return (
        show &&
        <motion.div
            className={styles.filtersContainer}
        >
            <motion.div
                className={styles.filtersBackground}
                onClick={onClose}
                initial='hidden'
                animate={open ? 'visible' : 'hidden'}
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
                className={styles.filtersBody}
                initial='hidden'
                animate={open ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        bottom: '-100%'
                    },
                    visible: {
                        bottom: searchFocus ? '0%' : '-35%'
                    }
                }}
            >
                <div
                    className='flex center row'
                    style={{
                        paddingTop: 10
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            paddingLeft: 20,
                            paddingRight: 20,
                        }}
                    >
                        <input
                            onFocus={() => setSearchFocus(true)}
                            onBlur={() => setSearchFocus(false)}
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                    <button
                        className='flex center buttonInvisible'
                        style={{
                            paddingRight: 20
                        }}
                    >
                        <SlClose
                            onClick={onClose}
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
                <Link
                    href='/search?order=lowest-price&cl=grey'
                >
                    test
                </Link>
            </motion.div>
        </motion.div>
    )
}