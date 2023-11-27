import styles from '@/styles/admin/products/index.module.css'
import Link from 'next/link'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { PRODUCTS_TYPES } from '../../../../consts';
import { useTranslation } from 'next-i18next'

export default function Products(props) {
    const {
        session,
        auth,
        router,
        loading
    } = props

    const tCommon = useTranslation('common').t

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
                        <div className={styles.options}>
                            {PRODUCTS_TYPES.map((type, i) =>
                                <Link
                                    className={`${styles.option} noUnderline`}
                                    key={i}
                                    href={`/admin/products/${type.id}`}
                                >
                                    <type.icon
                                        className={styles.optionIcon}
                                    />
                                    <p>
                                        {tCommon(type.family_id).concat(type.id === 'mug-c' ? '-C' : '')}
                                    </p>
                                </Link>
                            )}
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