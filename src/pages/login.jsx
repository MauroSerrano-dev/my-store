import styles from '@/styles/login.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { PiHandshakeLight } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Router from 'next/router';
import { STORE_NAME } from '../../labels';

const provider = new GoogleAuthProvider();

export default function Login(props) {
    const { session, login, auth } = props

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)

    function handleReCaptchaSuccess() {
        setReCaptchaSolve(true)
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
    }

    function googleLogin() {
        signInWithPopup(auth, provider)
            .then(result => Router.push('/'))
            .catch(error => console.error(error))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const email = event.target.email.value
        const password = event.target.password.value

        login(email, password)
    }

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div
                    className={styles.loginContainer}
                >
                    <div
                        className={styles.loginHead}
                    >
                        <h1>Login</h1>
                    </div>
                    <div
                        className={styles.loginBody}
                    >
                        <form
                            onSubmit={handleSubmit}
                            method='POST'
                            className={styles.form}
                        >
                            <div className={styles.fieldsContainer}>
                                <TextField
                                    variant='outlined'
                                    label='E-Mail'
                                    size='small'
                                    name='email'
                                    autoComplete='off'
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                                <TextField
                                    variant='outlined'
                                    label='Password'
                                    type='password'
                                    name='password'
                                    size='small'
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                                <Link legacyBehavior href={'/forgot-password'}>
                                    <a
                                        className={styles.linkCreateAccount}
                                    >
                                        Forgot my password
                                    </a>
                                </Link>
                                <div className='fillWidth center'>
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                        onChange={handleReCaptchaSuccess}
                                        onExpired={handleReCaptchaError}
                                        onErrored={handleReCaptchaError}
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.loginButton}
                            >
                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{
                                        width: '100%',
                                        height: '50px',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                    }}
                                >
                                    Login
                                </Button>
                            </div>
                        </form>
                        <button
                            className={styles.providerLogin}
                            onClick={googleLogin}
                        >
                            <FcGoogle
                                size='30px'
                                style={{
                                    position: 'absolute',
                                    left: '1.5rem'
                                }}
                            />
                            Login with Google
                        </button>
                    </div>
                </div>
                <div
                    className={styles.joinContainer}
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
                            Join {STORE_NAME} community!
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
                        <Link legacyBehavior href={'/signin'}>
                            <a
                                className={styles.linkCreateAccount}
                            >
                                Create a Customer Account
                            </a>
                        </Link>
                    </div>
                </div>
            </main >
            <footer>
            </footer>
        </div >
    )
}
