import styles from '@/styles/admin/products/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';

export default function ProductsNew() {
    const {
        auth,
        session,
    } = useAppContext()

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