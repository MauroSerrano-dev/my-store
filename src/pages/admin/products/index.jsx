import styles from '@/styles/admin/products/index.module.css'
import Link from 'next/link'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { PRODUCTS_TYPES } from '@/consts';
import { useTranslation } from 'next-i18next'
import { useAppContext } from '@/components/contexts/AppContext';

export default function Products(props) {
    const {
        adminMenuOpen
    } = props

    const {
        auth,
        session,
    } = useAppContext()

    const tCommon = useTranslation('common').t

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingRight: adminMenuOpen ? '0rem' : '3rem',
                        paddingLeft: adminMenuOpen ? '18rem' : '3rem',
                        transition: 'padding-left ease 300ms',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        <h2>Products Types</h2>
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