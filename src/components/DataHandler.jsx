import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../firebase.config'
import { CART_COOKIE } from '../../consts'
import SearchBar from './SearchBar'
import Menu from './Menu'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'next-i18next'
import { showToast } from '../../utils/toasts'

const SUB_NAVBAR_HEIGHT = 40
const SUB_NAVBAR_HEIGHT_MOBILE = 43
const MOBILE_LIMIT = 1075

export default function DataHandler(props) {
    const {
        Component,
        pageProps,
        router,
        setLoading,
        currencies,
    } = props
    const [cart, setCart] = useState()
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [session, setSession] = useState()
    const [mobile, setMobile] = useState()
    const [windowWidth, setWindowWidth] = useState()
    const [websiteVisible, setWebsiteVisible] = useState(false)
    const [userCurrency, setUserCurrency] = useState()
    const [search, setSearch] = useState('')
    const [productOptions, setProductOptions] = useState([])
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [userEmailVerify, setUserEmailVerify] = useState()

    const tNavbar = useTranslation('navbar').t
    const tToasts = useTranslation('toasts').t

    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)

    useEffect(() => {
        getInicialCart()
    }, [session])

    useEffect(() => {
        if (cart !== undefined) {
            setLoading(false)
        }
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
        if (session !== undefined) {
            if (session) {
                getCartFromApi(session.cart_id)
            }
            else {
                const cart_id = Cookies.get(CART_COOKIE)
                if (cart_id) {
                    getCartFromApi(cart_id)
                }
                else {
                    const new_cart_id = uuidv4()
                    getCartFromApi(new_cart_id)
                    Cookies.set(CART_COOKIE, new_cart_id)
                }
            }
        }
    }

    function getCartFromApi(cart_id) {
        const options = {
            method: 'GET',
            headers: {
                cart_id: cart_id,
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
        }

        if (session) {
            options.headers.user_id = session.id
        }

        fetch("/api/carts/cart", options)
            .then(response => response.json())
            .then(response => setCart(response))
            .catch(err => {
                setLoading(false)
                console.error(err)
            })
    }

    function handleChangeCurrency(newCurrencyCode) {
        Cookies.set('CURR', newCurrencyCode)
        setUserCurrency(currencies?.[newCurrencyCode])
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
                authUser: authUser,
                cart_cookie_id: Cookies.get(CART_COOKIE),
            })
        }

        fetch("/api/user-session", options)
            .then(response => response.json())
            .then(response => setSession(response))
            .catch(err => console.error(err))
        Cookies.remove(CART_COOKIE)
    }

    async function login(email, password, isNewUser) {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            if (!isNewUser) {
                showToast({ type: 'success', msg: tToasts('success_login') })
            }
            router.push('/')
        } catch (error) {
            setLoading(false)
            if (error.code === 'auth/wrong-password') {
                const providers = await getUserLoginProviders(email)
                if (providers.includes('password'))
                    return showToast({ msg: tToasts('wrong_password'), type: 'error' })
                return showToast({ type: 'error', msg: tToasts('account_exists_with_different_provider', { count: providers.length, provider: providers.map(prov => prov === 'google.com' ? 'Google' : prov)[0] }) })
            }
            if (error.code === 'auth/user-not-found')
                return showToast({ type: 'error', msg: tToasts('user_not_found') })
            if (error.code === 'auth/invalid-email')
                return showToast({ type: 'error', msg: tToasts('invalid_email') })
            if (error.code === 'auth/too-many-requests')
                return showToast({ type: 'error', msg: tToasts('too_many_requests') })
            return showToast({ type: 'error', msg: tToasts('default_error') })
        }
    }

    async function getUserLoginProviders(email) {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                email: email
            },
        }

        const providers = await fetch("/api/user-providers", options)
            .then(response => response.json())
            .then(response => response.data)

        return providers
    }

    function logout() {
        signOut(auth)
        window.location.href = window.origin
        /* router.push('/')
        setTimeout(() => {
            setSession(null)
            signOut(auth)
        }, 1000) */
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
                console.log(authUser.emailVerified)
                setUserEmailVerify(authUser.emailVerified)
                handleLogin(authUser)
            }
            else {
                // O usuário fez logout ou não está autenticado
                setSession(null)
            }
        })
    }

    useEffect(() => {
        updateSession()
    }, [])

    useEffect(() => {
        if (currencies) {
            if (Cookies.get('CURR'))
                setUserCurrency(currencies?.[Cookies.get('CURR')])
            else {
                setUserCurrency({ code: 'usd', rate: 1, symbol: '$' }) //talvez mudar para moeda da região
                Cookies.set('CURR', 'usd')
            }
        }
    }, [currencies])

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
        router.push(`/search?s=${search}`)
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
            .then(response => response.products)
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
                    transition: {
                        ease: 'easeInOut',
                        duration: 0.35,
                    },
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
                    router={router}
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
                        placeholder={tNavbar('search_bar_placeholder')}
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
                <Component{...pageProps}
                    cart={cart}
                    setCart={setCart}
                    session={session}
                    login={login}
                    updateSession={updateSession}
                    logout={logout}
                    auth={auth}
                    userCurrency={userCurrency}
                    currencies={currencies}
                    handleChangeCurrency={handleChangeCurrency}
                    mobile={mobile}
                    supportsHoverAndPointer={supportsHoverAndPointer}
                    windowWidth={windowWidth}
                    router={router}
                    setLoading={setLoading}
                    getInicialCart={getInicialCart}
                    setSession={setSession}
                    setUserEmailVerify={setUserEmailVerify}
                />
                {showMenu &&
                    <Menu
                        switchMenu={switchMenu}
                        menuOpen={menuOpen}
                        session={session}
                        windowWidth={windowWidth}
                    />
                }
                {userEmailVerify === false && session &&
                    <div
                        style={{
                            position: 'fixed',
                            width: '100%',
                            height: '30px',
                            bottom: 0,
                            backgroundColor: 'red',
                            zIndex: 50,
                        }}
                    >
                    </div>
                }
            </div>
        </motion.div>
    )
}