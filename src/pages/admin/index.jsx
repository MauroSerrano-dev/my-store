import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { motion } from 'framer-motion';
import { COMMON_TRANSLATES } from '@/consts';

export default function Admin(props) {
    const {
        total_products,
    } = props

    const {
        auth,
        session,
        adminMenuOpen,
    } = useAppContext()

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
                        <p>Total Products: {total_products}</p>
                    </main>
                </motion.div>
    )
}
export async function getServerSideProps({ locale }) {

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
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}