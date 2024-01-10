import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toasts';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar } from '@mui/material';

export default function Admins() {
    const {
        auth,
        session,
        isAdmin,
    } = useAppContext()


    const [adminList, setAdminsList] = useState()

    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (auth?.currentUser)
            getAdminUsers()
    }, [auth?.currentUser])

    async function getAdminUsers() {
        try {
            const token = await auth.currentUser.getIdToken()

            const options = {
                method: 'GET',
                headers: {
                    authorization: token,
                },
            };

            const response = await fetch('/api/admin/admins-list', options)
            const adminUsers = await response.json()

            setAdminsList(adminUsers)
        } catch (error) {
            console.error(error)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) });
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
                            <Paper style={{ overflow: 'hidden' }}>
                                <Table aria-label="admin users table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Photo</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>UID</TableCell>
                                            <TableCell>Admin</TableCell>
                                            <TableCell>Disabled</TableCell>
                                            <TableCell>Email Verified</TableCell>
                                            <TableCell>Creation Time</TableCell>
                                            <TableCell>Last Sign In Time</TableCell>
                                            <TableCell>Last Refresh Time</TableCell>
                                            <TableCell>Tokens Valid After Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {adminList.map((admin) => (
                                            <TableRow key={admin.uid}>
                                                <TableCell>{admin.photoURL && <Avatar src={admin.photoURL} />}</TableCell>
                                                <TableCell>{admin.displayName}</TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell>{admin.uid}</TableCell>
                                                <TableCell>{admin.customClaims.admin.toString()}</TableCell>
                                                <TableCell>{admin.disabled.toString()}</TableCell>
                                                <TableCell>{admin.emailVerified.toString()}</TableCell>
                                                <TableCell>{admin.metadata.creationTime}</TableCell>
                                                <TableCell>{admin.metadata.lastSignInTime}</TableCell>
                                                <TableCell>{admin.metadata.lastRefreshTime}</TableCell>
                                                <TableCell>{admin.metadata.lastSignInTime}</TableCell>
                                                <TableCell>{admin.tokensValidAfterTime}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        }
                    </main >
                </div >
    )
}
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}