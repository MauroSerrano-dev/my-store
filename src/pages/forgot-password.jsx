import styles from '@/styles/pages/forgot-password.module.css'
import { TextField } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Button } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import TextInput from '@/components/material-ui/TextInput'
import { useAppContext } from '@/components/contexts/AppContext'

export default function ForgotPassword() {
    const {
        auth,
    } = useAppContext()

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)

    function handleReCaptchaSuccess(userToken) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                response: userToken,
                expectedAction: 'password_reset',
            }),
        }

        fetch("/api/google-re-captcha", options)
            .then(response => response.json())
            .then(response => {
                if (response.tokenProperties.valid)
                    setReCaptchaSolve(true)
                else
                    tToasts({ type: 'error', msg: 'Error trying to solve recaptcha' })
            })
            .catch(() => tToasts({ type: 'error', msg: 'Error with google recaptcha' }))
    }

    function handleReCaptchaError() {
        setReCaptchaSolve(false)
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
                            <TextInput
                                label='E-Mail'
                                size='small'
                                name='email'
                                style={{
                                    width: '93.5%',
                                }}
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
                                fontWeight: '700',
                            }}
                        >
                            Reset Password
                        </Button>
                    </form>
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
                    <img
                        src='/reset_pass.webp'
                        className={styles.imgRight}
                    />
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