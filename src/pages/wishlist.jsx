import Footer from '@/components/Footer'
import Product from '@/components/products/Product'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'

export default function Wishlist({ session, supportsHoverAndPointer, userCurrency }) {

    const [wishlist, setWishlist] = useState()

    useEffect(() => {
        if (session)
            getWishlist()
    }, [session])

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
            {wishlist?.products.map((product, i) =>
                <Product
                    key={i}
                    product={product}
                    userCurrency={userCurrency}
                    supportsHoverAndPointer={supportsHoverAndPointer}
                />
            )}
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'footer']))
        }
    }
}