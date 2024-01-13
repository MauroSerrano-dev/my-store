import styles from '@/styles/pages/signin.module.css'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi"
import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from 'react'
import { showToast } from '@/utils/toasts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { handleReCaptchaError, handleReCaptchaSuccess, isStrongPassword } from '@/utils/validations'
import { useTranslation } from 'next-i18next'
import PasswordInput from '@/components/material-ui/PasswordInput'
import GoogleButton from '@/components/buttons/GoogleButton'
import { COMMON_TRANSLATES, LIMITS } from '@/consts'
import TextInput from '@/components/material-ui/TextInput'
import { LoadingButton } from '@mui/lab'
import { useAppContext } from '@/components/contexts/AppContext'
import NoFound404 from '@/components/NoFound404'
import MyButton from '@/components/material-ui/MyButton'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'

export default function Signin() {
    const {
        login,
        mobile,
        router,
        session,
        loading,
        setLoading,
        authValidated,
        auth,
        isUser,
        setBlockInteractions,
        handleCreateNewUser,
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
    const tCommon = useTranslation('common').t

    function handleNewUser(value, field) {
        setNewUser(prev => (
            {
                ...prev,
                [field]: value
            }
        ))
    }

    async function handleCreateNewUserCall() {
        if (!reCaptchaSolve)
            return showToast({ msg: tToasts('solve_recaptcha') })

        if (newUser.first_name === '')
            return showToast({ msg: tToasts('missing_first_name') })
        if (newUser.email === '')
            return showToast({ msg: tToasts('missing_email') })
        if (newUser.password === '')
            return showToast({ msg: tToasts('missing_password') })

        const passValidation = isStrongPassword(newUser.password)
        if (passValidation !== true) {
            showToast({ msg: tToasts(passValidation) })
            setShowModalPassword(true)
            return
        }
        setBlockInteractions(true)
        setLoading(true)
        setDisableSigninButton(true)
        try {
            const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)

            // Set display name for the authenticated user
            await updateProfile(authenticatedUser, {
                displayName: `${newUser.first_name} ${newUser.last_name}`
            })

            await handleCreateNewUser({ ...authenticatedUser, displayName: `${newUser.first_name} ${newUser.last_name}` })

            // Envie o e-mail de verificação
            auth.languageCode = i18n.language
            sendEmailVerification(authenticatedUser, {
                url: `${process.env.NEXT_PUBLIC_URL}/${i18n.language}/auth`,
                handleCodeInApp: true,
            })
                .then(() => {
                    console.log(`Verification email sent to ${newUser.email}`)
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error)
                })

            login(newUser.email, newUser.password)
        }
        catch (error) {
            console.error(error)
            if (error.code === 'auth/invalid-email')
                showToast({ msg: tToasts('invalid_email') })
            else if (error.code === 'auth/email-already-in-use')
                showToast({ msg: tToasts('email_already_exists') })
            else if (error.code === 'auth/weak-password')
                showToast({ msg: tToasts('weak_password') })
            else if (error.code === 'auth/account-exists-with-different-credential')
                showToast({ msg: tToasts('account_exists_with_different_credential') })
            else
                showToast({ type: error?.type || 'error', msg: tToasts('error_creating_user') })
            setBlockInteractions(false)
            setLoading(false)
            setDisableSigninButton(false)
        }
    }

    return (
        !authValidated
            ? <div></div>
            : session
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
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
                                            label={tCommon('e-mail')}
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
                                            onChange={userToken => handleReCaptchaSuccess(userToken, setReCaptchaSolve)}
                                            onExpired={() => handleReCaptchaError(setReCaptchaSolve)}
                                            onErrored={() => handleReCaptchaError(setReCaptchaSolve)}
                                            hl={i18n.language}
                                            className='reCaptcha'
                                        />
                                    </div>
                                </div>
                                <div className={styles.loginBodyBottom}>
                                    <LoadingButton
                                        loading={disableSigninButton}
                                        variant='contained'
                                        onClick={handleCreateNewUserCall}
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
                                        <MyButton
                                            variant='text'
                                            style={{
                                                width: '100%',
                                                height: '35px',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {tSignin('already_have_account')}
                                        </MyButton>
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
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['login-signin'])))
        }
    }
}