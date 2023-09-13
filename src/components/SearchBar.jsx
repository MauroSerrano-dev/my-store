import { useEffect, useState } from 'react'
import styles from '../styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { motion } from "framer-motion";

export default function SearchBar(props) {
    const {
        show,
        placeholder,
        onChange,
        onClick,
        onKeyDown,
        value,
        options = []
    } = props

    const [opacity, setOpacity] = useState(1)
    const [boolean, setBoolean] = useState(show)
    const [showOptions, setShowOptions] = useState(false)
    const [focus, setFocus] = useState(false)

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

    return (
        boolean &&
        <div
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className={styles.container}
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
                        paddingTop: options.length > 0 && focus
                            ? '1.7rem'
                            : '0px',
                        paddingBottom: options.length > 0 && focus
                            ? '0.7rem'
                            : '0px',
                        height: options.length > 0 && focus
                            ? `${38.4 + options.length * 50}px`
                            : '0px',
                    }}
                >
                    {options.length > 0 && focus &&
                        options.map((option, i) =>
                            <motion.div
                                className={styles.option}
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
                            </motion.div>
                        )}
                </div>
            </div>
        </div >
    )
}