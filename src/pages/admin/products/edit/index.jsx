import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/products/edit/index.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NoFound404 from '@/components/NoFound404'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { isAdmin } from '../../../../../utils/validations'

export default function EditProduct(props) {
    const {
        session,
        auth,
        setAdminMenuOpen,
        router,
        loading
    } = props

    const [productIdInput, setProductIdInput] = useState('')

    useEffect(() => {
        setAdminMenuOpen(false)
    }, [])

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404
                    autoRedirect
                    router={router}
                    loading={loading}
                />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
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
                                href={`/admin/products/edit/${productIdInput}`}
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