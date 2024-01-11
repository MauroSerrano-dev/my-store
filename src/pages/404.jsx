import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import NoFound404 from '@/components/NoFound404'
import { useAppContext } from '@/components/contexts/AppContext'

export default function Error404() {

    const {
        router,
        loading,
    } = useAppContext()

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
        <NoFound404 autoRedirect={false} />
    )
}