import styles from '@/styles/admin/orders.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getOrdersByQuery } from '../../../frontend/orders';
import OrderAdmin from '@/components/products/OrderAdmin';

export default function Customers() {
    const {
        session,
        isAdmin,
        router,
        auth
    } = useAppContext()

    const {
        page = '1',
        limit = '100',
    } = router.query

    const [ordersList, setOrdersList] = useState()

    useEffect(() => {
        if (isAdmin)
            getOrders()
    }, [isAdmin])

    async function getOrders() {
        try {
            const orders = await getOrdersByQuery({
                limit: Number(limit),
                page: Number(page),
            })
            setOrdersList(orders)
        } catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) });
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
                        {ordersList &&
                            <div className={styles.orders}>
                                {ordersList.map(order =>
                                    <OrderAdmin
                                        key={order.id}
                                        order={order}
                                    />
                                )}
                            </div>
                        }
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