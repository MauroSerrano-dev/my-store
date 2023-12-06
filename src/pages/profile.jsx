import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from '../components/NoFound404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { USER_CUSTOMIZE_HOME_PAGE } from '@/consts'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { showToast } from '@/utils/toasts'
import { convertTimestampToFormatDate, getObjectsDiff } from '@/utils'
import TextInput from '@/components/material-ui/TextInput'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppContext } from '@/components/contexts/AppContext'
import { sendEmailVerification, updateProfile } from 'firebase/auth'

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile() {
    const {
        router,
        session,
        updateSession,
        auth,
        userEmailVerify,
    } = useAppContext()

    const { i18n } = useTranslation()
    const tProfile = useTranslation('profile').t
    const tMenu = useTranslation('menu').t
    const tToasts = useTranslation('toasts').t

    const starterUser = session ? { ...session } : undefined

    const [user, setUser] = useState()
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
    const [disableSaveButton, setDisableSaveButton] = useState(true)
    const [verificationEmailSent, setVerificationEmailSent] = useState(false)

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
        if (Object.keys(changes).length === 0 && router.locale === currentLanguage) {
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
                    .catch(err => {
                        console.error(err)
                    })
            })
            .catch(() => {
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
                        <div
                            style={{
                                height: 45,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <p>
                                <span style={{ fontWeight: 600 }}>{tProfile('E-mail')}:</span> {user.email}
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
                    </main>
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'profile', 'toasts']))
        }
    }
}