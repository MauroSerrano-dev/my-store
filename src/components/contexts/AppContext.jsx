import styles from '@/styles/components/contexts/AppContext.module.css'
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { createContext, useContext, useEffect, useState } from "react"
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from "../NavBar"
import Maintenance from "../Maintenance"
import Menu from "../Menu"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../../firebase.config"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { isAdmin } from "@/utils/validations"
import { motion } from 'framer-motion'
import SearchBar from '../SearchBar'
import { CircularProgress } from '@mui/material'
import Cookies from 'js-cookie'
import { CART_COOKIE, getCurrencyByLocation } from '@/consts'
import { v4 as uuidv4 } from 'uuid'
import AdminMenu from '../menus/AdminMenu'
import { showToast } from '@/utils/toasts'
import Error from 'next/error'
import CountryConverter from '@/utils/time-zone-country.json'
import ZoneConverter from '@/utils/country-zone.json'
import NProgress from 'nprogress'

const AppContext = createContext()

const SUB_NAVBAR_HEIGHT = 40
const SUB_NAVBAR_HEIGHT_MOBILE = 43
const MOBILE_LIMIT = 1075

export function AppProvider({ children }) {

    const [cart, setCart] = useState()
    const [isUser, setIsUser] = useState(false)
    const [isVisitant, setIsVisitant] = useState(false)
    const [userEmailVerify, setUserEmailVerify] = useState()
    const [session, setSession] = useState()

    const [userCurrency, setUserCurrency] = useState()
    const [userLocation, setUserLocation] = useState()
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [mobile, setMobile] = useState()
    const [windowWidth, setWindowWidth] = useState()
    const [websiteVisible, setWebsiteVisible] = useState(false)
    const [search, setSearch] = useState('')
    const [productOptions, setProductOptions] = useState([])
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [adminMenuOpen, setAdminMenuOpen] = useState(false)
    const [authValidated, setAuthValidated] = useState(false)
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [blockInteractions, setBlockInteractions] = useState(false)
    const [currencies, setCurrencies] = useState()

    const router = useRouter()

    const tNavbar = useTranslation('navbar').t
    const tToasts = useTranslation('toasts').t

    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)

    const adminMode = isAdmin(auth) && router.pathname.split('/')[1] === 'admin'

    useEffect(() => {
        getCurrencies()

        NProgress.configure({ showSpinner: false })

        function handleRouteChangeStart() {
            NProgress.start()
            setLoading(true)
        }

        function handleRouteChangeComplete() {
            NProgress.done()
            setLoading(false)
            setBlockInteractions(false)
            setShowLoadingScreen(false)
        }

        function handleRouteChangeError() {
            setLoading(false)
            setBlockInteractions(false)
            setShowLoadingScreen(false)
        }

        router.events.on("routeChangeStart", handleRouteChangeStart)
        router.events.on("routeChangeComplete", handleRouteChangeComplete)
        router.events.on("routeChangeError", handleRouteChangeError)

        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart)
            router.events.off("routeChangeComplete", handleRouteChangeComplete)
            router.events.off("routeChangeError", handleRouteChangeError)
        }
    }, [])

    function getCurrencies() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
        }

        fetch("/api/app-settings/currencies", options)
            .then(response => response.json())
            .then(response => setCurrencies(response.data))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getInicialCart()
    }, [session])

    useEffect(() => {
        if (cart !== undefined)
            setLoading(false)
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

    function login(email, password) {
        setShowLoadingScreen(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(authRes => {
                showToast({ type: 'success', msg: tToasts('success_login', { user_name: authRes.user.displayName }), time: 2000 })
                router.push('/')
            })
            .catch(error => {
                setLoading(false)
                setBlockInteractions(false)
                if (error.code === 'auth/wrong-password') {
                    getUserLoginProviders(email)
                        .then(providers => {
                            if (providers.includes('password'))
                                return showToast({ msg: tToasts('wrong_password'), type: 'error' })
                            return showToast({ type: 'error', msg: tToasts('account_exists_with_different_provider', { count: providers.length, provider: providers.map(prov => prov === 'google.com' ? 'Google' : prov)[0] }) })
                        })
                        .catch(() => showToast({ type: 'error', msg: tToasts('default_error') }))
                    return
                }
                if (error.code === 'auth/user-not-found')
                    return showToast({ type: 'error', msg: tToasts('user_not_found') })
                if (error.code === 'auth/invalid-email')
                    return showToast({ type: 'error', msg: tToasts('invalid_email') })
                if (error.code === 'auth/too-many-requests')
                    return showToast({ type: 'error', msg: tToasts('too_many_requests') })
                return showToast({ type: 'error', msg: tToasts('default_error') })
            })
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
        setShowLoadingScreen(true)
        signOut(auth)
            .then(() => {
                setIsUser(false)
                setIsVisitant(true)
                setCart()
                setUserEmailVerify(false)
                setSession(null)
                showToast({ type: 'info', msg: 'Volte Sempre' })
                router.push('/')
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
        /* window.location.href = window.origin */
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
            setAuthValidated(true)
            if (authUser) {
                setIsUser(true)
                setUserEmailVerify(authUser.emailVerified)
                handleLogin(authUser)
            }
            else {
                // O usuário fez logout ou não está autenticado
                setIsVisitant(true)
                setSession(null)
            }
        })
    }

    useEffect(() => {
        const country = CountryConverter[Intl.DateTimeFormat().resolvedOptions().timeZone]
        setUserLocation({
            country: country,
            zone: ZoneConverter[country],
        })
        updateSession()
    }, [])

    useEffect(() => {
        if (currencies) {
            if (Cookies.get('CURR'))
                setUserCurrency(currencies?.[Cookies.get('CURR')])
            else {
                const country = CountryConverter[Intl.DateTimeFormat().resolvedOptions().timeZone]
                const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0]
                const startCurrency = currencies[getCurrencyByLocation(country, zone)]
                setUserCurrency(startCurrency)
                Cookies.set('CURR', startCurrency.code)
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
        <AppContext.Provider
            value={{
                authValidated,
                auth,
                login,
                mobile,
                router,
                session,
                setSession,
                loading,
                setLoading,
                supportsHoverAndPointer,
                handleChangeCurrency,
                userCurrency,
                setCart,
                cart,
                currencies,
                windowWidth,
                getInicialCart,
                setAdminMenuOpen,
                logout,
                showLoadingScreen,
                setShowLoadingScreen,
                isUser,
                isVisitant,
                updateSession,
                adminMenuOpen,
                userEmailVerify,
                setUserEmailVerify,
                setBlockInteractions,
                userLocation,
                setUserLocation,
            }}
        >
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
                        isScrollAtTop={isScrollAtTop}
                        setIsScrollAtTop={setIsScrollAtTop}
                        handleChangeSearch={handleChangeSearch}
                        search={search}
                        productOptions={productOptions}
                        setProductOptions={setProductOptions}
                        handleClickSearch={handleClickSearch}
                        handleKeyDownSearch={handleKeyDownSearch}
                        setSearch={setSearch}
                        menuOpen={menuOpen}
                        switchMenu={switchMenu}
                        adminMode={adminMode}
                        setAdminMenuOpen={setAdminMenuOpen}
                        adminMenuOpen={adminMenuOpen}
                    />
                    {!adminMode &&
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
                    }
                </div>
                <div
                    className={styles.componentContainer}
                    style={{
                        paddingTop: `calc(5rem + ${mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px)`,
                        transition: `all ease-in-out ${websiteVisible ? 200 : 0}ms`,
                    }}
                >
                    {process.env.NEXT_PUBLIC_MAINTENANCE === 'true'
                        ? <Maintenance></Maintenance>
                        : children
                    }
                    {!adminMode && showMenu &&
                        <Menu
                            switchMenu={switchMenu}
                            menuOpen={menuOpen}
                        />
                    }
                    {adminMode &&
                        <AdminMenu
                            open={adminMenuOpen}
                        />
                    }
                </div>
            </motion.div>
            <ToastContainer
                newestOnTop
                transition={Flip}
                style={{ color: 'white' }}
                pauseOnFocusLoss={false}
            />
            {blockInteractions &&
                <div
                    style={{
                        position: 'fixed',
                        zIndex: 99999,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                    }}>
                </div>
            }
            {loading &&
                <motion.div
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                duration: 0,
                                delay: 0.2,
                            }
                        }
                    }}
                    initial='hidden'
                    animate='visible'
                    style={{
                        position: 'fixed',
                        right: '4rem',
                        bottom: '4rem',
                        zIndex: 10000,
                    }}
                >
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            position: 'absolute',
                            color: '#525252',
                        }}
                        size={40}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        disableShrink
                        size={40}
                        thickness={4}
                        sx={{
                            position: 'absolute',
                            animationDuration: '750ms',
                        }}
                    />
                </motion.div>
            }
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context
}