import Link from 'next/link';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from '@/styles/components/NoFound404.module.css'

export default function NoFound404(props) {
    const {
        message = 'Page not found!',
        router,
        loading,
        autoRedirect
    } = props

    const animationContainer = useRef(null)

    useEffect(() => {
        let time
        if (autoRedirect) {
            time = setTimeout(() => {
                router.push('/')
            }, 3000)
        }

        return () => {
            if (autoRedirect)
                clearTimeout(time)
        }
    }, [loading])

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('@/utils/animations/animation404.json'),
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