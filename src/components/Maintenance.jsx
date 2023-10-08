import Link from 'next/link';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from '@/styles/components/Maintenance.module.css'

export default function Maintenance() {

    const animationContainer = useRef(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg', // or 'canvas' or 'html'
            loop: true,
            autoplay: true,
            animationData: require('../../utils/animations/animationMaintenance.json'),
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
                <p style={{ fontWeight: 'bold', fontSize: '28px' }}>
                    {process.env.NEXT_PUBLIC_STORE_NAME} is under maintenance.
                </p>
                <p style={{ fontSize: '18px' }}>
                    Please come back later.
                </p>
            </div>
            <p style={{ position: 'fixed', bottom: 30 }}>
                If you need support, contact us in <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className={styles.link}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>
            </p>
        </div>
    )
}