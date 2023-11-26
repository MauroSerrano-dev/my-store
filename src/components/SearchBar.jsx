import { useEffect, useState } from 'react'
import styles from '@/styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { motion } from "framer-motion"
import Link from 'next/link'
import { LIMITS } from '../../consts'
import { showToast } from '../../utils/toasts'
import { useTranslation } from 'next-i18next'

export default function SearchBar(props) {
    const {
        show,
        placeholder,
        onChange,
        onClick,
        onKeyDown,
        value,
        options = [],
        setOptions,
        style,
        barStyle,
        barHeight = 38,
        setSearch,
    } = props

    const tToasts = useTranslation('toasts').t

    const [opacity, setOpacity] = useState(1)
    const [boolean, setBoolean] = useState(show)
    const [focus, setFocus] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [toastActive, setToastActive] = useState(false)

    useEffect(() => {
        let time
        if (show) {
            setBoolean(show)
            time = setTimeout(() => {
                setOpacity(1)
            }, 10)
        }
        else {
            setOptions([])
            setOpacity(0)
            setSearch('')
            time = setTimeout(() => {
                setBoolean(show)
            }, 200)
        }
        return () => {
            clearTimeout(time)
        }
    }, [show])

    useEffect(() => {
        setShowOptions(options.length > 0 && focus)
    }, [options, focus])

    function handleOnChange(event) {
        if (onChange) {
            if (event.target.value.length <= LIMITS.input_search_bar)
                onChange(event)
            else if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
        }
    }

    return (
        boolean &&
        <div
            className={styles.container}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
                ...style,
                height: barHeight,
                opacity: opacity
            }}
        >
            <div
                className={styles.bar}
                style={{
                    ...barStyle,
                    height: barHeight,
                }}
            >
                <input
                    name='search'
                    className={styles.input}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                    onKeyDown={onKeyDown}
                    value={value}
                    spellCheck={false}
                    autoComplete='off'
                />
                <button
                    className={styles.icon}
                    aria-label="Search"
                    onClick={onClick}
                >
                    <SearchRoundedIcon
                        color='primary'
                        sx={{
                            scale: String(barHeight * 0.038)
                        }}
                    />
                </button>
            </div>
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
                            href={`/product/${option.id}`}
                            key={i}
                            onClick={() => setTimeout(() => setOptions([]), 300)}
                            className={`${styles.option} noUnderline`}
                            style={{
                                height: `${100 / options.length}%`
                            }}
                        >
                            <motion.div
                                className={styles.optionMotion}
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
                            </motion.div>
                        </Link>
                    )}
            </div>
        </div>
    )
}