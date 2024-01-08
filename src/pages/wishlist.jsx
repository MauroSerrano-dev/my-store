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
import { getProductsByIds } from '../../backend/product'
import { showToast } from '@/utils/toasts'

export default function Wishlist() {
    const {
        session,
        windowWidth,
        wishlist
    } = useAppContext()

    const [wishlistProducts, setWishlistProducts] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const productsContainer = useRef(null)
    const animationContainer = useRef(null)

    const tWishlist = useTranslation('wishlist').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        if (wishlist)
            getWishlist()
    }, [wishlist])

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

    async function getWishlist() {
        try {
            const prods = await getProductsByIds(wishlist.products.map(p => p.id))
            setWishlistProducts({ ...wishlist, products: prods })
        }
        catch (error) {
            showToast({ type: error?.props?.type || 'error', msg: tToasts(error?.props?.title || 'default_error') })
        }
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
    }, [wishlistProducts])

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <div
                        className={styles.pageContainer}
                        style={{
                            minHeight: wishlistProducts ? '0' : '100vh'
                        }}
                    >
                        <div className={styles.titleContainer}>
                            <h1>
                                {tWishlist('wishlist_title')}
                            </h1>
                            {wishlistProducts &&
                                <p>
                                    {wishlistProducts.products.length}/{LIMITS.wishlist_products}
                                </p>
                            }
                        </div>
                        <div
                            className={styles.products}
                            ref={productsContainer}
                        >
                            {!wishlistProducts
                                ? Array(20).fill(null).map((ske, i) =>
                                    <ProductSkeleton
                                        key={i}
                                        productWidth={productWidth}
                                    />
                                )
                                : wishlistProducts?.products.length === 0
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
                                    : wishlistProducts?.products.map(product =>
                                        <Product
                                            key={product.id}
                                            product={product}
                                            width={productWidth}
                                            hideWishlistButton
                                            showDeleteButton
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