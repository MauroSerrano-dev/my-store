import { useEffect, useState } from 'react'
import styles from '../styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { motion } from "framer-motion";
import Link from 'next/link'

export default function SearchBar(props) {
    const {
        show,
        placeholder,
        onChange,
        onClick,
        onKeyDown,
        value,
        options = [],
        setOptions
    } = props

    const [opacity, setOpacity] = useState(1)
    const [boolean, setBoolean] = useState(show)
    const [focus, setFocus] = useState(false)
    const [showOptions, setShowOptions] = useState(false)

    useEffect(() => {
        let time
        if (show) {
            setBoolean(show)
            time = setTimeout(() => {
                setOpacity(1)
            }, 10)
        }
        else {
            setOpacity(0)
            time = setTimeout(() => {
                setBoolean(show)
            }, 200)
        }
        return () => {
            clearTimeout(time)
        }
    }, [show])

    useEffect(() => {
        if (!showOptions && (options.length > 0 && focus)) {
            setShowOptions(true)
        }
        else if (showOptions && !(options.length > 0 && focus)) {
            setTimeout(() =>
                setShowOptions(false)
                , 250)
        }
    }, [options, focus])

    return (
        boolean &&
        <div
            className={styles.container}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
        >
            <div
                className={styles.bar}
                style={{
                    opacity: opacity
                }}
            >
                <input
                    className={styles.input}
                    placeholder={placeholder}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={value}
                    spellCheck={false}
                />
                <button
                    className={styles.icon}
                    aria-label="Search"
                    onClick={onClick}
                >
                    <SearchRoundedIcon
                        color='primary'
                        sx={{
                            scale: '1.3'
                        }}
                    />
                </button>
                <div
                    className={styles.options}
                    style={{
                        paddingTop: showOptions
                            ? '1.7rem'
                            : '0px',
                        paddingBottom: showOptions
                            ? '0.7rem'
                            : '0px',
                        height: showOptions
                            ? `${38.4 + options.length * 50}px`
                            : '0px',
                    }}
                >
                    {showOptions &&
                        options.map((option, i) =>
                            <Link
                                legacyBehavior href={`/product?id=${option.id}`}
                                key={i}
                            >
                                <motion.a
                                    onClick={() => setTimeout(() => setOptions([]), 300)}
                                    className={`${styles.option} noUnderline`}
                                    key={i}
                                    style={{
                                        height: `${100 / options.length}%`
                                    }}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                        },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                duration: 0.3,
                                                delay: 0.3 + 0.3 * i,
                                            }
                                        }
                                    }}
                                    initial='hidden'
                                    animate='visible'
                                >
                                    <img
                                        src={option.images[0].src}
                                    />
                                    <p>{option.title}</p>
                                </motion.a>
                            </Link>
                        )}
                </div>
            </div>
        </div>
    )
}