import styles from '@/styles/admin/products/type_id/prod_id/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect, useState } from 'react';
import { getProductById } from '../../../../../../frontend/product';
import { showToast } from '@/utils/toasts';
import { useTranslation } from "next-i18next"

export default function ProductsId() {
    const {
        session,
        router,
        isAdmin,
    } = useAppContext()

    const tToasts = useTranslation('toasts').t

    const [product, setProduct] = useState()

    useEffect(() => {
        if (router.isReady && isAdmin) {
            callGetProductById(router.query.prod_id)
        }
    }, [router])

    async function callGetProductById(id) {
        try {
            const product = await getProductById(id)
            setProduct(product)
        }
        catch (error) {
            console.error(error)
            showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

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