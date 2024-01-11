import Link from 'next/link'
import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import styles from '@/styles/pages/_error.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppContext } from '@/components/contexts/AppContext'
import { COMMON_TRANSLATES } from '@/consts'
import { useTranslation } from 'next-i18next';

function Error() {
    const {
        router,
        loading,
    } = useAppContext()

    const tPageError = useTranslation('page-error').t

    const animationContainer = useRef(null)

    useEffect(() => {
        let time
        time = setTimeout(() => {
            router.push('/')
        }, 3000)

        return () => {
            clearTimeout(time)
        }
    }, [loading])

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg', // or 'canvas' or 'html'
            loop: true,
            autoplay: true,
            animationData: require('@/utils/animations/animationError.json'),
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
                <p className={styles.errorMsg}>
                    {tPageError('An error occurred on the website')}
                </p>
                <Link
                    href="/"
                    className={styles.link}
                >
                    {tPageError('Back to homepage')}
                </Link>
            </div>
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES)),
        }
    }
}

export default Error