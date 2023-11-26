import styles from '@/styles/admin/products/new/index.module.css'
import { Button } from '@mui/material'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { PRODUCT_TYPES } from '../../../../../consts'
import NoFound404 from '@/components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '../../../../../utils/validations';
import { useEffect } from 'react'

export default withRouter(props => {

    const {
        session,
        auth,
        setAdminMenuOpen,
        router,
        loading
    } = props

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
                        <div className={styles.menuContainer}>
                            <h3>Create New Product</h3>
                            {PRODUCT_TYPES.map((type, i) =>
                                <Link
                                    href={`/admin/products/new/${type.id}`}
                                    key={i}
                                    className='noUnderline fillWidth'
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {type.id}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </main>
                </div>
    )
})

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}