import { useEffect, useState } from 'react'
import styles from '@/styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { LIMITS } from '@/consts'
import { showToast } from '@/utils/toasts'
import { useTranslation } from 'next-i18next'
import { useAppContext } from './contexts/AppContext'

export default function SearchBar(props) {
    const {
        show,
        placeholder = 'placeholder',
        onChange,
        onClick,
        onKeyDown,
        style,
        barStyle,
        barHeight = 38,
    } = props

    const {
        setSearch,
        search,
    } = useAppContext()

    const [opacity, setOpacity] = useState(1)
    const [boolean, setBoolean] = useState(show)
    const [toastActive, setToastActive] = useState(false)

    const tToasts = useTranslation('toasts').t

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
            setSearch('')
            time = setTimeout(() => {
                setBoolean(show)
            }, 200)
        }
        return () => {
            clearTimeout(time)
        }
    }, [show])

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
                    value={search}
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
        </div>
    )
}