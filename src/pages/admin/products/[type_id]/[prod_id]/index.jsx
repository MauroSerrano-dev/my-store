import styles from '@/styles/admin/products/type_id/prod_id/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect, useState } from 'react';

export default function ProductsId() {
    const {
        auth,
        session,
        router,
    } = useAppContext()

    const [product, setProduct] = useState()

    useEffect(() => {
        if (router.isReady) {
            getProductById(router.query.prod_id)
        }
    }, [router])

    async function getProductById(id) {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            }
        }

        if (id)
            options.headers.id = id

        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                setProduct(response.product)
            })
            .catch(err => console.error(err))
    }

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
                        {product?.id}
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