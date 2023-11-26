import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '../../../utils/validations';
import { useEffect } from 'react';

export default function Admin(props) {
    const {
        session,
        auth,
        setAdminMenuOpen
    } = props

    useEffect(() => {
        setAdminMenuOpen(true)
    }, [])

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
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