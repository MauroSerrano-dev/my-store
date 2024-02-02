import styles from '@/styles/admin/customers/inactive.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toasts';
import { Avatar } from '@mui/material';
import { convertStringToFormatDate } from '@/utils';
import MyButton from '@/components/material-ui/MyButton';
import Modal from '@/components/Modal';
import { SlClose } from 'react-icons/sl';
import TextInput from '@/components/material-ui/TextInput';
import { LoadingButton } from '@mui/lab';
import MyTable from '@/components/material-ui/MyTable';
import MyError from '@/classes/MyError';

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

    const [inactiveList, setInactiveList] = useState()
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
            const responseJson = await response.json()

            if (response.status >= 300)
                throw new MyError(responseJson.message)

            setInactiveList(responseJson.users)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) });
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
        }
        catch (error) {
            console.error(error)
            setDeleteAccButtonLoading(false)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
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
                        {inactiveList &&
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
                                records={inactiveList.map(user => ({
                                    ...user,
                                    photoURL: <Avatar src={user.photoURL}>{user.displayName[0]}</Avatar>,
                                    isAdmin: String(user.customClaims?.user),
                                    disabled: String(user.disabled),
                                    emailVerified: String(user.emailVerified),
                                    creationTime: convertStringToFormatDate(user.metadata.creationTime, i18n.language),
                                    lastSignInTime: convertStringToFormatDate(user.metadata.lastSignInTime, i18n.language),
                                    lastRefreshTime: convertStringToFormatDate(user.metadata.lastRefreshTime, i18n.language),
                                    tokensValidAfterTime: convertStringToFormatDate(user.tokensValidAfterTime, i18n.language)
                                }))}
                            />
                        }
                        <MyButton
                            color='error'
                            disabled={!inactiveList || inactiveList.length === 0}
                            light
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