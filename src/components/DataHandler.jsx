import { useSession, signIn, signOut } from "next-auth/react"
import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';

export default function DataHandler(props) {
    const { Component, pageProps, primaryColor } = props
    const { data: session } = useSession()
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)
    const [showNavBar, setShowNavBar] = useState(true)
    const [cart, setCart] = useState([])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }

        window.addEventListener('resize', handleResize)

        // Inicialize os valores iniciais ao carregar a página
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (session) {
            setCart(session.user.cart)
        }
        else if (session === null && Cookies.get('cart')) {
            setCart(JSON.parse(Cookies.get('cart')))
        }
        if (session && Cookies.get('cart')) {
            const cookieCart = JSON.parse(Cookies.get('cart'))
            const newCart = session.user.cart
                .map(userProduct =>
                ({
                    ...userProduct,
                    quantity: cookieCart.some(cookieProduct => cookieProduct.id === userProduct.id && cookieProduct.variant === userProduct.variant)
                        ? userProduct.quantity + cookieCart.filter(cookieProduct => cookieProduct.id === userProduct.id && cookieProduct.variant === userProduct.variant)[0].quantity
                        : userProduct.quantity
                }))
                .concat(cookieCart.filter(cookieProduct =>
                    session.user.cart.every(userProduct => cookieProduct.id !== userProduct.id || cookieProduct.variant !== userProduct.variant))
                )
            setCart(newCart)
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    cart: newCart
                })
            }
            fetch("/api/cart", options)
                .catch(err => console.error(err))
            Cookies.remove('cart')
        }
    }, [session])


    return (
        <div
            style={{
                width: `${windowWidth}px`,
                height: `${windowHeight}px`,
            }}
        >
            {showNavBar &&
                <NavBar
                    session={session}
                    signIn={signIn}
                    signOut={signOut}
                    cart={cart}
                />
            }
            <div onClick={() => console.log(session)} id={styles.componentContainer}>
                <
                    Component{...pageProps}
                    setShowNavBar={setShowNavBar}
                    session={session}
                    signIn={signIn}
                    cart={cart}
                    setCart={setCart}
                />
            </div>
        </div >
    )
}