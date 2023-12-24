import styles from '@/styles/admin/promotions.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { COMMON_TRANSLATES } from '@/consts';
import { useAppContext } from '@/components/contexts/AppContext';
import ProductsSelector from '@/components/products/ProductsSelector';

export default function Promotions() {
    const {
        auth,
        session,
    } = useAppContext()

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingLeft: 'calc(var(--admin-menu-width-close) + 2rem)',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        <h2>Products Types</h2>
                        <ProductsSelector
                            url='/admin/products'
                        />
                    </main>
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}