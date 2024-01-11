import Link from 'next/link';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from '@/styles/components/NoFound404.module.css'
import { useAppContext } from './contexts/AppContext';
import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next';

export default function NoFound404(props) {
    const {
        message = 'Page not found!',
        autoRedirect = true
    } = props

    const {
        router,
        loading,
        showLoadingScreen
    } = useAppContext()

    const animationContainer = useRef(null)

    const tPageError = useTranslation('page-error').t

    useEffect(() => {
        let time
        if (autoRedirect && !showLoadingScreen) {
            time = setTimeout(() => {
                router.push('/')
            }, 3000)
        }

        return () => {
            if (autoRedirect && !showLoadingScreen)
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
        showLoadingScreen
            ? <div
                style={{
                    position: 'fixed',
                    zIndex: 9999,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                }}>
                <motion.div
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                duration: 0,
                                delay: 0.2,
                            }
                        }
                    }}
                    initial='hidden'
                    animate='visible'
                    style={{
                        zIndex: 10000,
                    }}
                >
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            position: 'absolute',
                            color: '#525252',
                            left: 'calc(50% - 60px)',
                            top: '35%',
                        }}
                        size={120}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        disableShrink
                        size={120}
                        thickness={4}
                        sx={{
                            position: 'absolute',
                            left: 'calc(50% - 60px)',
                            top: '35%',
                            animationDuration: '750ms',
                        }}
                    />
                </motion.div>
            </div>
            : <div
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
                        {tPageError(message)}
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