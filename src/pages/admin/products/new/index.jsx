import styles from '@/styles/admin/products/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';

export default function ProductsNew(props) {
    const {
        session,
        auth,
        router,
        loading
    } = props

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