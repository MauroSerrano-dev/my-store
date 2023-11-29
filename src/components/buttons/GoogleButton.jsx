import styles from '@/styles/components/buttons/GoogleButton.module.css'
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth"
import { showToast } from '@/utils/toasts'
import { FcGoogle } from 'react-icons/fc'
import { useTranslation } from 'next-i18next'
import { useAppContext } from '../contexts/AppContext'

const provider = new GoogleAuthProvider()

export default function GoogleButton(props) {
    const {
        text = 'Login with Google'
    } = props

    const {
        auth,
        router,
        setShowLoadingScreen,
    } = useAppContext()

    const tToasts = useTranslation('toasts').t

    function googleLogin() {
        signInWithPopup(auth, provider)
            .then(response => {
                setShowLoadingScreen(true)
                showToast({ type: 'success', msg: tToasts('success_login', { user_name: response.user.displayName }) })
                router.push('/')
            })
            .catch(error => {
                if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request')
                    showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    return (
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
            {text}
        </button>
    )
}