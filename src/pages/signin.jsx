import styles from '@/styles/signin.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { PiHandshakeLight } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from 'react';
import { STORE_NAME } from '../../consts';

export default function Signin(props) {
    const { signIn, login, mobile } = props

    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [newUser, setNewUser] = useState({})

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
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: user })
        }

        fetch('/api/user', options)
            .then(response => response.json())
            .then(response => {
                login(user.email, user.password)
            })
            .catch(err => console.error(err))
    }

    return (
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
                                size='small'
                                onChange={(e) => handleNewUser(e.target.value, 'first_name')}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <TextField
                                variant='outlined'
                                label='Last Name (optional)'
                                size='small'
                                onChange={(e) => handleNewUser(e.target.value, 'last_name')}
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
                                onChange={(e) => handleNewUser(e.target.value, 'email')}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <TextField
                                variant='outlined'
                                label='Password'
                                type='password'
                                size='small'
                                onChange={(e) => handleNewUser(e.target.value, 'password')}
                                sx={{
                                    width: '100%'
                                }}
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
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                }}
                            >
                                Create an account
                            </Button>
                            <Link legacyBehavior href={'/login'}>
                                <a
                                    className={styles.linkCreateAccount}
                                >
                                    I already have an account
                                </a>
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
                            Join {STORE_NAME} community!
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
