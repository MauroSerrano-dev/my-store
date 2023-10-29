import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase.config';
import { CART_COOKIE } from '../../consts';
import SearchBar from './SearchBar';
import Menu from './Menu';
import { motion } from 'framer-motion';

const SUB_NAVBAR_HEIGHT = 40
const SUB_NAVBAR_HEIGHT_MOBILE = 43
const MOBILE_LIMIT = 1075

export default function DataHandler(props) {
    const {
        Component,
        pageProps,
        router,
    } = props
    const [cart, setCart] = useState()
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [session, setSession] = useState()
    const [mobile, setMobile] = useState()
    const [windowWidth, setWindowWidth] = useState()
    const [websiteVisible, setWebsiteVisible] = useState(false)
    const [showIntroduction, setShowIntroduction] = useState(false)
    const [userCurrency, setUserCurrency] = useState({ code: 'usd', symbol: '$' })
    const [search, setSearch] = useState('')
    const [productOptions, setProductOptions] = useState([])
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

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

    function switchMenu() {
        setMenuOpen(prev => {
            if (!prev)
                setShowMenu(true)
            else
                setTimeout(() => setShowMenu(false), 350)
            return !prev
        })
    }

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
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
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
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
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
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
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
                cart_id: session.cart_id,
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
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
                cart_id: cart_id,
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
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
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                uid: authUser.uid,
                new_user: {
                    email: authUser.email,
                    name: authUser.displayName,
                    providers: authUser.providerData.map(provider => provider.providerId),
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
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error trying to login:', error);
        }
        router.push('/')
    }

    function logout() {
        setSession(null)
        signOut(auth)
        router.push('/')
    }

    function handleIntroductionComplete() {
        setShowIntroduction(false)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
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
            const isAtTop = window.scrollY <= (mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT) / 2

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
    }, [mobile])

    function updateSession() {
        onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                handleLogin(authUser)
            } else {
                // O usuário fez logout ou não está autenticado
                setSession(null)
            }
        })
    }

    useEffect(() => {
        if (Cookies.get('CURR'))
            setUserCurrency(JSON.parse(Cookies.get('CURR')))
        else
            Cookies.set('CURR', JSON.stringify(userCurrency))

        updateSession()

        const handleLanguageChange = () => {
            Cookies.set('LANG', (navigator.language || navigator.userLanguage))
        }

        handleLanguageChange()

        window.addEventListener("languagechange", handleLanguageChange);

        // Remova o ouvinte quando o componente for desmontado
        return () => {
            window.removeEventListener("languagechange", handleLanguageChange);
        }
    }, [])

    useEffect(() => {
        function handleResize() {
            setMobile(window.innerWidth < MOBILE_LIMIT)
            setWindowWidth(window.innerWidth)
        }

        handleResize()
        setTimeout(() => {
            setWebsiteVisible(true)
        }, 45) // com 10 estava tendo um bug de animação ao fazer refresh

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const hoverMediaQuery = window.matchMedia('(hover: hover)');
        const pointerMediaQuery = window.matchMedia('(pointer: fine)');

        const updateHoverAndPointer = () => {
            setSupportsHoverAndPointer(
                hoverMediaQuery.matches && pointerMediaQuery.matches
            )
        }

        hoverMediaQuery.addListener(updateHoverAndPointer);
        pointerMediaQuery.addListener(updateHoverAndPointer);

        updateHoverAndPointer();

        return () => {
            hoverMediaQuery.removeListener(updateHoverAndPointer);
            pointerMediaQuery.removeListener(updateHoverAndPointer);
        }
    }, [])

    function handleChangeSearch(event) {
        const search = event.target.value
        setSearch(search)
        getSearchProducts(search)
    }

    function handleClickSearch() {
        const language = Cookies.get('LANG') === 'en' ? false : Cookies.get('LANG')
        router.push(`/search?s=${search}${language ? `&l=${language.slice(0, 2)}` : ''}`)
    }

    function handleKeyDownSearch(event) {
        if (event.key === 'Enter') {
            handleClickSearch()
            event.target.blur()
        }
    }

    async function getSearchProducts(s) {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                s: s,
            }
        }

        const products = await fetch("/api/products-by-title", options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                return response.products
            })
            .catch(err => console.error(err))

        setProductOptions(products)
    }

    useEffect(() => {
        setSearch(router?.query?.s ? router.query.s : '')
        setProductOptions([])
    }, [router])

    useEffect(() => {
        if (menuOpen) {
            document.documentElement.style.overflowY = "hidden"
            document.body.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }

        return () => {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }
    }, [menuOpen])

    return (
        <motion.div
            className={styles.container}
            style={{
                opacity: websiteVisible ? 1 : 0,
            }}
            initial='closed'
            animate={
                menuOpen
                    ? windowWidth < 420
                        ? 'openMobile'
                        : 'open'
                    : 'closed'
            }
            variants={{
                closed: {
                    left: '0px',
                },
                open: {
                    left: '350px',
                    transition: {
                        ease: 'easeInOut',
                        duration: 0.35,
                    },
                },
                openMobile: {
                    left: '100vw',
                    transition: {
                        ease: 'easeInOut',
                        duration: 0.35,
                    },
                },
            }}
        >
            <div
                className={styles.topContainer}
                style={{
                    height: '5rem',
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
                    supportsHoverAndPointer={supportsHoverAndPointer}
                    menuOpen={menuOpen}
                    switchMenu={switchMenu}
                />
                <div
                    className={styles.subNavBar}
                    style={{
                        top: isScrollAtTop ? '5rem' : 0,
                        height: mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT,
                        transition: `all ease-in-out ${websiteVisible ? 200 : 0}ms`,
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
                        barHeight={30}
                    />
                </div>
            </div>
            <div
                className={styles.componentContainer}
                style={{
                    paddingTop: `calc(5rem + ${mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px)`,
                    transition: `all ease-in-out ${websiteVisible ? 200 : 0}ms`,
                }}
            >
                <
                    Component{...pageProps}
                    cart={cart}
                    setCart={setCart}
                    session={session}
                    login={login}
                    updateSession={updateSession}
                    logout={logout}
                    auth={auth}
                    userCurrency={userCurrency}
                    handleChangeCurrency={handleChangeCurrency}
                    mobile={mobile}
                    supportsHoverAndPointer={supportsHoverAndPointer}
                    windowWidth={windowWidth}
                    router={router}
                />
                {showMenu &&
                    <Menu
                        switchMenu={switchMenu}
                        menuOpen={menuOpen}
                        session={session}
                        windowWidth={windowWidth}
                    />
                }
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
        </motion.div>
    )
}