import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { motion } from "framer-motion"
import Logo from './Logo';
import SearchBar from './SearchBar';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AvatarMenu from './AvatarMenu';
import CartIcon from './CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Selector from './Selector';

export default function NavBar(props) {
    const {
        session,
        logout,
        cart,
        setCart,
        isScrollAtTop,
        setIsScrollAtTop,
    } = props

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [productOptions, setProductOptions] = useState([])

    function handleChangeSearch(event) {
        const search = event.target.value
        setSearch(search)
        getSearchProducts(search)
    }

    function handleKeyDownSearch(event) {
        if (event.key === 'Enter') {
            handleClickSearch()
        }
    }

    function handleClickSearch() {
        const language = Cookies.get('LANG') === 'en' ? false : Cookies.get('LANG')
        Router.push(`/search?s=${search}${language ? `&l=${language.slice(0, 2)}` : ''}`)
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
        <div className={styles.container}>
            <motion.div
                className={styles.bodyContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0, ease: [.48, 0, .15, 1.01] }}
            >
                <div className={styles.leftSide}>
                    <Link legacyBehavior href={'/'}>
                        <a
                            aria-label='Lobby'
                        >
                            <Logo height='100%' hover />
                        </a>
                    </Link>
                </div>
                <div
                    className={styles.middle}
                >
                    <SearchBar
                        show={isScrollAtTop}
                        placeholder='What are you looking for?'
                        onChange={handleChangeSearch}
                        onKeyDown={handleKeyDownSearch}
                        onClick={handleClickSearch}
                        value={search}
                        options={productOptions}
                        setOptions={setProductOptions}
                    />
                    <div
                        className={styles.categoriesContainer}
                        style={{
                            bottom: isScrollAtTop
                                ? '-39px'
                                : '22px',
                        }}
                    >
                        <Link legacyBehavior href={'/search?c=t-shirts'}>
                            <a
                                aria-label='t-shirts'
                                className='noUnderline'
                            >
                                <p>
                                    T-SHIRTS
                                </p>
                            </a>
                        </Link>
                        <Link legacyBehavior href={'/search?c=hoodies'}>
                            <a
                                aria-label='hoodies'
                                className='noUnderline'
                            >
                                <p>
                                    HOODIES
                                </p>
                            </a>
                        </Link>
                        <p>MUGS</p>
                        <p>BAGS</p>
                        <p>ACCESSORIES</p>
                        <p>KITCHEN</p>
                        <Link legacyBehavior href={'/search?c=pillows'}>
                            <a
                                aria-label='pillows'
                                className='noUnderline'
                            >
                                <p>
                                    PILLOWS
                                </p>
                            </a>
                        </Link>
                        <p>SHOES</p>
                        <Link legacyBehavior href={'/search?c=socks'}>
                            <a
                                aria-label='socks'
                                className='noUnderline'
                            >
                                <p>
                                    SOCKS
                                </p>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div
                        className={styles.iconContainer}
                        onClick={() => setIsScrollAtTop(true)}
                        style={{
                            pointerEvents: isScrollAtTop
                                ? 'none'
                                : 'auto',
                            opacity: isScrollAtTop
                                ? 0
                                : 1
                        }}
                    >
                        <SearchRoundedIcon
                            style={{
                                fontSize: 'calc(var(--bar-height) * 0.38)',
                                color: 'var(--global-white)',
                                position: 'relative',
                                top: '1px',
                            }}
                        />
                    </div>
                    <Link legacyBehavior href={'/wishlist'}>
                        <a
                            aria-label='Wishlist'
                        >
                            <div
                                className={styles.iconContainer}
                            >
                                <FavoriteBorderRoundedIcon
                                    style={{
                                        fontSize: 'calc(var(--bar-height) * 0.38)',
                                        color: 'var(--global-white)',
                                        position: 'relative',
                                        top: '1px',
                                    }}
                                />
                            </div>
                        </a>
                    </Link>
                    <CartIcon
                        session={session}
                        cart={cart}
                        setCart={setCart}
                    />
                    <AvatarMenu
                        session={session}
                        logout={logout}
                    />
                </div>
            </motion.div>
        </div>
    )
}