import Footer from '@/components/Footer'
import Product from '@/components/products/Product'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/pages/wishlist.module.css'
import { useTranslation } from 'next-i18next';
import lottie from 'lottie-web';
import { COMMON_TRANSLATES, LIMITS } from '@/consts'
import NoFound404 from '@/components/NoFound404'
import { useAppContext } from '@/components/contexts/AppContext'

export default function Wishlist() {
    const {
        session,
        setLoading,
        setSession,
        windowWidth,
    } = useAppContext()

    const [wishlist, setWishlist] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const productsContainer = useRef(null)
    const animationContainer = useRef(null)

    const tWishlist = useTranslation('wishlist').t

    useEffect(() => {
        if (session)
            getWishlist()
    }, [session])

    useEffect(() => {
        function handleResize() {
            const containerWidth = productsContainer.current.offsetWidth
            if (containerWidth > 900)
                setProductWidth((containerWidth - 16 * 5) / 5)
            else if (containerWidth > 700)
                setProductWidth((containerWidth - 16 * 4) / 4)
            else if (containerWidth > 500)
                setProductWidth((containerWidth - 16 * 3) / 3)
            else
                setProductWidth((containerWidth - 16 * 2) / 2)
        }

        if (windowWidth && session !== undefined) {
            handleResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [windowWidth, session])

    function getWishlist() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                wishlist_id: session.wishlist_id,
            },
        }

        fetch("/api/wishlists/wishlist", options)
            .then(response => response.json())
            .then(response => setWishlist(response))
            .catch(err => console.error(err))
    }

    function handleDeleteClick(event, product_id) {
        event.preventDefault()

        setLoading(true)

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                wishlist_id: session.wishlist_id,
                product: { id: product_id }
            }),
        }

        fetch("/api/wishlists/wishlist-products", options)
            .then(response => response.json())
            .then(response => {
                setSession(prev => ({ ...prev, wishlist_products_ids: response.wishlist.products.map(prod => prod.id) }))
                setWishlist(response.wishlist)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.error(err)
            })
    }

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('@/utils/animations/animationNoOrders.json'),
        })

        return () => {
            animation.destroy()
        }
    }, [wishlist])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <div
                        className={styles.pageContainer}
                        style={{
                            minHeight: wishlist ? '0' : '100vh'
                        }}
                    >
                        <div className={styles.titleContainer}>
                            <h1>
                                {tWishlist('wishlist_title')}
                            </h1>
                            {wishlist &&
                                <p>
                                    {wishlist.products.length}/{LIMITS.wishlist_products}
                                </p>
                            }
                        </div>
                        <div
                            className={styles.products}
                            ref={productsContainer}
                        >
                            {!wishlist
                                ? Array(20).fill(null).map((ske, i) =>
                                    <ProductSkeleton
                                        key={i}
                                        productWidth={productWidth}
                                    />
                                )
                                : wishlist?.products.length === 0
                                    ? <div className='flex column center fillWidth'>
                                        <div
                                            ref={animationContainer}
                                            style={{
                                                width: '100%',
                                                height: 400,
                                            }}
                                        >
                                        </div>
                                        <h2>{tWishlist('wishlist_empty')}</h2>
                                    </div>
                                    : wishlist?.products.map(product =>
                                        <Product
                                            key={product.id}
                                            product={product}
                                            width={productWidth}
                                            hideWishlistButton
                                            showDeleteButton
                                            onDeleteClick={event => handleDeleteClick(event, product.id)}
                                        />
                                    )
                            }
                        </div>
                    </div>
                    <Footer />
                </div >
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['wishlist', 'footer'])))
        }
    }
}