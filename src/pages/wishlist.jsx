import Footer from '@/components/Footer'
import Product from '@/components/products/Product'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/pages/wishlist.module.css'
import { useTranslation } from 'next-i18next';

export default function Wishlist({
    session,
    setSession,
    supportsHoverAndPointer,
    userCurrency,
    windowWidth
}) {

    const [wishlist, setWishlist] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const productsContainer = useRef(null)

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

        if (windowWidth) {
            handleResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [windowWidth])

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

    return (
        <div className='fillWidth'>
            <h1>{tWishlist('wishlist_title')}</h1>
            <div
                className={styles.products}
                ref={productsContainer}
            >
                {!wishlist
                    ? Array(20).fill(null).map((ske, i) =>
                        <ProductSkeleton
                            key={i}
                            productWidth={productWidth}
                            supportsHoverAndPointer={supportsHoverAndPointer}
                        />
                    )
                    : wishlist?.products.length === 0
                        ? <div className='flex column center fillWidth'>
                            <div
                                ref={animationContainer}
                                className={styles.animationContainer}
                            >
                            </div>
                            <h2>No Products Found</h2>
                        </div>
                        : wishlist?.products.map((product, i) =>
                            <Product
                                key={i}
                                product={product}
                                userCurrency={userCurrency}
                                supportsHoverAndPointer={supportsHoverAndPointer}
                                session={session}
                                setSession={setSession}
                                width={productWidth}
                            />
                        )
                }
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'wishlist', 'footer']))
        }
    }
}