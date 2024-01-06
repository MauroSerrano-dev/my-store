import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { applyActionCode, confirmPasswordReset } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { showToast } from '@/utils/toasts';
import { useAppContext } from '@/components/contexts/AppContext';
import { useTranslation } from 'next-i18next'
import { COMMON_TRANSLATES, LIMITS } from '@/consts';
import styles from '@/styles/pages/__/auth.module.css'
import { SlLock } from "react-icons/sl";
import PasswordInput from '@/components/material-ui/PasswordInput';
import { LoadingButton } from '@mui/lab';
import { isStrongPassword } from '@/utils/validations';

export default function AuthHandler() {

    const {
        auth,
        router,
        setUserEmailVerify,
        isUser,
    } = useAppContext()

    const [mode, setMode] = useState()
    const [newPassword, setNewPassword] = useState('')
    const [disableButton, setDisableButton] = useState(false)
    const [showModalGuide, setShowModalGuide] = useState(false)

    const tAuth = useTranslation('auth').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (router.query?.mode === 'verifyEmail' && router.query?.oobCode) {
            setMode('verifyEmail')
        }
        else if (router.query?.mode === 'resetPassword' && router.query?.oobCode) {
            setMode('resetPassword')
        }
        else
            router.push('/')
    }, [router])

    useEffect(() => {
        if (mode === 'verifyEmail') {
            setMode('verifyEmail')
            applyActionCode(auth, router.query.oobCode)
                .then(() => {
                    setUserEmailVerify(true)
                    showToast({ type: 'success', msg: tToasts('email_verified') })
                    router.push('/')
                })
                .catch(() => {
                    showToast({ type: 'error', msg: tToasts('error_verifying_email') })
                    router.push('/')
                })
        }
    }, [mode])

    function handleNewPassword(event) {
        setNewPassword(event.target.value)
    }

    function handleResetPassword() {
        const passValidation = isStrongPassword(newPassword)
        if (passValidation !== true) {
            showToast({ msg: tToasts(passValidation) })
            setShowModalGuide(true)
            return
        }

        setDisableButton(true)

        confirmPasswordReset(auth, router.query.oobCode, newPassword)
            .then(() => {
                showToast({ type: 'success', msg: tToasts('password_reset_successfully') })
                if (isUser)
                    router.push('/')
                else
                    router.push('/login')
            })
            .catch(error => {
                console.error('Error resetting password:', error)
                if (error.code === 'auth/expired-action-code')
                    showToast({ type: 'error', msg: tToasts('expired_link') })
                else
                    showToast({ type: 'error', msg: tToasts('error_resetting_password') })
                setDisableButton(false)
            })

    }

    return (
        <div className={styles.container}>
            {mode === 'verifyEmail' &&
                <div
                    className={styles.verifyEmail}
                >
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            position: 'absolute',
                            color: '#525252',
                        }}
                        size={60}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        disableShrink
                        size={60}
                        thickness={4}
                        sx={{
                            position: 'absolute',
                            animationDuration: '750ms',
                        }}
                    />
                </div>
            }
            {mode === 'resetPassword' &&
                <div
                    className={styles.resetPassword}
                >
                    <SlLock
                        className={styles.lockIcon}
                    />
                    <h2>Reset Password</h2>
                    <PasswordInput
                        label={tAuth('new_password')}
                        value={newPassword}
                        size='small'
                        onChange={handleNewPassword}
                        dark
                        limit={LIMITS.input_password}
                        style={{
                            width: '100%'
                        }}
                        hasModal
                        showModalGuide={showModalGuide}
                        setShowModalGuide={setShowModalGuide}
                    />
                    <LoadingButton
                        loading={disableButton}
                        variant='contained'
                        size='large'
                        style={{
                            width: '100%'
                        }}
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </LoadingButton>
                </div>
            }
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer', 'auth'])))
        }
    }
}