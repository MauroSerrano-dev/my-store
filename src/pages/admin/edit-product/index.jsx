import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/edit-product/index.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import NoFound404 from '@/components/NoFound404'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function EditProduct(props) {
    const {
        session,
        auth
    } = props

    const [productIdInput, setProductIdInput] = useState('')

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
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
                        <div
                            className={styles.body}
                        >
                            <TextInput
                                label='Product ID'
                                value={productIdInput}
                                onChange={e => setProductIdInput(e.target.value)}
                                style={{
                                    width: '30%'
                                }}
                            />
                            <Link
                                href={`/admin/edit-product/${productIdInput}`}
                                className='noUnderline'
                            >
                                <Button
                                    variant='outlined'
                                >
                                    Search
                                </Button>
                            </Link>
                        </div>
                    </main>
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}