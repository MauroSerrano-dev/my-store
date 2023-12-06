import styles from '@/styles/admin/products/index.module.css'
import Link from 'next/link'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { COMMON_TRANSLATES, PRODUCTS_TYPES } from '@/consts';
import { useTranslation } from 'next-i18next'
import { useAppContext } from '@/components/contexts/AppContext';
import { motion } from 'framer-motion';

export default function Products() {

    const {
        auth,
        session,
        adminMenuOpen,
    } = useAppContext()

    const tCommon = useTranslation('common').t

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <motion.div
                    className={styles.container}
                    style={{
                        transition: 'padding-left ease 300ms'
                    }}
                    initial='close'
                    animate={adminMenuOpen ? 'open' : 'close'}
                    variants={{
                        open: {
                            paddingLeft: 'calc(var(--admin-menu-width-open) + 2rem)',
                        },
                        close: {
                            paddingLeft: 'calc(var(--admin-menu-width-close) + 2rem)',
                        }
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
                </motion.div>
    )
}
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}