import styles from '@/styles/components/contexts/AppContext.module.css'
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { createContext, useContext, useEffect, useState } from "react"
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from "../NavBar"
import Maintenance from "../Maintenance"
import Menu from "../Menu"
import { fetchSignInMethodsForEmail, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { motion } from 'framer-motion'
import SearchBar from '../SearchBar'
import { CircularProgress } from '@mui/material'
import { CART_LOCAL_STORAGE, COUNTRIES, CURRENCY_LOCAL_STORAGE, INICIAL_VISITANT_CART, LIMITS, getCurrencyByLocation } from '@/consts'
import AdminMenu from '../menus/AdminMenu'
import { showToast } from '@/utils/toasts'
import CountryConverter from '@/utils/time-zone-country.json'
import NProgress from 'nprogress'
import { createNewUser, getUserById } from '../../../frontend/user'
import { addProductToWishlist, deleteProductFromWishlist } from '../../../frontend/wishlists'
import { changeCartProductField, deleteProductFromCart, setCartProducts } from '../../../frontend/cart'
import { getProductsInfo } from '../../../frontend/product'
import { auth } from '../../../firebaseInit'
import { getAllCurrencies } from '../../../frontend/app-settings'
import MyError from '@/classes/MyError'
import { changeVisitantCartProductField, deleteProductFromVisitantCart } from '../../../frontend/visitant-cart'
import { isSameProduct } from '@/utils'
import PosAddToCartModal from '../PosAddToCartModal'
import Modal from '../Modal'
import MyButton from '../material-ui/MyButton'
import { MAINTENANCE } from '@/utils/app-controller'

const AppContext = createContext()

const SUB_NAVBAR_HEIGHT = 40
const SUB_NAVBAR_HEIGHT_MOBILE = 43
const MOBILE_LIMIT = 1075

export function AppProvider({ children }) {

    const [isUser, setIsUser] = useState(false)
    const [isVisitant, setIsVisitant] = useState(false)
    const [userEmailVerify, setUserEmailVerify] = useState()
    const [session, setSession] = useState()
    const [cart, setCart] = useState()

    const [userCurrency, setUserCurrency] = useState()
    const [userLocation, setUserLocation] = useState()
    const [isScrollAtTop, setIsScrollAtTop] = useState(true)
    const [mobile, setMobile] = useState()
    const [windowWidth, setWindowWidth] = useState()
    const [search, setSearch] = useState('')
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [adminMenuOpen, setAdminMenuOpen] = useState(false)
    const [authValidated, setAuthValidated] = useState(false)
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [blockInteractions, setBlockInteractions] = useState(false)
    const [currencies, setCurrencies] = useState()
    const [isAdmin, setIsAdmin] = useState()
    const [posAddModal, setPosAddModal] = useState(false)
    const [bringCartModalOpen, setBringCartModalOpen] = useState(false)
    const [visitantProductsLength, setVisitantProductsLength] = useState(0)

    const websiteVisible = mobile !== undefined

    const router = useRouter()

    const tNavbar = useTranslation('navbar').t
    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t

    const adminMode = isAdmin && router.pathname.split('/')[1] === 'admin'

    useEffect(() => {
        handleResize()

        function handleResize() {
            setMobile(window.innerWidth < MOBILE_LIMIT)
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const country = CountryConverter[Intl.DateTimeFormat().resolvedOptions().timeZone]
        setUserLocation({
            country: country,
            continent: COUNTRIES[country].continent
        })
        updateSession()
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

    useEffect(() => {
        setSearch(router?.query?.s ? router.query.s : '')
        setPosAddModal(false)
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

    useEffect(() => {
        if (cart !== undefined)
            setLoading(false)
    }, [cart])

    useEffect(() => {
        if (auth?.currentUser)
            verifyAdmin()
    }, [auth?.currentUser])

    async function verifyAdmin() {
        try {
            const token = await auth.currentUser.getIdToken()

            const options = {
                method: 'GET',
                headers: {
                    authorization: token,
                },
            }
            const response = await fetch('/api/admin/verify', options)
            const responseJson = await response.json()
            setIsAdmin(responseJson.isAdmin)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
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

    useEffect(() => {
        if (currencies) {
            if (localStorage.getItem(CURRENCY_LOCAL_STORAGE))
                setUserCurrency(currencies?.[localStorage.getItem(CURRENCY_LOCAL_STORAGE)])
            else {
                const country = CountryConverter[Intl.DateTimeFormat().resolvedOptions().timeZone]
                const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0]
                const startCurrency = currencies[getCurrencyByLocation(country, zone)]
                setUserCurrency(startCurrency)
                localStorage.setItem(CURRENCY_LOCAL_STORAGE, startCurrency.code)
            }
        }
    }, [currencies])

    async function getCurrencies() {
        try {
            const currencies = await getAllCurrencies()
            setCurrencies(currencies.data)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    function switchMenu() {
        setMenuOpen(prev => {
            if (!prev)
                setShowMenu(true)
            else
                setTimeout(() => setShowMenu(false), 350)
            return !prev
        })
    }

    async function getInicialCart() {
        try {
            if (session) {
                try {
                    const userData = await getUserById(session.id)
                    const products = await getProductsInfo(userData.cart.products)
                    setCart({ ...userData.cart, products: products })
                }
                catch (error) {
                    const emptyCart = await setCartProducts(session.id, [])
                    setCart(emptyCart)
                    showToast({ type: 'error', msg: tToasts('empty_cart_due_to_an_error') })
                }
            }
            else if (session === null) {
                const visitantCart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))
                if (visitantCart) {
                    try {
                        const products = await getProductsInfo(visitantCart.products)
                        setCart({ ...visitantCart, products: products })
                    }
                    catch (error) {
                        setCart(INICIAL_VISITANT_CART)
                        localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(INICIAL_VISITANT_CART))
                        showToast({ type: 'error', msg: tToasts('empty_cart_due_to_an_error') })
                    }
                }
                else {
                    localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(INICIAL_VISITANT_CART))
                    setCart(INICIAL_VISITANT_CART)
                }
            }
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    function handleChangeCurrency(newCurrencyCode) {
        localStorage.setItem(CURRENCY_LOCAL_STORAGE, newCurrencyCode)
        setUserCurrency(currencies?.[newCurrencyCode])
    }

    function updateSession() {
        onAuthStateChanged(auth, async (authUser) => {
            try {
                const user = authUser ? await getUserById(authUser.uid) : null
                //Já é usuário, logando
                if (authUser && user) {
                    setIsUser(true)
                    setIsVisitant(false)
                    setUserEmailVerify(authUser.emailVerified)
                    await handleLogin(user)
                }
                //Criando conta com o google ou Está autenticado mas não tem documento de usuário no firebase
                else if (!user && authUser) {
                    const newUser = await handleCreateNewUser(authUser)
                    await handleLogin(newUser)
                }
                //Não é usuário, não está autenticado
                else if (!authUser) {
                    setIsVisitant(true)
                    setIsUser(false)
                    setSession(null)
                    getVisitantCart()
                }
                setAuthValidated(true)
            }
            catch (error) {
                console.error(error)
                if (error.msg)
                    showToast({ type: error.type, msg: tToasts(error.msg) })
            }
        })
    }

    async function handleLogin(user) {
        try {
            const sessionData = { ...user }
            delete sessionData.cart
            setSession(sessionData)
            try {
                const products = await getProductsInfo(user.cart.products)
                setCart({ ...user.cart, products: products })
            }
            catch (error) {
                const emptyCart = await setCartProducts(user.id, [])
                setCart(emptyCart)
                showToast({ type: 'error', msg: tToasts('empty_cart_due_to_an_error') })
            }
            const visitantCartProducts = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))?.products || []
            if (visitantCartProducts.length > 0) {
                setVisitantProductsLength(visitantCartProducts.reduce((acc, prod) => acc + prod.quantity, 0))
                setBringCartModalOpen(true)
            }
        }
        catch (error) {
            console.error(error)
            showToast({ type: 'error', msg: tToasts('error_getting_session') })
            logout()
        }
    }

    async function handleCreateNewUser(authUser) {
        try {
            setIsUser(true)
            setIsVisitant(false)
            setUserEmailVerify(authUser.emailVerified)
            const newUser = await createNewUser(authUser)
            return newUser
        }
        catch (error) {
            console.error(error)
            showToast({ type: 'error', msg: tToasts('error_creating_user') })
            logout()
        }
    }

    async function getVisitantCart() {
        try {
            const visitantCart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))
            if (visitantCart) {
                try {
                    const products = await getProductsInfo(visitantCart.products)
                    setCart({ ...visitantCart, products: products })
                }
                catch (error) {
                    setCart(INICIAL_VISITANT_CART)
                    localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(INICIAL_VISITANT_CART))
                    showToast({ type: 'error', msg: tToasts('empty_cart_due_to_an_error') })
                }
            }
            else {
                setCart(INICIAL_VISITANT_CART)
                localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(INICIAL_VISITANT_CART))
            }

        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    async function login(email, password) {
        try {
            setShowLoadingScreen(true)
            const authRes = await signInWithEmailAndPassword(auth, email, password)
            showToast({ type: 'success', msg: tToasts('success_login', { user_name: authRes.user.displayName }), time: 2000 })
            if (router.pathname === '/login' || router.pathname === '/signin')
                router.push('/')
        }
        catch (error) {
            try {
                setLoading(false)
                setBlockInteractions(false)
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
            catch (error) {
                console.error(error)
                if (error.msg)
                    showToast({ type: error.type, msg: tToasts(error.msg) })
            }
        }
    }

    async function getUserLoginProviders(email) {
        const providers = await fetchSignInMethodsForEmail(auth, email)
        return providers
    }

    function handleChangeSearch(event) {
        const search = event.target.value
        setSearch(search)
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

    function logout() {
        setShowLoadingScreen(true)
        signOut(auth)
            .then(() => {
                setIsUser(false)
                setIsVisitant(true)
                setCart(INICIAL_VISITANT_CART)
                setUserEmailVerify(false)
                setSession(null)
                setIsAdmin(false)
                showToast({ type: 'info', msg: tToasts('logout_message') })
                router.push('/')
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    async function handleWishlistClick(productId, toAdd) {
        const prevWishlist = { ...session.wishlist }
        try {
            const add = toAdd || !session.wishlist.products.some(prod => prod.id === productId)

            if (add && session.wishlist.products.length >= LIMITS.wishlist_products) {
                showToast({ type: 'error', msg: tToasts('wishlist_limit') })
                return
            }

            setSession(prev => (
                {
                    ...prev,
                    wishlist: {
                        ...prev.wishlist,
                        products: add
                            ? prev.wishlist.products.concat({ id: productId })
                            : prev.wishlist.products.filter(prod => prod.id !== productId)
                    }
                }
            ))

            add
                ? await addProductToWishlist(session.id, { id: productId })
                : await deleteProductFromWishlist(session.id, { id: productId })

        }
        catch (error) {
            console.error(error)
            setSession(prev => ({ ...prev, wishlist: prevWishlist }))
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    async function handleChangeProductQuantity(product, value) {
        try {
            session
                ? await changeCartProductField(session.id, product, 'quantity', value)
                : changeVisitantCartProductField(product, 'quantity', value)
            setCart(prev => ({ ...prev, products: prev.products.map(prod => isSameProduct(prod, product) ? { ...prod, quantity: value } : prod) }))
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    async function handleDeleteProductFromCart(product) {
        if (session) {
            await deleteProductFromCart(session.id, product)
        }
        else {
            deleteProductFromVisitantCart(product)
        }
        setCart(prev => ({ ...prev, products: prev.products.filter(prod => !isSameProduct(prod, product)) }))
    }

    async function handleBringCart() {
        try {
            setBringCartModalOpen(false)
            const visitantCartProducts = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE))?.products || []
            await setCartProducts(session.id, visitantCartProducts)
            getInicialCart()
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

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
                currencies,
                windowWidth,
                setAdminMenuOpen,
                logout,
                showLoadingScreen,
                setShowLoadingScreen,
                isUser,
                isVisitant,
                adminMenuOpen,
                userEmailVerify,
                setUserEmailVerify,
                setBlockInteractions,
                userLocation,
                setUserLocation,
                search,
                setSearch,
                cart,
                setCart,
                handleWishlistClick,
                getInicialCart,
                isAdmin,
                handleChangeProductQuantity,
                handleDeleteProductFromCart,
                handleCreateNewUser,
                setPosAddModal,
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
                        handleClickSearch={handleClickSearch}
                        handleKeyDownSearch={handleKeyDownSearch}
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
                                transition: `all ease-in-out 0ms`,
                            }}
                        >
                            <SearchBar
                                show={isScrollAtTop && mobile}
                                placeholder={tNavbar('search_bar_placeholder')}
                                onChange={handleChangeSearch}
                                onKeyDown={handleKeyDownSearch}
                                onClick={handleClickSearch}
                                barHeight={30}
                            />
                        </div>
                    }
                </div>
                {session &&
                    <Modal
                        className={styles.bringCartModal}
                        open={bringCartModalOpen}
                        closeModal={() => setBringCartModalOpen(false)}
                        closedCallBack={() => {
                            localStorage.removeItem(CART_LOCAL_STORAGE)
                            setVisitantProductsLength(0)
                        }}
                    >
                        <div
                            className={styles.bringCartModalTexts}
                        >
                            <span>{tCommon('you_have_x_products', { products_length: visitantProductsLength })}</span>
                            <span style={{ fontWeight: 600 }}>{tCommon('keep_cart')}</span>
                        </div>
                        <div
                            className={styles.bringCartModalButtons}
                        >
                            <MyButton
                                variant='contained'
                                color='success'
                                onClick={handleBringCart}
                                style={{
                                    width: 'calc(50% - 0.5rem)',
                                    fontWeight: 700,
                                    color: 'var(--global-white)',
                                }}
                            >
                                {tCommon('yes')}
                            </MyButton>
                            <MyButton
                                variant='outlined'
                                color='error'
                                onClick={() => setBringCartModalOpen(false)}
                                style={{
                                    width: 'calc(50% - 0.5rem)',
                                    fontWeight: 700,
                                }}
                            >
                                {tCommon('no')}
                            </MyButton>
                        </div>
                    </Modal>
                }
                <div
                    className={styles.componentContainer}
                    style={{
                        paddingTop: `calc(var(--navbar-height) + ${adminMode ? 0 : mobile ? SUB_NAVBAR_HEIGHT_MOBILE : SUB_NAVBAR_HEIGHT}px)`,
                        transition: `all ease-in-out ${websiteVisible ? 200 : 0}ms`,
                    }}
                >
                    {MAINTENANCE
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
            <PosAddToCartModal
                open={posAddModal}
                close={() => setPosAddModal(false)}
            />
            <div className={styles.toastContainer}>
                <ToastContainer
                    newestOnTop
                    transition={Flip}
                    style={{ color: 'white' }}
                    pauseOnFocusLoss={false}
                />
            </div>
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
        </AppContext.Provider >
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new MyError({ message: 'useAppContext must be used within a AppProvider' });
    }
    return context
}