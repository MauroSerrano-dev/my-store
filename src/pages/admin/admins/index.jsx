import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toasts';
import { Avatar } from '@mui/material';
import { convertStringToFormatDate } from '@/utils';
import MyTable from '@/components/material-ui/MyTable';

export default function Admins() {
    const {
        auth,
        session,
        isAdmin,
        router,
    } = useAppContext()

    const {
        page = 1,
        limit = 100,
    } = router.query

    const [adminList, setAdminsList] = useState()

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (isAdmin)
            getAdminUsers()
    }, [isAdmin])

    async function getAdminUsers() {
        try {
            const token = await auth.currentUser.getIdToken()

            const options = {
                method: 'GET',
                headers: {
                    authorization: token,
                    page: page,
                    limit: limit,
                },
            };

            const response = await fetch('/api/admin/admins-list', options)
            const adminUsers = await response.json()

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
                    <main className={styles.main}>
                        {adminList &&
                            <MyTable
                                headers={[
                                    { id: 'photoURL', title: 'Photo' },
                                    { id: 'displayName', title: 'Name' },
                                    { id: 'email', title: 'Email' },
                                    { id: 'uid', title: 'ID' },
                                    { id: 'isAdmin', title: 'Admin' },
                                    { id: 'disabled', title: 'Disabled' },
                                    { id: 'emailVerified', title: 'Email Verified' },
                                    { id: 'creationTime', title: 'Creation Time' },
                                    { id: 'lastSignInTime', title: 'Last Sign In Time' },
                                    { id: 'lastRefreshTime', title: 'Last Refresh Time' },
                                    { id: 'tokensValidAfterTime', title: 'Tokens Valid After Time' },
                                ]}
                                records={adminList.map(admin => ({
                                    ...admin,
                                    photoURL: admin.photoURL && <Avatar src={admin.photoURL} />,
                                    isAdmin: String(admin.customClaims?.admin),
                                    disabled: String(admin.disabled),
                                    emailVerified: String(admin.emailVerified),
                                    creationTime: convertStringToFormatDate(admin.metadata.creationTime, i18n.language),
                                    lastSignInTime: convertStringToFormatDate(admin.metadata.lastSignInTime, i18n.language),
                                    lastRefreshTime: convertStringToFormatDate(admin.metadata.lastRefreshTime, i18n.language),
                                    tokensValidAfterTime: convertStringToFormatDate(admin.tokensValidAfterTime, i18n.language)
                                }))}
                            />
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