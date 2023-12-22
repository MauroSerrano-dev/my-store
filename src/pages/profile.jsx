import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from '../components/NoFound404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { COMMON_TRANSLATES, DEFAULT_LANGUAGE, USER_CUSTOMIZE_HOME_PAGE } from '@/consts'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { showToast } from '@/utils/toasts'
import { convertTimestampToFormatDate, getObjectsDiff } from '@/utils'
import TextInput from '@/components/material-ui/TextInput'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppContext } from '@/components/contexts/AppContext'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import Modal from '@/components/Modal'
import { LoadingButton } from '@mui/lab'
import { SlClose } from "react-icons/sl";

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile() {
    const {
        router,
        session,
        updateSession,
        auth,
        userEmailVerify,
        windowWidth,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tProfile = useTranslation('profile').t
    const tMenu = useTranslation('menu').t
    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t

    const starterUser = session ? { ...session } : undefined

    const [user, setUser] = useState()
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
    const [deleteAccountModalOpacity, setDeleteAccountModalOpacity] = useState(false)
    const [disableSaveButton, setDisableSaveButton] = useState(true)
    const [verificationEmailSent, setVerificationEmailSent] = useState(false)
    const [deleteTextInput, setDeleteTextInput] = useState('')
    const [deleteAccButtonLoading, setDeleteAccButtonLoading] = useState(false)

    useEffect(() => {
        if (session)
            setUser({ ...session })
        else if (session === null)
            setUser(null)
    }, [session])

    function handleChanges(fieldName, value) {
        setDisableSaveButton(false)
        setUser(prev => ({ ...prev, [fieldName]: value }))
    }

    function handleSendVerificationEmail() {
        if (verificationEmailSent === 'custom_msg') {
            setVerificationEmailSent(true)
            showToast({ type: 'info', msg: "If you can't find it, please check your span" })
            return
        }
        if (verificationEmailSent) {
            setVerificationEmailSent('custom_msg')
            showToast({ type: 'info', msg: 'Verification email already sent' })
            return
        }
        setVerificationEmailSent(true)

        auth.languageCode = i18n.language;
        sendEmailVerification(auth.currentUser, {
            url: process.env.NEXT_PUBLIC_URL.concat('/email-verification'),
            handleCodeInApp: true,
        })
            .then(() => {
                showToast({ type: 'success', msg: `Verification email sent to ${auth.currentUser.email}` })
            })
            .catch((error) => {
                setVerificationEmailSent(false)
                console.error("Error sending verification email:", error)
                if (error.code === 'auth/too-many-requests')
                    return showToast({ type: 'error', msg: tToasts('too_many_requests') })
                showToast({ type: 'error', msg: "Error sending verification email:" })
            })
    }

    function handleUpdateUser() {
        const changes = {}

        Object.keys(getObjectsDiff(starterUser, user)).forEach(key => {
            changes[key] = user[key]
        })
        if (Object.keys(changes).length === 0 && router.locale === i18n.language) {
            showToast({ msg: tProfile('no_changes_toast') })
            return
        }
        if (user.home_page_tags.length < TAGS_MIN_LIMIT) {
            showToast({ type: 'error', msg: 'You must have at least 3 keywords.' })
            return
        }
        setDisableSaveButton(true)

        const { first_name, last_name } = changes
        updateProfile(auth.currentUser, { displayName: `${first_name || session.first_name || ''} ${last_name || session.last_name || ''}` })
            .then(() => {
                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: process.env.NEXT_PUBLIC_APP_TOKEN
                    },
                    body: JSON.stringify({
                        user_id: session.id,
                        changes: changes,
                    })
                }
                fetch("/api/user", options)
                    .then(response => response.json())
                    .then(response => {
                        if (response.status === 200) {
                            showToast({ type: 'success', msg: response.message })
                            updateSession()
                        }
                        else {
                            showToast({ type: 'error', msg: response.message })
                        }
                    })
                    .catch(() => {
                        showToast({ type: 'error', msg: tToasts('default_error') })
                    })
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    function handleOpenDeleteModal() {
        setDeleteAccountModalOpacity(true)
        setTimeout(() => {
            setDeleteAccountModalOpen(true)
        }, 300)
    }

    function handleCloseDeleteModal() {
        setDeleteAccountModalOpacity(false)
        setTimeout(() => {
            setDeleteAccountModalOpen(false)
        }, 300)
    }

    function handleDeleteAccount() {
        setDeleteAccButtonLoading(true)

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                user_id: session.id
            },
        }

        fetch("/api/user", options)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    showToast({ type: 'error', msg: tToasts(response.error) })
                    setDeleteAccButtonLoading(false)
                }
                else {
                    showToast({ type: 'success', msg: tToasts(response.message) })
                    window.location.href = `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}`
                }
            })
            .catch(() => {
                setDeleteAccButtonLoading(false)
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    return (
        session === undefined || user === undefined
            ? <div></div>
            : session === null || user === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <main className={styles.userContainer}>
                        <div className={styles.fieldsHead}>
                            <p className={styles.welcomeTitle}>{tMenu('Welcome')} <b style={{ color: 'var(--primary)' }}>{session.first_name ? session.first_name + ' ' + session.last_name : session.last_name}!</b></p>
                        </div>
                        <h3 style={{ paddingLeft: '0.3rem' }}>Informations</h3>
                        <div className={styles.infos}>
                            <div
                                className={styles.emailContainer}
                            >
                                <p className='ellipsis'>
                                    <span style={{ fontWeight: 600 }}>{tCommon('e-mail')}:</span> {user.email}
                                </p>
                                <p>
                                    {userEmailVerify ? <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>verified</span> : <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>not verified</span>}
                                </p>
                                {!userEmailVerify &&
                                    <Button
                                        variant='contained'
                                        size='small'
                                        style={{
                                            height: '23px'
                                        }}
                                        onClick={handleSendVerificationEmail}
                                    >
                                        Send verification email
                                    </Button>
                                }
                            </div>
                            <div className={styles.fieldsBody}>
                                <div className={styles.left}>
                                    <TextInput
                                        label={tProfile('first_name')}
                                        defaultValue={user.first_name || ''}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={event => handleChanges('first_name', event.target.value)}
                                    />
                                    <TextInput
                                        label={tProfile('last_name')}
                                        defaultValue={user.last_name}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={event => handleChanges('last_name', event.target.value)}
                                    />
                                    <p className={styles.createAtDate}>{tProfile('customer_since')}: {convertTimestampToFormatDate(session.create_at, i18n.language)}</p>
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.field}>
                                        <h3>{tProfile('customize_title')}</h3>
                                        <p style={{ textAlign: 'start' }}>{tProfile('customize_p_start')}<b>{tProfile('customize_p_middle', { min: TAGS_MIN_LIMIT, max: TAGS_MAX_LIMIT })}</b>{tProfile('customize_p_end')}</p>
                                        <p>{tProfile('Chosen')}: <b style={{ color: 'var(--primary)' }}>{user.home_page_tags.length}/{TAGS_MAX_LIMIT}</b></p>
                                        <TagsSelector
                                            options={USER_CUSTOMIZE_HOME_PAGE.map(theme => theme.id)}
                                            label={tProfile('Keywords')}
                                            value={user.home_page_tags}
                                            sx={{
                                                width: '100%'
                                            }}
                                            onChange={(event, value) => {
                                                if (value.length > TAGS_MAX_LIMIT)
                                                    showToast({ type: 'error', msg: tProfile('max_keywords_toast') })
                                                else
                                                    handleChanges('home_page_tags', value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant='contained'
                                color='success'
                                disabled={disableSaveButton}
                                className={`${styles.saveButton} ${disableSaveButton ? styles.saveDisabled : ''}`}
                                onClick={handleUpdateUser}
                            >
                                {tProfile('Save')}
                            </Button>
                        </div>
                        <div
                            className={styles.dangerZone}
                        >
                            <h3 style={{ paddingLeft: '0.3rem' }}>
                                {tProfile('danger_zone')}
                            </h3>
                            <div className={styles.dangerZoneBody}>
                                <div className={styles.dangerZoneOption}>
                                    <div className={styles.dangerZoneOptionLeft}>
                                        <p style={{ fontWeight: 600 }}>
                                            {tProfile('delete_account')}
                                        </p>
                                        <p>
                                            {tProfile('action_irreversible')}
                                        </p>
                                    </div>
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        onClick={handleOpenDeleteModal}
                                    >
                                        {tProfile('delete_account')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                    {deleteAccountModalOpen &&
                        <Modal
                            closeModal={handleCloseDeleteModal}
                            showModalOpacity={deleteAccountModalOpacity}
                            content={
                                <div className={styles.modalContent}>
                                    <div className={`${styles.modalHead} noSelection`}>
                                        <h3>
                                            {tProfile('delete_account')}
                                        </h3>
                                        <button
                                            className='flex buttonInvisible'
                                            onClick={handleCloseDeleteModal}
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
                                            <li>{tProfile('action_irreversible')}</li>
                                            <li>{tProfile('to_complete')} "<span style={{ color: 'var(--color-error)', fontWeight: 500 }}>{tProfile('DELETE MY ACCOUNT')}</span>".</li>
                                            <li>{tProfile('unable_to_create')}</li>
                                        </ul>
                                    </div>
                                    <div className={styles.modalFoot}>
                                        <TextInput
                                            colorBorderFocus='var(--color-error)'
                                            dark
                                            placeholder={tProfile('DELETE MY ACCOUNT')}
                                            size='small'
                                            onChange={event => setDeleteTextInput(event.target.value)}
                                            style={{
                                                width: windowWidth <= 750 ? '100%' : 'calc(100% - 150px)'
                                            }}
                                        />
                                        <LoadingButton
                                            loading={deleteAccButtonLoading}
                                            variant='contained'
                                            color='error'
                                            sx={{
                                                width: windowWidth <= 750 ? '100%' : 120
                                            }}
                                            disabled={deleteTextInput !== tProfile('DELETE MY ACCOUNT')}
                                            onClick={handleDeleteAccount}
                                        >
                                            {tProfile('delete')}
                                        </LoadingButton>
                                    </div>
                                </div>
                            }
                        />
                    }
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['profile'])))
        }
    }
}