import styles from '@/styles/pages/signin.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from 'react';
import { showToast } from '../../utils/toasts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isStrongPassword } from '../../utils/validations';
import { useTranslation } from 'next-i18next';
import PasswordInput from '@/components/material-ui/PasswordInput';

export default function Signin(props) {
    const {
        login,
        mobile,
        session,
        router,
        setLoading,
    } = props

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [newUser, setNewUser] = useState({})

    useEffect(() => {
        if (session)
            router.push('/profile')
    }, [session])

    const tToasts = useTranslation('toasts').t

    function handleReCaptchaSuccess() {
        setReCaptchaSolve(true)
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
                return
            }
            setLoading(true)
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
                    if (response.status === 201) {
                        showToast({ msg: tToasts(response.message), type: 'success' })
                        login(user.email, user.password, true)
                    }
                    else {
                        setLoading(false)
                        showToast({ msg: tToasts(response.message) })
                    }
                })
                .catch(() => setLoading(false))
        }
        else {
            showToast({ msg: 'Please solve the reCAPTCHA.' })
        }
    }

    return (
        session === null &&
        <div className={styles.container}>
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
                        <h1>Create an account</h1>
                    </div>
                    <div
                        className={styles.loginBody}
                        style={{
                            paddingLeft: mobile ? '4.5vw' : '10vw',
                            paddingRight: mobile ? '4.5vw' : '10vw'
                        }}
                    >
                        <div className={styles.fieldsContainer}>
                            <TextField
                                variant='outlined'
                                label='First Name'
                                autoComplete='off'
                                size='small'
                                onChange={e => handleNewUser(e.target.value, 'first_name')}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <TextField
                                variant='outlined'
                                label='Last Name (optional)'
                                autoComplete='off'
                                size='small'
                                onChange={e => handleNewUser(e.target.value, 'last_name')}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <TextField
                                variant='outlined'
                                label='E-Mail'
                                size='small'
                                name='email'
                                autoComplete='off'
                                onChange={e => handleNewUser(e.target.value, 'email')}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <PasswordInput
                                onChange={e => handleNewUser(e.target.value, 'password')}
                            />
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                onChange={handleReCaptchaSuccess}
                                onExpired={handleReCaptchaError}
                                onErrored={handleReCaptchaError}
                            />
                        </div>
                        <div className={styles.loginButtons}>
                            <Button
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
                                Create an account
                            </Button>
                            <Link
                                href='/login'
                                className={styles.linkCreateAccount}
                            >
                                I already have an account
                            </Link>
                        </div>
                    </div>
                </div>
                <div
                    className={styles.joinContainer}
                    style={{
                        width: mobile ? '100%' : '34.55%',
                        height: mobile ? 'auto' : '600px'
                    }}
                >
                    <div
                        className={styles.joinHead}
                    >
                        <h3>
                            Are you planning to buy?
                        </h3>
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
                        <h4>
                            Join as a Customer
                        </h4>
                        <ul>
                            <li>Save your wishlist picks.</li>
                            <li>Save your order data for next purchases.</li>
                            <li>Be the first one to know about our discounts.</li>
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
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'toasts']))
        }
    }
}