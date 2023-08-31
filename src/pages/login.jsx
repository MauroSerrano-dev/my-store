import styles from '@/styles/login.module.css'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { PiHandshakeLight } from "react-icons/pi";

export default function Login(props) {
    const { signIn } = props

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
                                className={styles.googleLogin}
                                onClick={() => signIn('google')}
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
