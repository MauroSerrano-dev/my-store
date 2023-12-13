import styles from '@/styles/components/SocialButtons.module.css'
import Link from 'next/link'
import { FaInstagram, FaFacebookSquare } from 'react-icons/fa'

export default function SocialButtons(props) {
    const {
        size = 35
    } = props

    return (
        <div
            className={styles.container}
        >
            <Link
                className={styles.option}
                href={process.env.NEXT_PUBLIC_STORE_INSTAGRAM}
                target='_blank'
                style={{
                    height: size,
                    width: size
                }}
            >
                <FaInstagram
                    size={size * 0.6}
                    className={styles.icon}
                />
            </Link>
            <Link
                className={styles.option}
                href='https://www.facebook.com/people/MRF-Styles/61554266713724'
                target='_blank'
                style={{
                    height: size,
                    width: size
                }}
            >
                <FaFacebookSquare
                    size={size * 0.6}
                    className={styles.icon}
                />
            </Link>
        </div>
    )
}