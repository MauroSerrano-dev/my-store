import styles from '@/styles/forgot-password.module.css'
import { TextField } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi";
import { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@mui/material'

export default function ForgotPassword(props) {
    const { session, login, auth } = props
    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState(false);

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

    useEffect(() => {
        setSupportsHoverAndPointer(
            window.matchMedia('(hover: hover)').matches &&
            window.matchMedia('(pointer: fine)').matches
        )
    }, [])

    return (
        <div className={styles.container}>
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
                                    width: '96%',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: `${focus
                                            ? 'var(--primary)' :
                                            hover || !supportsHoverAndPointer
                                                ? '#ffffff'
                                                : '#ffffff90'
                                            } !important`,
                                        transition: 'all ease-in-out 200ms',
                                    },
                                    '.MuiInputLabel-outlined': {
                                        color: `${focus
                                            ? 'var(--primary)' : '#ffffff'} !important`,
                                        transition: 'all ease-in-out 200ms',
                                    },
                                    '.MuiInputBase-input': {
                                        color: '#ffffff',
                                    },
                                }}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            />
                        </div>
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{
                                width: '25%',
                                minWidth: '190px',
                                height: '45px',
                                color: '#ffffff',
                                fontWeight: 'bold',
                            }}
                        >
                            Reset Password
                        </Button>
                    </form>
                    <Link legacyBehavior href={'/login'}>
                        <a
                            className={styles.linkBackToLogin}
                        >
                            Back to Login
                        </a>
                    </Link>
                </div>
                <div
                    className={styles.right}
                >
                    <img
                        src='/reset_pass.webp'
                        className={styles.imgRight}
                    />
                </div>
            </main >
            <footer>
            </footer>
        </div >
    )
}