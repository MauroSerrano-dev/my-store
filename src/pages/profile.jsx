import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from './404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { LANGUAGES, USER_CUSTOMIZE_HOME_PAGE } from '../../consts'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { showToast } from '../../utils/toasts'
import { getObjectsDiff } from '../../utils'
import TextInput from '@/components/material-ui/TextInput'
import Selector from '@/components/material-ui/Selector'
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile(props) {
    const {
        session,
        updateSession,
        supportsHoverAndPointer,
        router,
    } = props

    const { i18n } = useTranslation()
    const tLanguages = useTranslation('languages').t
    const tProfile = useTranslation('profile').t
    const tMenu = useTranslation('menu').t

    const starterUser = session ? { ...session } : undefined

    const [user, setUser] = useState()
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
    const [disableSaveButton, setDisableSaveButton] = useState(true)

    useEffect(() => {
        if (session)
            setUser({ ...session })
    }, [session])

    function handleChanges(fieldName, value) {
        setDisableSaveButton(false)
        setUser(prev => ({ ...prev, [fieldName]: value }))
    }

    function handleChangeLanguageSelector(event) {
        setDisableSaveButton(false)
        setCurrentLanguage(event.target.value)
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

        const { pathname, asPath, query } = router
        router.push({ pathname, query }, asPath, { locale: currentLanguage })

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
    }

    return (
        session === undefined || user === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <main className={styles.userContainer}>
                        <div className={styles.fieldsHead}>
                            <p style={{ fontSize: 23, textAlign: 'start' }}>{tMenu('Welcome')} <b style={{ color: 'var(--primary)' }}>{session.first_name ? session.first_name + ' ' + session.last_name : session.last_name}!</b></p>
                        </div>
                        <div className={styles.fieldsBody}>
                            <div className={styles.left}>
                                <TextInput
                                    label={tProfile('first_name')}
                                    defaultValue={user.first_name || ''}
                                    style={{
                                        width: '100%'
                                    }}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    onChange={event => handleChanges('first_name', event.target.value)}
                                />
                                <TextInput
                                    label={tProfile('last_name')}
                                    defaultValue={user.last_name}
                                    style={{
                                        width: '100%'
                                    }}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    onChange={event => handleChanges('last_name', event.target.value)}
                                />
                                <TextInput
                                    label={tProfile('E-mail')}
                                    defaultValue={user.email}
                                    style={{
                                        width: '100%'
                                    }}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    onChange={event => handleChanges('email', event.target.value)}
                                />
                                <Selector
                                    label={tProfile("Language")}
                                    options={LANGUAGES.map(lang => ({ value: lang, name: tLanguages(lang) }))}
                                    value={currentLanguage}
                                    onChange={handleChangeLanguageSelector}
                                    size={'medium'}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                />
                            </div>
                            <div className={styles.right}>
                                <div className={styles.field}>
                                    <h3>{tProfile('customize_title')}</h3>
                                    <p style={{ textAlign: 'start' }}>{tProfile('customize_p_start')}<b>{tProfile('customize_p_middle', { min: TAGS_MIN_LIMIT, max: TAGS_MAX_LIMIT })}</b>{tProfile('customize_p_end')}</p>
                                    <p>{tProfile('Chosen')}: <b style={{ color: 'var(--primary)' }}>{user.home_page_tags.length}/{TAGS_MAX_LIMIT}</b></p>
                                    <TagsSelector
                                        supportsHoverAndPointer={supportsHoverAndPointer}
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
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'profile', 'languages']))
        }
    }
}