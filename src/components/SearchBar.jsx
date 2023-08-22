import { useEffect, useState } from 'react'
import styles from '../styles/components/SearchBar.module.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function SearchBar(props) {

    return (
        <div className={styles.container}>
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