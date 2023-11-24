import styles from '@/styles/pages/login.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi"
import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from 'react'
import { showToast } from '../../utils/toasts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PasswordInput from '@/components/material-ui/PasswordInput'
import { useTranslation } from 'next-i18next';
import GoogleButton from '@/components/buttons/GoogleButton'

export default function Login(props) {
    const {
        login,
        auth,
        mobile,
        router,
        session,
        setLoading,
    } = props

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (session)
            router.push('/profile')
    }, [session])

    function handleReCaptchaSuccess() {
        setReCaptchaSolve(true)
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
    }

    function googleLogin() {
        signInWithPopup(auth, provider)
            .then(result => {
                router.push('/')
                showToast({ msg: tToasts('success_login'), type: 'success' })
            })
            .catch(error => {
                showToast({ msg: tToasts('default_error'), type: 'error' })
            })
    }

    function handleLogin() {
        if (reCaptchaSolve) {
            setLoading(true)
            login(email, password)
        }
        else {
            showToast({ msg: 'Please solve the reCAPTCHA.' })
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
                        <h1>Login</h1>
                    </div>
                    <div
                        className={styles.loginBody}
                        style={{
                            paddingLeft: mobile ? '4.5vw' : '10vw',
                            paddingRight: mobile ? '4.5vw' : '10vw'
                        }}
                    >
                        <GoogleButton
                            router={router}
                            auth={auth}
                        />
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--global-light-grey)' }}>
                            or Login with
                        </p>
                        <div className={styles.fieldsContainer}>
                            <TextField
                                variant='outlined'
                                label='E-Mail'
                                size='small'
                                name='email'
                                autoComplete='off'
                                onChange={handleEmailChange}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <PasswordInput
                                onChange={handlePasswordChange}
                                mobile={mobile}
                            />
                            <Link
                                href='/forgot-password'
                                className={styles.linkCreateAccount}
                            >
                                Forgot my password
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
                        <div
                            className={styles.loginButton}
                        >
                            <Button
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
                                Login
                            </Button>
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
                            Don’t have an account?
                        </h2>
                        <p>
                            Join {process.env.NEXT_PUBLIC_STORE_NAME} community!
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
                            Join as a Customer
                        </h3>
                        <ul>
                            <li>Save your wishlist picks.</li>
                            <li>Save your order data for next purchases.</li>
                            <li>Be the first one to know about our discounts.</li>
                        </ul>
                        <Link
                            href='/signin'
                            className={styles.linkCreateAccount}
                        >
                            Create a Customer Account
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
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'toasts']))
        }
    }
}