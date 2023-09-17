import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase.config';
import { CART_COOKIE, convertDolarToCurrency } from '../../consts';
import Router from 'next/router';

export default function DataHandler(props) {
    const { Component, pageProps, primaryColor } = props
    const [cart, setCart] = useState([])
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [session, setSession] = useState()
    const [showIntroduction, setShowIntroduction] = useState(false)
    const [userCurrency, setUserCurrency] = useState({ code: 'usd', symbol: '$' })

    // Inicialize o Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                handleLogin(authUser)
                console.log('Usuário autenticado:', authUser);
            } else {
                // O usuário fez logout ou não está autenticado
                setSession(null)
                console.log('Usuário não autenticado');
            }
        })

        const handleLanguageChange = () => {
            Cookies.set('LANG', (navigator.language || navigator.userLanguage))
        }

        handleLanguageChange()

        window.addEventListener("languagechange", handleLanguageChange);

        // Remova o ouvinte quando o componente for desmontado
        return () => {
            unsubscribe()
            window.removeEventListener("languagechange", handleLanguageChange);
        }
    }, [])

    function handleLogin(authUser) {
        const now = new Date()
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: authUser.uid,
                new_user: {
                    email: authUser.email,
                    name: authUser.displayName,
                    cart: [],
                    prodiders: authUser.providerData.map(provider => provider.providerId),
                    email_verified: authUser.emailVerified,
                    introduction_complete: false,
                    create_at: {
                        text: now.toString(),
                        ms: now.valueOf(),
                    }
                },
                providers: authUser.providerData.map(provider => provider.providerId)
            })
        }

        fetch("/api/user-session", options)
            .then(response => response.json())
            .then(response => handleSetSession(response))
            .catch(err => console.error(err))
    }

    function handleSetSession(session) {
        setSession(session)
        if (!session.introduction_complete)
            setShowIntroduction(true)
    }

    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuário autenticado:', userCredential.user);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
        Router.push('/')
    }

    function logout() {
        setSession(null)
        setCart([])
        signOut(auth)
        Router.push('/')
    }

    function handleIntroductionComplete() {
        setShowIntroduction(false)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: session.id,
            })
        }

        fetch("/api/introduction-complete", options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
    }

    useEffect(() => {
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
            setCart(session.cart)
        }
        else if (session === null && Cookies.get(CART_COOKIE)) {
            setCart(JSON.parse(Cookies.get(CART_COOKIE)))
        }
        if (session && Cookies.get(CART_COOKIE)) {
            const cookieCart = JSON.parse(Cookies.get(CART_COOKIE))
            const newCart = session.cart
                .map(userProduct =>
                ({
                    ...userProduct,
                    quantity: cookieCart.some(cookieProduct => cookieProduct.id === userProduct.id && cookieProduct.variant === userProduct.variant)
                        ? userProduct.quantity + cookieCart.filter(cookieProduct => cookieProduct.id === userProduct.id && cookieProduct.variant === userProduct.variant)[0].quantity
                        : userProduct.quantity
                }))
                .concat(cookieCart.filter(cookieProduct =>
                    session.cart.every(userProduct => cookieProduct.id !== userProduct.id || cookieProduct.variant !== userProduct.variant))
                )
            setCart(newCart)
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.id,
                    cart: newCart
                })
            }
            fetch("/api/cart", options)
                .catch(err => console.error(err))
            Cookies.remove(CART_COOKIE)
        }
    }, [session])


    return (
        <div
            onClick={() => {
                console.log('session', session)
            }}
        >
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
                    auth={auth}
                    userCurrency={userCurrency}
                    setUserCurrency={setUserCurrency}
                />
            </div>
            {showIntroduction &&
                <div
                    className={styles.introduction}
                    onClick={handleIntroductionComplete}
                >
                    <h1>
                        Introduction
                    </h1>
                </div>
            }
        </div>
    )
}