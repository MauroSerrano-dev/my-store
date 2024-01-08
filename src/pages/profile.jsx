import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from '../components/NoFound404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { COMMON_TRANSLATES, DEFAULT_LANGUAGE, LIMITS, USER_CUSTOMIZE_HOME_PAGE } from '@/consts'
import { useEffect, useState } from 'react'
import { showToast } from '@/utils/toasts'
import { convertTimestampToFormatDate, getObjectsDiff, handleCloseModal, handleOpenModal } from '@/utils'
import TextInput from '@/components/material-ui/TextInput'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppContext } from '@/components/contexts/AppContext'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import Modal from '@/components/Modal'
import { LoadingButton } from '@mui/lab'
import { SlClose } from "react-icons/sl";
import MyButton from '@/components/material-ui/MyButton'
import { FormControlLabel, Switch } from '@mui/material'
import { updateUser } from '../../frontend/user'

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile() {
    const {
        router,
        session,
        auth,
        userEmailVerify,
        windowWidth,
        setSession,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tProfile = useTranslation('profile').t
    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t
    const tCategories = useTranslation('categories').t

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

    function handleCustomHomePage(fieldName, value) {
        setDisableSaveButton(false)
        setUser(prev => ({ ...prev, custom_home_page: { ...prev.custom_home_page, [fieldName]: value } }))
    }

    function handleSendVerificationEmail() {
        if (verificationEmailSent === 'custom_msg') {
            setVerificationEmailSent(true)
            showToast({ type: 'info', msg: tToasts('if_you_cant_find_email') })
            return
        }
        if (verificationEmailSent) {
            setVerificationEmailSent('custom_msg')
            showToast({ type: 'info', msg: tToasts('verification_email_already_sent') })
            return
        }
        setVerificationEmailSent(true)

        auth.languageCode = i18n.language;
        sendEmailVerification(auth.currentUser, {
            url: process.env.NEXT_PUBLIC_URL.concat('/email-verification'),
            handleCodeInApp: true,
        })
            .then(() => {
                showToast({ type: 'success', msg: tToasts('verification_email_sent_to', { user_email: auth.currentUser.email }) })
            })
            .catch((error) => {
                setVerificationEmailSent(false)
                console.error("Error sending verification email:", error)
                if (error.code === 'auth/too-many-requests')
                    return showToast({ type: 'error', msg: tToasts('too_many_requests') })
                showToast({ type: 'error', msg: tToasts("error_sending_verification_email") })
            })
    }

    async function handleUpdateUser() {
        try {
            const changes = {}

            Object.keys(getObjectsDiff(starterUser, user)).forEach(key => {
                changes[key] = user[key]
            })
            if (Object.keys(changes).length === 0 && router.locale === i18n.language) {
                showToast({ msg: tToasts('no_changes_made') })
                return
            }
            if (user.custom_home_page.active && user.custom_home_page.tags.length < TAGS_MIN_LIMIT) {
                showToast({ msg: tToasts('must_have_at_least_keywords', { min: TAGS_MIN_LIMIT }) })
                return
            }
            setDisableSaveButton(true)

            const { first_name, last_name } = changes
            await updateProfile(auth.currentUser, { displayName: `${first_name || session.first_name || ''} ${last_name || session.last_name || ''}` })
            const updatedUser = await updateUser(session.id, changes)
            setSession(updatedUser)
            showToast({ type: 'success', msg: tToasts('user_updated') })
        }
        catch (error) {
            if (!error?.props)
                console.error(error)
            if (error?.code === 'auth/invalid-profile-attribute')
                showToast({ type: 'error', msg: tToasts('invalid_profile_attribute') })
            else
                showToast({ type: error?.props?.type || 'error', msg: tToasts(error?.props?.title || 'default_error') })
            setDisableSaveButton(false)
        }
    }

    function handleDeleteAccount() {
        if (deleteTextInput === tProfile('DELETE MY ACCOUNT')) {
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
                        showToast({ type: response?.type || 'error', msg: tToasts(response.error) })
                        setDeleteAccButtonLoading(false)
                    }
                    else {
                        showToast({ type: 'success', msg: tToasts(response.message) })
                        window.location.href = `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}`
                    }
                })
                .catch(error => {
                    console.error(error)
                    showToast({ type: 'error', msg: tToasts('default_error') })
                    setDeleteAccButtonLoading(false)
                })
        }
    }

    /*     async function handleDeleteAccount() {
            try {
                setDeleteAccButtonLoading(true)
    
                await deleteUser(session.id)
                showToast({ type: 'success', msg: tToasts('user_deleted_successfully') })
                window.location.href = `${window.location.origin}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}`
            }
            catch (error) {
                if (!error?.props)
                    console.error(error)
                showToast({ type: error?.props?.type || 'error', msg: tToasts(error?.props?.title || 'default_error') })
                setDeleteAccButtonLoading(false)
            }
        } */

    function handleKeyDownDelete(event) {
        if (event.key === 'Enter') {
            handleDeleteAccount()
        }
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
                            <p className={styles.welcomeTitle}>{tProfile('welcome')} <span style={{ color: 'var(--primary)' }}>{session.first_name ? session.first_name + ' ' + session.last_name : session.last_name}!</span></p>
                        </div>
                        <h3 style={{ paddingLeft: '0.3rem' }}>{tProfile('information_block_title')}</h3>
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
                                    <MyButton
                                        size='small'
                                        style={{
                                            height: '23px'
                                        }}
                                        onClick={handleSendVerificationEmail}
                                    >
                                        {tProfile('send_verification_email')}
                                    </MyButton>
                                }
                            </div>
                            <div className={styles.fieldsBody}>
                                <div className={styles.left}>
                                    <TextInput
                                        value={user.first_name}
                                        onChange={event => handleChanges('first_name', event.target.value)}
                                        limit={LIMITS.input_first_name}
                                        label={tProfile('first_name')}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <TextInput
                                        value={user.last_name}
                                        onChange={event => handleChanges('last_name', event.target.value)}
                                        limit={LIMITS.input_last_name}
                                        label={tProfile('last_name')}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <p className={styles.createAtDate}>{tProfile('customer_since')}: {convertTimestampToFormatDate(session.create_at, i18n.language)}</p>
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.field}>
                                        <div className='flex row center'>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={user.custom_home_page.active}
                                                        onChange={event => handleCustomHomePage('active', event.target.checked)}
                                                        color='success'
                                                    />
                                                }
                                                componentsProps={{
                                                    typography: {
                                                        fontSize: 18,
                                                        fontWeight: 700
                                                    }
                                                }}
                                                label={tProfile('customize_title')}
                                            />
                                        </div>
                                        <p style={{ textAlign: 'start' }}>{tProfile('customize_p_start')}<b>{tProfile('customize_p_middle', { min: TAGS_MIN_LIMIT, max: TAGS_MAX_LIMIT })}</b>{tProfile('customize_p_end')}</p>
                                        <p>{tProfile('Chosen')}: <b style={{ color: 'var(--primary)' }}>{user.custom_home_page.tags.length}/{TAGS_MAX_LIMIT}</b></p>
                                        <TagsSelector
                                            disabled={!user.custom_home_page.active}
                                            options={USER_CUSTOMIZE_HOME_PAGE.sort((a, b) => tCategories(b.id).toLowerCase() < tCategories(a.id).toLowerCase() ? 1 : -1).map(theme => ({ id: theme.id, label: tCategories(theme.id).toLowerCase() }))}
                                            label={tProfile('Keywords')}
                                            value={user.custom_home_page.tags.map(tg => ({ id: tg, label: tCategories(tg).toLowerCase() }))}
                                            sx={{
                                                width: '100%'
                                            }}
                                            onChange={(event, value) => {
                                                if (value.length > TAGS_MAX_LIMIT)
                                                    showToast({ type: 'error', msg: tToasts('max_keywords') })
                                                else
                                                    handleCustomHomePage('tags', value.map(tg => tg.id))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <MyButton
                                color='success'
                                disabled={disableSaveButton}
                                className={`${styles.saveButton} ${disableSaveButton ? styles.saveDisabled : ''}`}
                                onClick={handleUpdateUser}
                            >
                                {tProfile('Save')}
                            </MyButton>
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
                                    <MyButton
                                        variant='outlined'
                                        color='error'
                                        onClick={() => handleOpenModal(setDeleteAccountModalOpen, setDeleteAccountModalOpacity)}
                                    >
                                        {tProfile('delete_account')}
                                    </MyButton>
                                </div>
                            </div>
                        </div>
                    </main>
                    {deleteAccountModalOpen &&
                        <Modal
                            closeModal={() => handleCloseModal(setDeleteAccountModalOpen, setDeleteAccountModalOpacity)}
                            showModalOpacity={deleteAccountModalOpacity}
                            className={styles.modalContent}
                        >
                            <div className={`${styles.modalHead} noSelection`}>
                                <h3>
                                    {tProfile('delete_account')}
                                </h3>
                                <button
                                    className='flex buttonInvisible'
                                    onClick={() => handleCloseModal(setDeleteAccountModalOpen, setDeleteAccountModalOpacity)}
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
                                    disabled={deleteTextInput !== tProfile('DELETE MY ACCOUNT')}
                                    onClick={handleDeleteAccount}
                                >
                                    {tProfile('delete')}
                                </LoadingButton>
                            </div>
                        </Modal>
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