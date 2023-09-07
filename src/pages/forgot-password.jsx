import styles from '@/styles/forgot-password.module.css'
import { TextField } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi";
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Importar a função necessária

export default function ForgotPassword(props) {
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
            .then(result => console.log(result))
            .catch(error => console.error(error))
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const email = event.target.email.value;

        try {
            // Enviar um e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, email);

            console.log('E-mail de redefinição de senha enviado com sucesso para:', email);
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        }
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
                        <h1>Don’t remember your password?</h1>
                        <h2>Don’t worry! it happens :)</h2>
                    </div>
                    <p>
                        Type in your e-mail and we will send you a link to change your password.
                    </p>
                    <div
                        className={styles.loginBody}
                    >
                        <form onSubmit={handleSubmit} method='POST'>
                            <div className={styles.fieldsContainer}>
                                <TextField
                                    variant='outlined'
                                    label='E-Mail'
                                    size='small'
                                    name='email'
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <button
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
                                Reset Password
                            </button>
                        </form>
                        <Link legacyBehavior href={'/login'}>
                            <a
                                className={styles.linkCreateAccount}
                            >
                                Back to Login
                            </a>
                        </Link>
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
                    </div>
                </div>
            </main >
            <footer>
            </footer>
        </div >
    )
}