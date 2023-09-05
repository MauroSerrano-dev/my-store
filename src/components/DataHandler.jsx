import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState, useRef } from "react"
import Cookies from 'js-cookie';
import Router from 'next/router';

export default function DataHandler(props) {
    const { Component, pageProps, primaryColor } = props
    const [cart, setCart] = useState([])
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [session, setSession] = useState()

    async function getSession(token) {
        const options = {
            method: 'GET',
            headers: {
                session_token: token
            }
        }

        const res = await fetch("/api/sessions", options)
            .then(response => response.json())
            .then(response => response)
            .catch(err => console.error(err))

        return res.session
    }

    function login() {
        const sessionToken = Cookies.get('sessionToken')

        getSession(sessionToken)
            .then(res => {
                setSession(res)
                Router.push('/')
            })
            .catch(err => console.error(err))
    }

    function logout() {
        setSession(null)
        Cookies.remove('sessionToken')
        setCart([])
        Router.push('/')
    }

    useEffect(() => {
        const sessionToken = Cookies.get('sessionToken')
        if (sessionToken)
            login()
        else
            logout()

        let timeoutId

        const handleScroll = () => {
            // Check if the scroll position is at the top (you can adjust the threshold if needed)
            const isAtTop = window.scrollY === 0

            clearTimeout(timeoutId);

            // Update the state based on the scroll position
            timeoutId = setTimeout(() => {
                setIsScrollAtTop(isAtTop)
            }, 150)

        }

        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll)

        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll)
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
        <div onClick={() => console.log(session)}>
            <div
                className={styles.topContainer}
            >
                <NavBar
                    cart={cart}
                    setCart={setCart}
                    isScrollAtTop={isScrollAtTop}
                    setIsScrollAtTop={setIsScrollAtTop}
                    session={session}
                    login={login}
                    logout={logout}
                />
                <div
                    className={styles.categoriesContainer}
                    style={{
                        transform: isScrollAtTop
                            ? 'translateY(0)'
                            : 'translateY(-100%)'
                    }}
                >
                </div>
            </div>
            <div
                className={styles.componentContainer}
            >
                <
                    Component{...pageProps}
                    cart={cart}
                    setCart={setCart}
                    session={session}
                    login={login}
                    logout={logout}
                />
            </div>
        </div>
    )
}