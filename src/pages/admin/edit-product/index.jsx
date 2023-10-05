import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/edit-product/index.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import NoFound404 from '@/pages/404'

export default function EditProduct(props) {
    const {
        session
    } = props

    const [productIdInput, setProductIdInput] = useState('')

    return (
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.top}>
                            <Link
                                href='/admin'
                                className='noUnderline'
                            >
                                <Button
                                    variant='outlined'
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <KeyboardArrowLeftRoundedIcon
                                        style={{
                                            marginLeft: '-0.5rem'
                                        }}
                                    />
                                    <p
                                        style={{
                                            color: 'var(--primary)'
                                        }}
                                    >
                                        Back
                                    </p>
                                </Button>
                            </Link>
                        </div>
                        <TextInput
                            label='Product ID'
                            value={productIdInput}
                            onChange={e => setProductIdInput(e.target.value)}
                        />
                        <Link
                            href={`/admin/edit-product/${productIdInput}`}
                            className='noUnderline'
                        >
                            <Button>
                                Search
                            </Button>
                        </Link>
                    </main>
                </div>
    )
}