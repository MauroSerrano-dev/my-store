import styles from '@/styles/admin/products/index.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { COMMON_TRANSLATES } from '@/consts';
import { useAppContext } from '@/components/contexts/AppContext';
import ProductsSelector from '@/components/products/ProductsSelector';

export default function Products() {
    const {
        session,
        isAdmin,
    } = useAppContext()

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin
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
                        <div className={styles.options}>
                            <ProductsSelector
                                url='/admin/products'
                            />
                        </div>
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