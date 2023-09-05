import styles from '@/styles/login.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { PiHandshakeLight } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from '../../firebase.config';
import { initializeApp } from 'firebase/app';

const provider = new GoogleAuthProvider();

export default function Login(props) {

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)

    function handleReCaptchaSuccess() {
        setReCaptchaSolve(true)
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
    }

    function googleLogin() {
        // Inicialize o Firebase
        const firebaseApp = initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
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
                        <div className={styles.fieldsContainer}>
                            <TextField
                                variant='outlined'
                                label='E-Mail'
                                size='small'
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <TextField
                                variant='outlined'
                                label='Password'
                                size='small'
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <Link legacyBehavior href={'/'}>
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
                        <div className={styles.loginButtons}>
                            <Button
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
                </div>
                <div
                    className={styles.joinContainer}
                >
                    <div
                        className={styles.joinHead}
                    >
                        <h3>
                            Don’t have an account?
                        </h3>
                        <p>
                            Join MKJ community!
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
                        <Link legacyBehavior href={'/signin'}>
                            <a
                                className={styles.linkCreateAccount}
                            >
                                Create a Customer Account
                            </a>
                        </Link>
                    </div>
                </div>
            </main>
            <footer>
            </footer>
        </div >
    )
}
