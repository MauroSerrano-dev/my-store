import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { useEffect } from 'react';
import { useAppContext } from '@/components/contexts/AppContext';

export default function Admin(props) {
    const {
        total_products,
        adminMenuOpen,
    } = props

    const {
        auth,
        session,
        setAdminMenuOpen,
    } = useAppContext()

    useEffect(() => {
        setAdminMenuOpen(true)
    }, [])

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingRight: adminMenuOpen ? '0rem' : '2rem',
                        paddingLeft: adminMenuOpen ? 'calc(var(--admin-menu-width) + 2rem)' : '2rem',
                        transition: 'padding-left ease 300ms',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        <p>Total Products: {total_products}</p>
                    </main>
                </div>
    )
}
export async function getServerSideProps({ locale, req }) {

    const options = {
        method: 'GET',
        headers: {
            authorization: process.env.NEXT_PUBLIC_APP_TOKEN
        },
    }
    const products = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/all-products`, options)
        .then(response => response.json())
        .then(response => response.products)
        .catch(err => console.error(err))

    return {
        props: {
            total_products: products.length,
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}