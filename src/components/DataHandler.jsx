import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase.config';
import { CART_COOKIE } from '../../consts';
import SearchBar from './SearchBar';
import Router, { useRouter } from 'next/router';

const SUB_NAVBAR_HEIGHT = 40
const SUB_NAVBAR_HEIGHT_MOBILE = 55
const MOBILE_LIMIT = 1075

export default function DataHandler(props) {
    const { Component, pageProps, primaryColor } = props
    const [cart, setCart] = useState()
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [session, setSession] = useState()
    const [mobile, setMobile] = useState()
    const [showIntroduction, setShowIntroduction] = useState(false)
    const [userCurrency, setUserCurrency] = useState({ code: 'usd', symbol: '$' })
    const [search, setSearch] = useState('')
    const [productOptions, setProductOptions] = useState([])

    const router = useRouter();

    // Inicialize o Firebase
    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)

    useEffect(() => {
        if (session !== undefined) {
            getInicialCart()
        }
    }, [session])

    useEffect(() => {
        if (cart)
            updateCart()
    }, [cart])

    function getInicialCart() {
        if (session) {
            getUserCart()
        }
        else {
            const cart_id = Cookies.get(CART_COOKIE)
            if (cart_id) {
                getUserCartSession(cart_id)
            }
            else {
                setCart([])
            }
        }
    }

    function updateCart() {
        if (session)
            putCart()
        else {
            const cart_id = Cookies.get(CART_COOKIE)
            if (cart_id) {
                putCartSession(cart_id)
            }
            else {
                postNewCart(cart)
            }
        }
    }

    function putCart() {
        const options = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartId: session.cart_id,
                cart: cart,
            })
        }
        fetch("/api/cart", options)
    }

    function putCartSession(cartId) {
        const options = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartId: cartId,
                cart: cart,
            })
        }
        fetch("/api/cart-session", options)
    }

    function postNewCart(cart) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart: cart
            })
        }
        fetch("/api/cart-session", options)
            .then(response => response.json())
            .then(response => Cookies.set(CART_COOKIE, response.cart_id))
            .catch(err => console.error(err))
    }

    function getUserCart() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                cart_id: session.cart_id,
            },
        }
        fetch("/api/cart", options)
            .then(response => response.json())
            .then(response => setCart(response.cart))
            .catch(err => console.error(err))
    }

    function getUserCartSession(cart_id) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                cart_id: cart_id,
            },
        }
        fetch("/api/cart-session", options)
            .then(response => response.json())
            .then(response => setCart(response.cart))
            .catch(err => console.error(err))
    }

    function handleChangeCurrency(newCurrency) {
        Cookies.set('CURR', JSON.stringify(newCurrency))
        setUserCurrency(newCurrency)
    }

    function handleLogin(authUser) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: authUser.uid,
                new_user: {
                    email: authUser.email,
                    name: authUser.displayName,
                    prodiders: authUser.providerData.map(provider => provider.providerId),
                    email_verified: authUser.emailVerified,
                    introduction_complete: false,
                },
                cart_cookie_id: Cookies.get(CART_COOKIE),
                providers: authUser.providerData.map(provider => provider.providerId)
            })
        }

        fetch("/api/user-session", options)
            .then(response => response.json())
            .then(response => handleSetSession(response))
            .catch(err => console.error(err))
        Cookies.remove(CART_COOKIE)
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
        /* setCart([]) */
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
        if (Cookies.get('CURR'))
            setUserCurrency(JSON.parse(Cookies.get('CURR')))
        else
            Cookies.set('CURR', JSON.stringify(userCurrency))

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

    useEffect(() => {
        function handleResize() {
            setMobile(window.innerWidth < MOBILE_LIMIT)
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function handleChangeSearch(event) {
        const search = event.target.value
        setSearch(search)
        getSearchProducts(search)
    }

    function handleClickSearch() {
        const language = Cookies.get('LANG') === 'en' ? false : Cookies.get('LANG')
        Router.push(`/search?s=${search}${language ? `&l=${language.slice(0, 2)}` : ''}`)
    }

    function handleKeyDownSearch(event) {
        if (event.key === 'Enter') {
            handleClickSearch()
        }
    }

    async function getSearchProducts(s) {
        const options = {
            method: 'GET',
            headers: {
                s: s,
            }
        }

        const products = await fetch("/api/products-by-title", options)
            .then(response => response.json())
            .then(response => response.products)
            .catch(err => console.error(err))

        console.log(products)

        setProductOptions(products)
    }

    useEffect(() => {
        setSearch(router?.query?.s ? router.query.s : '')
    }, [router])

    return (
        mobile !== undefined &&
        <div
            onClick={() => {
                console.log('session', session)
            }}
        >
            <div
                className={styles.topContainer}
                style={{
                    height: `calc(5rem + ${mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px)`
                }}
            >
                <NavBar
                    cart={cart}
                    setCart={setCart}
                    isScrollAtTop={isScrollAtTop}
                    setIsScrollAtTop={setIsScrollAtTop}
                    session={session}
                    login={login}
                    logout={logout}
                    userCurrency={userCurrency}
                    mobile={mobile}
                    handleChangeSearch={handleChangeSearch}
                    search={search}
                    productOptions={productOptions}
                    setProductOptions={setProductOptions}
                    handleClickSearch={handleClickSearch}
                    handleKeyDownSearch={handleKeyDownSearch}
                    setSearch={setSearch}
                />
                <div
                    className={styles.subNavBar}
                    style={{
                        transform: isScrollAtTop
                            ? 'translateY(0)'
                            : 'translateY(-100%)',
                        height: `${mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px`
                    }}
                >
                    <SearchBar
                        show={isScrollAtTop && mobile}
                        placeholder='What are you looking for?'
                        onChange={handleChangeSearch}
                        onKeyDown={handleKeyDownSearch}
                        onClick={handleClickSearch}
                        value={search}
                        options={productOptions}
                        setOptions={setProductOptions}
                        setSearch={setSearch}
                        style={{
                            height: '2.2rem'
                        }}
                    />
                </div>
            </div>
            <div
                className={styles.componentContainer}
                style={{
                    paddingTop: `calc(5rem + ${mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px)`
                }}
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
                    handleChangeCurrency={handleChangeCurrency}
                />
            </div>
            {
                showIntroduction &&
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