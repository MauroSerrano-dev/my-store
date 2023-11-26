import styles from '@/styles/pages/login.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi"
import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from 'react'
import { showToast } from '../../utils/toasts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PasswordInput from '@/components/material-ui/PasswordInput'
import { useTranslation } from 'next-i18next';
import GoogleButton from '@/components/buttons/GoogleButton'
import TextInput from '@/components/material-ui/TextInput'
import { LoadingButton } from '@mui/lab'

export default function Login(props) {
    const {
        login,
        auth,
        mobile,
        router,
        session,
        loading,
        setLoading,
        supportsHoverAndPointer,
    } = props

    const [disableLoginButton, setDisableLoginButton] = useState(false)
    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const { i18n } = useTranslation()
    const tLogin = useTranslation('login-signin').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (session && !loading)
            router.push('/profile')
    }, [session])

    useEffect(() => {
        if (!loading)
            setDisableLoginButton(false)
    }, [loading])

    function handleReCaptchaSuccess() {
        setReCaptchaSolve(true)
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
    }

    function handleLogin() {
        if (reCaptchaSolve) {
            setLoading(true)
            setDisableLoginButton(true)
            login(email, password)
        }
        else {
            showToast({ msg: tToasts('solve_recaptcha') })
        }
    }

    function handleEmailChange(event) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    return (
        session === null &&
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}
                style={{
                    flexDirection: mobile ? 'column' : 'row'
                }}
            >
                <div
                    className={styles.loginContainer}
                    style={{
                        width: mobile ? '100%' : '65.45%',
                    }}
                >
                    <div
                        className={styles.loginHead}
                    >
                        <h1>{tLogin('Login')}</h1>
                    </div>
                    <div
                        className={styles.loginBody}
                        style={{
                            paddingLeft: mobile ? '4.5vw' : '10vw',
                            paddingRight: mobile ? '4.5vw' : '10vw'
                        }}
                    >
                        <div className={styles.loginBodyTop}>
                            <GoogleButton
                                router={router}
                                auth={auth}
                                text={tLogin('google_button')}
                            />
                            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--global-light-grey)' }}>
                                {tLogin('or_login_with')}
                            </p>
                            <div className={styles.fieldsContainer}>
                                <TextInput
                                    label={tLogin('E-Mail')}
                                    size='small'
                                    name='email'
                                    onChange={handleEmailChange}
                                    value={email}
                                    dark
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                                <PasswordInput
                                    label={tLogin('Password')}
                                    onChange={handlePasswordChange}
                                    mobile={mobile}
                                    value={password}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    dark
                                />
                                <Link
                                    href='/forgot-password'
                                    className={styles.linkCreateAccount}
                                >
                                    {tLogin('forgot_password')}
                                </Link>
                                <div className='fillWidth center'>
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                        onChange={handleReCaptchaSuccess}
                                        onExpired={handleReCaptchaError}
                                        onErrored={handleReCaptchaError}
                                        hl={i18n.language}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={styles.loginBodyBottom}
                        >
                            <LoadingButton
                                loading={disableLoginButton}
                                variant='contained'
                                onClick={handleLogin}
                                sx={{
                                    width: '100%',
                                    height: '50px',
                                    color: '#ffffff',
                                    fontWeight: '700',
                                    fontSize: '16px',
                                }}
                            >
                                {tLogin('Login')}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
                <div
                    className={styles.joinContainer}
                    style={{
                        width: mobile ? '100%' : '34.55%',
                        height: mobile ? 'auto' : '655px'
                    }}
                >
                    <div
                        className={styles.joinHead}
                    >
                        <h2
                            style={{
                                fontSize: '19px'
                            }}
                        >
                            {tLogin('dont_have_account')}
                        </h2>
                        <p>
                            {tLogin('join_community', { store_name: process.env.NEXT_PUBLIC_STORE_NAME })}
                        </p>
                    </div>
                    <div
                        className={styles.joinBody}
                    >
                        <PiHandshakeLight
                            size='45px'
                        />
                        <h3
                            style={{
                                fontSize: '16px'
                            }}
                        >
                            {tLogin('join_as_customer')}
                        </h3>
                        <ul>
                            <li>{tLogin('save_your_wishlist')}</li>
                            <li>{tLogin('save_your_order')}</li>
                            <li>{tLogin('be_the_first')}</li>
                        </ul>
                        <Link
                            href='/signin'
                            className={styles.linkCreateAccount}
                        >
                            {tLogin('create_customer_account')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'toasts', 'login-signin']))
        }
    }
}