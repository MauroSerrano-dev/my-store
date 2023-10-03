import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

export default function NoFound404(props) {

    const {
        windowWidth,
        supportsHoverAndPointer
    } = props

    const mobile = windowWidth < 630

    const animationContainer = useRef(null);

    const [hoverLink, setHoverLink] = useState(false)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg', // or 'canvas' or 'html'
            loop: true,
            autoplay: true,
            animationData: require('../../utils/animations/animation404.json'),
        });

        return () => {
            animation.destroy();
        };
    }, []);

    function handleHover() {
        console.log('eita porra', supportsHoverAndPointer, windowWidth)
        if (supportsHoverAndPointer)
            setHoverLink(true)
    }

    function handleRemoveHover() {
        setHoverLink(false)
    }

    return (
        <div
            className='flex column align-center fillWidth'
            style={{
                '--text-color': 'var(--text-white)',
            }}
        >
            <div
                ref={animationContainer}
                style={{
                    width: mobile ? '93%' : 600,
                    marginTop: '-40px',
                    marginBottom: mobile ? '-17.5vw' : '-110px',
                    transition: 'width ease-in-out 200ms'
                }}
            >
            </div>
            <div style={{ zIndex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: '24px' }}>Page not found!</p>
                <Link
                    href="/"
                    onMouseEnter={handleHover}
                    onMouseOut={handleRemoveHover}
                    style={{
                        fontWeight: 'bold',
                        color: hoverLink ? '#999999' : 'var(--link-color)',
                        transition: 'all ease-in-out 150ms',
                    }}
                >
                    Back to homepage
                </Link>
            </div>
        </div>
    );
}