import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from './404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { USER_CUSTOMIZE_HOME_PAGE } from '../../consts'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { showToast } from '../../utils/toasts'
import { getObjectsDiff } from '../../utils'
import TextInput from '@/components/material-ui/TextInput'

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile(props) {
    const {
        session,
        updateSession,
        supportsHoverAndPointer,
    } = props

    const starterUser = session ? { ...session } : undefined

    const [user, setUser] = useState()
    const [saving, setSaving] = useState(false)

    function handleChanges(fieldName, value) {
        setUser(prev => ({ ...prev, [fieldName]: value }))
    }

    function handleUpdateUser() {

        const changes = {}

        Object.keys(getObjectsDiff(starterUser, user)).forEach(key => {
            changes[key] = user[key]
        })
        if (Object.keys(changes).length === 0) {
            showToast({ msg: 'No changes made.' })
        }
        else {
            setSaving(true)
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
                    setSaving(false)
                })
                .catch(err => {
                    console.error(err)
                    setSaving(false)
                })
        }
    }

    useEffect(() => {
        if (session)
            setUser({ ...session })
    }, [session])

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
                            <p style={{ fontSize: 23, textAlign: 'start' }}>Welcome <b style={{ color: 'var(--primary)' }}>{session.name}!</b></p>
                        </div>
                        <div className={styles.fieldsBody}>
                            <div className={styles.left}>
                                <TextInput
                                    label='Name'
                                    defaultValue={user.name}
                                    style={{
                                        width: '100%'
                                    }}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    onChange={event => handleChanges('name', event.target.value)}
                                />
                                <TextInput
                                    label='E-mail'
                                    defaultValue={user.email}
                                    style={{
                                        width: '100%'
                                    }}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    onChange={event => handleChanges('email', event.target.value)}
                                />
                            </div>
                            <div className={styles.right}>
                                <div className={styles.field}>
                                    <h3>Customize your Home Page</h3>
                                    <p style={{ textAlign: 'start' }}>Pick <b>{TAGS_MIN_LIMIT} to {TAGS_MAX_LIMIT} keywords.</b> You'll see bestsellers from chosen keywords on your Home Page</p>
                                    <p>Chosen: <b style={{ color: 'var(--primary)' }}>{user.home_page_tags.length}/{TAGS_MAX_LIMIT}</b></p>
                                    <TagsSelector
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        options={USER_CUSTOMIZE_HOME_PAGE.map(theme => theme.id)}
                                        label='Keywords'
                                        value={user.home_page_tags}
                                        sx={{
                                            width: '100%'
                                        }}
                                        onChange={(event, value) => {
                                            if (value.length < TAGS_MIN_LIMIT)
                                                showToast({ type: 'error', msg: 'You must have at least 3 keywords.' })
                                            else if (value.length > TAGS_MAX_LIMIT)
                                                showToast({ type: 'error', msg: 'Maximum number of keywords reached.' })
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
                            disabled={saving}
                            className={`${styles.saveButton} ${saving ? styles.saveDisabled : ''}`}
                            onClick={handleUpdateUser}
                        >
                            Save
                        </Button>
                    </main>
                </div >
    )
}