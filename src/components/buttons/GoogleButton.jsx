import styles from '@/styles/components/buttons/GoogleButton.module.css'
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth"
import { showToast } from '../../../utils/toasts'
import { FcGoogle } from 'react-icons/fc'

const provider = new GoogleAuthProvider()

export default function GoogleButton(props) {
    const {
        auth,
        router,
        text = 'Login with Google'
    } = props

    function googleLogin() {
        signInWithPopup(auth, provider)
            .then(result => {
                showToast({ msg: tToasts('success_login'), type: 'success' })
                router.push('/')
            })
            .catch(error => {
                showToast({ msg: tToasts('default_error'), type: 'error' })
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