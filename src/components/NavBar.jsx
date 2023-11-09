import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import Logo from './svgs/Logo';
import SearchBar from './SearchBar';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AvatarMenu from './AvatarMenu';
import CartIcon from './CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { itemsNavBar } from '../../consts';
import { motion } from "framer-motion";
import { MenuToggle } from './MenuToggle';
import { useTranslation } from 'react-i18next';

export default function NavBar(props) {
    const {
        session,
        logout,
        cart,
        setCart,
        isScrollAtTop,
        setIsScrollAtTop,
        userCurrency,
        mobile,
        search,
        productOptions,
        handleChangeSearch,
        setProductOptions,
        handleClickSearch,
        handleKeyDownSearch,
        setSearch,
        supportsHoverAndPointer,
        menuOpen,
        switchMenu,
    } = props

    const tCommon = useTranslation('common').t
    const tNavbar = useTranslation('navbar').t

    const search_bar_placeholder = tNavbar('search_bar_placeholder')

    const [translationReady, setTranslationReady] = useState(false)

    useEffect(() => {
        if (search_bar_placeholder !== 'search_bar_placeholder')
            setTranslationReady(true)
    }, [search_bar_placeholder])

    return (
        <div className={styles.container}>
            <div
                className={styles.bodyContainer}
            >
                <div className={styles.leftSide}>
                    <motion.div
                        initial={false}
                        animate={menuOpen ? "open" : "closed"}
                    >
                        <MenuToggle
                            toggle={() => switchMenu()}
                        />
                    </motion.div>
                    {!mobile &&
                        <Link
                            href={'/'}
                            className='fillHeight'
                            aria-label='Home'
                            style={{
                                height: '70%',
                                paddingTop: '2%',
                            }}
                        >
                            <Logo height='100%' />
                        </Link>
                    }
                </div>
                <div
                    className={styles.middle}
                >
                    {mobile
                        ? <Link
                            href={'/'}
                            className='fillHeight'
                            aria-label='Home'
                            style={{
                                height: '70%',
                                paddingTop: '2%',
                            }}
                        >
                            <Logo height='100%' />
                        </Link>
                        : translationReady
                            ? <SearchBar
                                show={isScrollAtTop}
                                placeholder={search_bar_placeholder}
                                onChange={handleChangeSearch}
                                onKeyDown={handleKeyDownSearch}
                                onClick={handleClickSearch}
                                value={search}
                                options={productOptions}
                                setOptions={setProductOptions}
                                setSearch={setSearch}
                            />
                            : <div></div>
                    }
                    {!mobile &&
                        <div
                            className={styles.categoriesContainer}
                            style={{
                                bottom: isScrollAtTop
                                    ? '-39px'
                                    : '22px',
                            }}
                        >
                            {translationReady && itemsNavBar.map((item, i) =>
                                <Link
                                    key={i}
                                    href={`/search?v=${item.value}`}
                                    aria-label={item.value}
                                    className={`noUnderline fillHeight flex center ${styles.titleLink}`}
                                >
                                    <p className={styles.title}>
                                        {tNavbar(item.title)}
                                    </p>
                                </Link>
                            )}
                        </div>
                    }
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
                                fontSize: 'calc(var(--bar-height) * 0.36)',
                                color: 'var(--global-white)',
                                position: 'relative',
                                top: '1px',
                            }}
                        />
                    </div>
                    <Link
                        href={'/wishlist'}
                    >
                        <div
                            className={styles.iconContainer}
                        >
                            <FavoriteBorderRoundedIcon
                                style={{
                                    fontSize: 'calc(var(--bar-height) * 0.36)',
                                    color: 'var(--global-white)',
                                    position: 'relative',
                                    top: '1px',
                                }}
                            />
                        </div>
                    </Link>
                    <CartIcon
                        session={session}
                        cart={cart}
                        setCart={setCart}
                        userCurrency={userCurrency}
                        supportsHoverAndPointer={supportsHoverAndPointer}
                    />
                    <AvatarMenu
                        session={session}
                        logout={logout}
                        supportsHoverAndPointer={supportsHoverAndPointer}
                    />
                </div>
            </div>
        </div>
    )
}