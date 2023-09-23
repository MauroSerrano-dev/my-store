import React from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import Logo from './Logo';
import SearchBar from './SearchBar';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AvatarMenu from './AvatarMenu';
import CartIcon from './CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { itemsNavBar } from '../../consts';
import { motion } from "framer-motion";
import { MenuToggle } from './MenuToggle';

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
                        <Link legacyBehavior href={'/'}>
                            <a
                                className='fillHeight'
                                aria-label='Home'
                            >
                                <Logo height='100%' />
                            </a>
                        </Link>
                    }
                </div>
                <div
                    className={styles.middle}
                >
                    {mobile
                        ? <Link legacyBehavior href={'/'}>
                            <a
                                className='fillHeight'
                                aria-label='Home'
                            >
                                <Logo height='100%' />
                            </a>
                        </Link>
                        : <SearchBar
                            show={isScrollAtTop}
                            placeholder='What are you looking for?'
                            onChange={handleChangeSearch}
                            onKeyDown={handleKeyDownSearch}
                            onClick={handleClickSearch}
                            value={search}
                            options={productOptions}
                            setOptions={setProductOptions}
                            setSearch={setSearch}
                        />
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
                            {itemsNavBar.map((item, i) =>
                                <Link
                                    key={i}
                                    legacyBehavior
                                    href={`/search?c=${item.value}`}
                                >
                                    <a
                                        aria-label={item.value}
                                        className={`noUnderline fillHeight flex center ${styles.titleLink}`}
                                    >
                                        <p className={styles.title}>
                                            {item.title}
                                        </p>
                                    </a>
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
                    <Link legacyBehavior href={'/wishlist'}>
                        <a
                            aria-label='Wishlist'
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
                        </a>
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