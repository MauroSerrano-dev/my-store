import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { convertTimestampToFormatDateSeconds } from '@/utils';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getProductsAnalytics } from '../../../frontend/product';
import { getAppSettings } from '../../../frontend/app-settings';
import { showToast } from '@/utils/toasts';

export default function Admin() {
    const {
        auth,
        session,
        isAdmin,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t

    const [data, setData] = useState()
    const [adminsList, setAdminsList] = useState()

    useEffect(() => {
        if (isAdmin)
            getDashboardData()
    }, [])

    useEffect(() => {
        if (auth?.currentUser && isAdmin)
            getAdminUsers()
    }, [auth?.currentUser])

    async function getDashboardData() {
        try {
            const prods_data = await getProductsAnalytics()
            const app_data = await getAppSettings()
            setData({ prods_data: prods_data, app_data: app_data })
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    async function getAdminUsers() {
        try {
            const token = await auth.currentUser.getIdToken();

            const options = {
                method: 'GET',
                headers: {
                    authorization: token,
                },
            };

            const response = await fetch('/api/admin/admins-list', options);
            const adminUsers = await response.json();
            setAdminsList(adminUsers)
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
                    {data &&
                        <main className={styles.main}>
                            {adminsList && <p>Total Admins: {adminsList.length}</p>}
                            <p>Products active: {data.prods_data.active}</p>
                            <p>Products disabled: {data.prods_data.disabled}</p>
                            <p>Currencies updated at: {convertTimestampToFormatDateSeconds(data.app_data.find(doc => doc.id === 'currencies').updated_at, i18n.language)}</p>
                            <p>Deleted users: {data.app_data.find(doc => doc.id === 'deleted_users').data.length}</p>
                            <p>Clear deleted users executed at: {convertTimestampToFormatDateSeconds(data.app_data.find(doc => doc.id === 'deleted_users').updated_at, i18n.language)}</p>
                        </main>
                    }
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