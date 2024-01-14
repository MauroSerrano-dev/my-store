import styles from '@/styles/admin/customers/inactive.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toasts';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import { convertStringToFormatDate } from '@/utils';
import MyButton from '@/components/material-ui/MyButton';
import Modal from '@/components/Modal';
import { SlClose } from 'react-icons/sl';
import TextInput from '@/components/material-ui/TextInput';
import { LoadingButton } from '@mui/lab';

const INACTIVE_MONTHS = 12

export default function InactiveCustomers() {
    const {
        auth,
        session,
        isAdmin,
        router,
        windowWidth,
    } = useAppContext()

    const {
        page = 1,
        limit = 100,
    } = router.query

    const [adminList, setInactiveList] = useState()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteTextInput, setDeleteTextInput] = useState('')
    const [deleteAccButtonLoading, setDeleteAccButtonLoading] = useState(false)

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t
    const tInactiveCustomers = useTranslation('inactive-customers').t

    useEffect(() => {
        if (isAdmin)
            getInactiveUsers()
    }, [isAdmin])

    async function getInactiveUsers() {
        try {
            const token = await auth.currentUser.getIdToken()

            const options = {
                method: 'GET',
                headers: {
                    authorization: token,
                    page: page,
                    limit: limit,
                    months: INACTIVE_MONTHS
                },
            };

            const response = await fetch('/api/users/inactive', options)
            const inactiveUsers = await response.json()

            setInactiveList(inactiveUsers)
        } catch (error) {
            console.error(error)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) });
        }
    }

    async function handleDeleteInactiveUsers() {
        try {
            setDeleteAccButtonLoading(true)
            const token = await auth.currentUser.getIdToken()

            const options = {
                method: 'DELETE',
                headers: {
                    authorization: token,
                    months: INACTIVE_MONTHS
                },
            };

            await fetch('/api/users/inactive', options)
            setInactiveList([])
            setDeleteModalOpen(false)
        } catch (error) {
            console.error(error)
            setDeleteAccButtonLoading(false)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) });
        }
    }


    function handleKeyDownDelete(event) {
        if (event.key === 'Enter') {
            handleDeleteInactiveUsers()
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
                        <h1>
                            Inactive Users
                        </h1>
                        <p>
                            Usuários que estão inativos a mais de {INACTIVE_MONTHS} meses e nunca compraram nada
                        </p>
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
                                                <TableCell>{String(admin.customClaims?.admin || false)}</TableCell>
                                                <TableCell>{String(admin.disabled)}</TableCell>
                                                <TableCell>{String(admin.emailVerified)}</TableCell>
                                                <TableCell>{convertStringToFormatDate(admin.metadata.creationTime, i18n.language)}</TableCell>
                                                <TableCell>{convertStringToFormatDate(admin.metadata.lastSignInTime, i18n.language)}</TableCell>
                                                <TableCell>{convertStringToFormatDate(admin.metadata.lastRefreshTime, i18n.language)}</TableCell>
                                                <TableCell>{convertStringToFormatDate(admin.tokensValidAfterTime, i18n.language)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        }
                        <MyButton
                            color='error'
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete Inactive Users
                        </MyButton>
                        <Modal
                            className={styles.modalContent}
                            open={deleteModalOpen}
                            closeModal={() => {
                                if (!deleteAccButtonLoading)
                                    setDeleteModalOpen(false)
                            }}
                            closedCallBack={() => setDeleteAccButtonLoading(false)}
                        >
                            <div className={`${styles.modalHead} noSelection`}>
                                <h3>
                                    {tInactiveCustomers('delete_inactive_users')}
                                </h3>
                                <button
                                    className='flex buttonInvisible'
                                    onClick={() => setDeleteModalOpen(false)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '1rem',
                                    }}
                                >
                                    <SlClose
                                        size={20}
                                    />
                                </button>
                            </div>
                            <div className={`${styles.modalBody} noSelection`}>
                                <ul className={styles.modalBodyList}>
                                    <li>{tInactiveCustomers('action_irreversible')}</li>
                                    <li>{tInactiveCustomers('to_complete')} "<span style={{ color: 'var(--color-error)', fontWeight: 500 }}>{tInactiveCustomers('DELETE INACTIVE USERS')}</span>".</li>
                                </ul>
                            </div>
                            <div className={styles.modalFoot}>
                                <TextInput
                                    colorBorderFocus='var(--color-error)'
                                    dark
                                    placeholder={tInactiveCustomers('DELETE INACTIVE USERS')}
                                    size='small'
                                    onChange={event => setDeleteTextInput(event.target.value)}
                                    onKeyDown={handleKeyDownDelete}
                                    value={deleteTextInput}
                                    style={{
                                        width: windowWidth <= 750 ? '100%' : 'calc(100% - 150px)'
                                    }}
                                />
                                <LoadingButton
                                    loading={deleteAccButtonLoading}
                                    variant='contained'
                                    color='error'
                                    sx={{
                                        width: windowWidth <= 750 ? '100%' : 120,
                                        textTransform: 'none',
                                    }}
                                    disabled={deleteTextInput !== tInactiveCustomers('DELETE INACTIVE USERS')}
                                    onClick={handleDeleteInactiveUsers}
                                >
                                    {tInactiveCustomers('delete')}
                                </LoadingButton>
                            </div>
                        </Modal>
                    </main>
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['inactive-customers'])))
        }
    }
}