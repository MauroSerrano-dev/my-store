import { useEffect, useState } from 'react'
import styles from '../styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function SearchBar(props) {
    const { show } = props

    const [opacity, setOpacity] = useState(1)
    const [boolean, setBoolean] = useState(show)

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
            className={styles.container}
            style={{
                opacity: opacity
            }}
        >
            <input
                className={styles.input}
                placeholder='What are you looking for?'
            />
            <button className={styles.icon}>
                <SearchRoundedIcon
                    color='primary'
                    sx={{
                        scale: '1.3'
                    }}
                />
            </button>
        </div>
    )
}