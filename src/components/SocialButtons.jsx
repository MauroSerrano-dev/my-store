import styles from '@/styles/components/SocialButtons.module.css'
import Link from 'next/link';
import { FaInstagram, FaFacebookSquare } from 'react-icons/fa';

export default function SocialButtons() {

    return (
        <div
            className={styles.container}
        >
            <Link
                className={styles.option}
                href='https://www.instagram.com'
                target='_blank'
            >
                <FaInstagram
                    size={23}
                    className={styles.icon}
                />
            </Link>
            <Link
                className={styles.option}
                href='https://www.facebook.com'
                target='_blank'
            >
                <FaFacebookSquare
                    size={23}
                    className={styles.icon}
                />
            </Link>
        </div>
    )
}