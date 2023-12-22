import styles from '@/styles/pages/forgot-password.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import TextInput from '@/components/material-ui/TextInput'
import { useAppContext } from '@/components/contexts/AppContext'
import NoFound404 from '@/components/NoFound404'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTranslation } from 'next-i18next'
import { handleReCaptchaError, handleReCaptchaSuccess } from '@/utils/validations'
import { showToast } from '@/utils/toasts'
import { sendPasswordResetEmail } from 'firebase/auth'
import { LoadingButton } from '@mui/lab'
import { COMMON_TRANSLATES } from '@/consts'
import Image from 'next/image'

export default function ForgotPassword() {
    const {
        auth,
        authValidated,
        isUser
    } = useAppContext()

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [email, setEmail] = useState('')
    const [disableButton, setDisableButton] = useState(false)

    function handleSubmit() {
        if (!reCaptchaSolve)
            return showToast({ msg: tToasts('solve_recaptcha') })

        setDisableButton(true)

        auth.languageCode = i18n.language
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmail('')
                setDisableButton(false)
                showToast({ type: 'success', msg: 'Email sent if its a customer' })
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found')
                    showToast({ type: 'success', msg: 'Email sent if its a customer' })
                else if (error.code === 'auth/missing-email')
                    showToast({ type: 'error', msg: tToasts('missing_email') })
                else if (error.code === 'auth/invalid-email')
                    showToast({ type: 'error', msg: tToasts('invalid_email') })
                else
                    showToast({ type: 'error', msg: 'Erro ao enviar e-mail de redefinição de senha' })
                setDisableButton(false)
            })
    }

    function handleChangeEmail(event) {
        setEmail(event.target.value)
    }

    return (
        !authValidated
            ? <div></div>
            : isUser
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div
                            className={styles.left}
                        >
                            <div
                                className={styles.leftTitle}
                            >
                                <h2>Don’t remember your password?</h2>
                                <h3>Don’t worry! it happens :)</h3>
                            </div>
                            <p
                                style={{
                                    fontSize: '15px'
                                }}
                            >
                                Type in your e-mail and we will send you a link to change your password.
                            </p>
                            <div
                                className={styles.form}
                            >
                                <div className={styles.fieldsContainer}>
                                    <TextInput
                                        label='E-mail'
                                        size='small'
                                        name='email'
                                        value={email}
                                        onChange={handleChangeEmail}
                                        style={{
                                            width: '93.5%',
                                        }}
                                    />
                                    <div className='fillWidth center'>
                                        <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                            onChange={userToken => handleReCaptchaSuccess(userToken, setReCaptchaSolve)}
                                            onExpired={() => handleReCaptchaError(setReCaptchaSolve)}
                                            onErrored={() => handleReCaptchaError(setReCaptchaSolve)}
                                            hl={i18n.language}
                                            theme="dark"
                                            className='reCaptcha'
                                        />
                                    </div>
                                </div>
                                <LoadingButton
                                    loading={disableButton}
                                    type='submit'
                                    variant='contained'
                                    onClick={handleSubmit}
                                    sx={{
                                        width: '25%',
                                        minWidth: '190px',
                                        height: '45px',
                                        color: '#ffffff',
                                        fontWeight: '700',
                                        textTransform: 'none',
                                        fontSize: 16
                                    }}
                                >
                                    Reset Password
                                </LoadingButton>
                            </div>
                            <Link
                                href='/login'
                                className={styles.linkBackToLogin}
                            >
                                Back to Login
                            </Link>
                        </div>
                        <div
                            className={styles.right}
                        >
                            <div
                                className={styles.imgRight}
                            >
                                <Image
                                    src='/forgot-password_banner.webp'
                                    alt='reset password banner'
                                    priority
                                    quality={100}
                                    fill
                                    sizes='100%'
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                    }}
                                />
                            </div>
                        </div>
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