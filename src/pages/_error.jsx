import Link from 'next/link';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from '@/styles/_error.module.css'

function Error({ statusCode }) {

    const animationContainer = useRef(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg', // or 'canvas' or 'html'
            loop: true,
            autoplay: true,
            animationData: require('../../utils/animations/animationError.json'),
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
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'An error occurred on the website'
                    }
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

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error