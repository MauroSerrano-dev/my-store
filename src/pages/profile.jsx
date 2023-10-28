import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from './404'
import TagsSelector from '@/components/material-ui/TagsSelector'
import { USER_CUSTOMIZE_HOME_PAGE } from '../../consts'
import { Button } from '@mui/material'
import { useState } from 'react'
import { showToast } from '../../utils/toasts'

const TAGS_MIN_LIMIT = 3
const TAGS_MAX_LIMIT = 8

export default function Profile(props) {
    const {
        session,
        supportsHoverAndPointer,
    } = props

    const [changes, setChanges] = useState({})

    function handleChanges(fieldName, value) {
        setChanges(prev => ({ ...prev, [fieldName]: value }))
    }

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <main className={styles.userContainer}>
                        <p style={{ fontSize: 23, width: '100%', textAlign: 'start' }}>Welcome <b style={{ color: 'var(--primary)' }}>{session.name}!</b></p>
                        <div className={styles.field}>
                            <h3>Customize your Home Page</h3>
                            <p style={{ textAlign: 'start' }}>Pick <b>{TAGS_MIN_LIMIT} to {TAGS_MAX_LIMIT} keywords.</b> You'll see bestsellers from chosen keywords on your Home Page</p>
                            <p>Chosen: <b style={{ color: 'var(--primary)' }}>{changes.home_page_tags?.length || session.home_page_tags.length}/{TAGS_MAX_LIMIT}</b></p>
                            <TagsSelector
                                supportsHoverAndPointer={supportsHoverAndPointer}
                                options={USER_CUSTOMIZE_HOME_PAGE.map(theme => theme.id)}
                                label='Keywords'
                                value={changes.home_page_tags || session.home_page_tags}
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
                        <Button
                            variant='contained'
                            color='success'
                            sx={{
                                width: '100%',
                            }}
                        >
                            Save
                        </Button>
                    </main>
                </div>
    )
}