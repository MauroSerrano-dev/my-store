import styles from '@/styles/admin/quests.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import TextInput from '@/components/material-ui/TextInput';
import MyButton from '@/components/material-ui/MyButton';
import { useState } from 'react';
import MyError from '@/classes/MyError';
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next';

export default function Quests() {
    const {
        session,
        isAdmin,
        auth,
    } = useAppContext()

    const tToasts = useTranslation('toasts').t

    const [questId, setQuestId] = useState('')
    const [disableButtons, setDisableButtons] = useState(false)

    async function handleCreateNewQuest() {
        try {
            setDisableButtons(true)

            const token = await auth.currentUser.getIdToken();

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify({
                    questId: questId,
                })
            }
            const response = await fetch('/api/users/add-quest-for-all', options)
            const responseJson = await response.json()
            if (response.status >= 300)
                throw new MyError(responseJson.message)
            showToast({ type: 'success', msg: tToasts(responseJson.message) })
            setQuestId('')
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
        finally {
            setDisableButtons(false)
        }
    }

    async function handleDeleteQuest() {
        try {
            setDisableButtons(true)

            const token = await auth.currentUser.getIdToken();

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                    quest_id: questId
                },
            }
            const response = await fetch('/api/users/add-quest-for-all', options)
            const responseJson = await response.json()
            if (response.status >= 300)
                throw new MyError(responseJson.message)
            showToast({ type: 'success', msg: tToasts(responseJson.message) })
            setQuestId('')
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
        finally {
            setDisableButtons(false)
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
                        <TextInput
                            value={questId}
                            onChange={event => setQuestId(event.target.value)}
                            size='small'
                            style={{
                                width: 600
                            }}
                        />
                        <MyButton
                            disabled={disableButtons}
                            onClick={handleCreateNewQuest}
                            color='success'
                            light
                        >
                            Create
                        </MyButton>
                        <MyButton
                            disabled={disableButtons}
                            onClick={handleDeleteQuest}
                            color='error'
                            light
                        >
                            Delete
                        </MyButton>
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