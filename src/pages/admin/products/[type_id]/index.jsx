import styles from '@/styles/admin/products/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect } from 'react';

export default function ProductsId() {
    const {
        auth,
        session,
        router,
    } = useAppContext()

    useEffect(() => {
        if (router.isReady)
            getProductsByQuery()
    }, [router])

    function getProductsByQuery() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                y: router.query.type_id,
                p: router.query.p,
            }
        }

        fetch("/api/products-by-queries", options)
            .then(response => response.json())
            .then(response => console.log('response', response))
            .catch(err => console.error(err))
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.products}>
                            { }
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