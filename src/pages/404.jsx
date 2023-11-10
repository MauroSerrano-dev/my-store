import Link from 'next/link';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from '@/styles/pages/404.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function NoFound404(props) {

    const {
        message = 'Page not found!'
    } = props

    const animationContainer = useRef(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../utils/animations/animation404.json'),
        })

        return () => {
            animation.destroy();
        }
    }, [])

    return (
        <div
            className='flex column align-center fillWidth'
            style={{
                '--text-color': 'var(--text-white)',
            }}
        >
            <div
                ref={animationContainer}
                className={styles.animationContainer}
            >
            </div>
            <div style={{ zIndex: 1 }}>
                <p style={{ fontWeight: '700', fontSize: '24px' }}>
                    {message}
                </p>
                <Link
                    href="/"
                    className={styles.link}
                >
                    Back to homepage
                </Link>
            </div>
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu']))
        }
    }
}