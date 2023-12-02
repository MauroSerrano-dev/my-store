import styles from '@/styles/pages/signin.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi"
import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from 'react'
import { showToast } from '@/utils/toasts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { isStrongPassword } from '@/utils/validations'
import { useTranslation } from 'next-i18next'
import PasswordInput from '@/components/material-ui/PasswordInput'
import GoogleButton from '@/components/buttons/GoogleButton'
import { LIMITS } from '@/consts'
import TextInput from '@/components/material-ui/TextInput'
import { LoadingButton } from '@mui/lab'
import { useAppContext } from '@/components/contexts/AppContext'
import NoFound404 from '@/components/NoFound404'

export default function Signin() {
    const {
        login,
        mobile,
        router,
        session,
        loading,
        setLoading,
        authValidated,
        isUser,
    } = useAppContext()

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [showModalPassword, setShowModalPassword] = useState(false)
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        if (session && !loading)
            router.push('/profile')
    }, [session])

    const [disableSigninButton, setDisableSigninButton] = useState(false)
    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t
    const tSignin = useTranslation('login-signin').t

    function handleReCaptchaSuccess(userToken) {
        setReCaptchaSolve(true) // está assim devido ao tempo que demora a chamada api para liberar o botão

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                response: userToken,
                expectedAction: 'signup',
            }),
        }

        fetch("/api/google-re-captcha", options)
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
    }

    function handleNewUser(value, field) {
        setNewUser(prev => (
            {
                ...prev,
                [field]: value
            }
        ))
    }

    function handleCreateNewUser(user) {
        if (reCaptchaSolve) {
            const passValidation = isStrongPassword(user.password)
            if (passValidation !== true) {
                showToast({ msg: tToasts(passValidation) })
                setShowModalPassword(true)
                return
            }
            setLoading(true)
            setDisableSigninButton(true)
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                },
                body: JSON.stringify({ user: user })
            }

            fetch('/api/user', options)
                .then(response => response.json())
                .then(response => {
                    if (response.status < 300) {
                        login(user.email, user.password)
                    }
                    else if (response.status < 500) {
                        setLoading(false)
                        setDisableSigninButton(false)
                        showToast({ msg: tToasts(response.message) })
                    }
                    else {
                        setLoading(false)
                        setDisableSigninButton(false)
                        showToast({ type: 'error', msg: tToasts(response.message) })
                    }
                })
                .catch(() => {
                    setLoading(false)
                    setDisableSigninButton(false)
                    showToast({ type: 'error', msg: tToasts('error_creating_user') })
                })
        }
        else {
            showToast({ msg: tToasts('solve_recaptcha') })
        }
    }

    return (
        !authValidated
            ? <div></div>
            : isUser
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                        <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
                    </header>
                    <main
                        className={styles.main}
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
                                <h1>{tSignin('create_an_account')}</h1>
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
                                        text={tSignin('google_button_signin')}
                                    />
                                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--global-light-grey)' }}>
                                        {tSignin('or_signin_with')}
                                    </p>
                                    <div className={styles.fieldsContainer}>
                                        <TextInput
                                            label={tSignin('first_name')}
                                            value={newUser.first_name}
                                            size='small'
                                            onChange={e => handleNewUser(e.target.value, 'first_name')}
                                            dark
                                            limit={LIMITS.input_first_name}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                        <TextInput
                                            label={tSignin('last_name')}
                                            value={newUser.last_name}
                                            size='small'
                                            onChange={e => handleNewUser(e.target.value, 'last_name')}
                                            dark
                                            limit={LIMITS.input_last_name}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                        <TextInput
                                            label={tSignin('E-Mail')}
                                            value={newUser.email}
                                            name='email'
                                            size='small'
                                            onChange={e => handleNewUser(e.target.value, 'email')}
                                            limit={LIMITS.input_email}
                                            dark
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                        <PasswordInput
                                            label={tSignin('Password')}
                                            showModalGuide={showModalPassword}
                                            hasModal
                                            setShowModalGuide={setShowModalPassword}
                                            onChange={e => handleNewUser(e.target.value, 'password')}
                                            mobile={mobile}
                                            value={newUser.password}
                                            dark
                                        />
                                        <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                            onChange={handleReCaptchaSuccess}
                                            onExpired={handleReCaptchaError}
                                            onErrored={handleReCaptchaError}
                                            hl={i18n.language}
                                        />
                                    </div>
                                </div>
                                <div className={styles.loginBodyBottom}>
                                    <LoadingButton
                                        loading={disableSigninButton}
                                        variant='contained'
                                        onClick={() => handleCreateNewUser(newUser)}
                                        sx={{
                                            width: '100%',
                                            height: '50px',
                                            color: '#ffffff',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {tSignin('create_an_account')}
                                    </LoadingButton>
                                    <Link
                                        href='/login'
                                        className={styles.linkCreateAccount}
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <Button
                                            sx={{
                                                width: '100%',
                                                height: '35px',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {tSignin('already_have_account')}
                                        </Button>
                                    </Link>
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
                                <h3>
                                    {tSignin('planning_to_buy')}
                                </h3>
                                <p>
                                    {tSignin('join_community', { store_name: process.env.NEXT_PUBLIC_STORE_NAME })}
                                </p>
                            </div>
                            <div
                                className={styles.joinBody}
                            >
                                <PiHandshakeLight
                                    size='45px'
                                />
                                <h4>
                                    {tSignin('join_as_customer')}
                                </h4>
                                <ul>
                                    <li>{tSignin('save_your_wishlist')}</li>
                                    <li>{tSignin('save_your_order')}</li>
                                    <li>{tSignin('be_the_first')}</li>
                                </ul>
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