import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import MyButton from '@/components/material-ui/MyButton';
import Link from 'next/link';
import MyTable from '@/components/material-ui/MyTable';
import { useEffect, useState } from 'react';
import MyError from '@/classes/MyError';
import { convertStringToFormatDate } from '@/utils';
import { useTranslation } from 'next-i18next';
import { Avatar } from '@mui/material';

export default function Customers() {
    const {
        session,
        isAdmin,
        router,
        auth
    } = useAppContext()

    const { i18n } = useTranslation()

    const {
        page = 1,
        limit = 100,
    } = router.query

    const [usersList, setUsersList] = useState()

    useEffect(() => {
        if (isAdmin)
            getUsers()
    }, [isAdmin])

    async function getUsers() {
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

            const response = await fetch('/api/admin/users', options)
            const responseJson = await response.json()

            if (response.status >= 300)
                throw new MyError(responseJson.message)

            setUsersList(responseJson.users)
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
                        <Link
                            href='/admin/customers/inactive'
                            className='noUnderline'
                        >
                            <MyButton>
                                Inactive Customers
                            </MyButton>
                        </Link>
                        {usersList &&
                            <MyTable
                                headers={[
                                    { id: 'photoURL', title: 'Photo' },
                                    { id: 'displayName', title: 'Name' },
                                    { id: 'email', title: 'Email' },
                                    { id: 'uid', title: 'ID' },
                                    { id: 'disabled', title: 'Disabled' },
                                    { id: 'emailVerified', title: 'Email Verified' },
                                    { id: 'creationTime', title: 'Creation Time' },
                                    { id: 'lastSignInTime', title: 'Last Sign In Time' },
                                    { id: 'lastRefreshTime', title: 'Last Refresh Time' },
                                    { id: 'tokensValidAfterTime', title: 'Tokens Valid After Time' },
                                ]}
                                records={usersList.map(user => ({
                                    ...user,
                                    photoURL: <Avatar src={user.photoURL}>{user.displayName[0]}</Avatar>,
                                    disabled: String(user.disabled),
                                    emailVerified: String(user.emailVerified),
                                    creationTime: convertStringToFormatDate(user.metadata.creationTime, i18n.language),
                                    lastSignInTime: convertStringToFormatDate(user.metadata.lastSignInTime, i18n.language),
                                    lastRefreshTime: convertStringToFormatDate(user.metadata.lastRefreshTime, i18n.language),
                                    tokensValidAfterTime: convertStringToFormatDate(user.tokensValidAfterTime, i18n.language),
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