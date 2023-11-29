import Link from 'next/link'
import styles from '@/styles/components/NavBar.module.css'
import Logo from './svgs/Logo';
import SearchBar from './SearchBar';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AvatarMenu from './buttons-icon/AvatarMenu';
import CartIcon from './buttons-icon/CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { itemsNavBar } from '@/consts';
import { motion } from "framer-motion";
import { MenuToggle } from './MenuToggle';
import { useTranslation } from 'next-i18next';
import { useAppContext } from './contexts/AppContext';

export default function NavBar(props) {
    const {
        isScrollAtTop,
        setIsScrollAtTop,
        search,
        productOptions,
        handleChangeSearch,
        setProductOptions,
        handleClickSearch,
        handleKeyDownSearch,
        setSearch,
        menuOpen,
        switchMenu,
        adminMode
    } = props

    const {
        mobile,
        auth,
        authValidated,
    } = useAppContext()

    const tNavbar = useTranslation('navbar').t

    return (
        <div className={styles.container}>
            <div
                className={styles.bodyContainer}
            >
                <div className={styles.leftSide}>
                    {!adminMode &&
                        <motion.div
                            initial={false}
                            animate={menuOpen ? "open" : "closed"}
                        >
                            <MenuToggle
                                toggle={() => switchMenu()}
                            />
                        </motion.div>
                    }
                    {!mobile &&
                        <Link
                            href={'/'}
                            className='fillHeight'
                            aria-label='Home'
                            style={{
                                height: '70%',
                                paddingTop: '0.4rem',
                            }}
                        >
                            <Logo height='100%' />
                        </Link>
                    }
                </div>
                <div
                    className={styles.middle}
                >
                    {adminMode
                        ? <div></div>
                        : mobile
                            ? <Link
                                href={'/'}
                                className='fillHeight flex center'
                                aria-label='Home'
                                style={{
                                    width: '70px',
                                    height: '100%',
                                    paddingTop: '0.7rem',
                                }}
                            >
                                <Logo width='100%' />
                            </Link>
                            : <SearchBar
                                show={isScrollAtTop}
                                placeholder={tNavbar('search_bar_placeholder')}
                                onChange={handleChangeSearch}
                                onKeyDown={handleKeyDownSearch}
                                onClick={handleClickSearch}
                                value={search}
                                options={productOptions}
                                setOptions={setProductOptions}
                                setSearch={setSearch}
                            />
                    }
                    {!adminMode && !mobile &&
                        <div
                            className={styles.categoriesContainer}
                            style={{
                                bottom: isScrollAtTop
                                    ? '-39px'
                                    : '22px',
                                width: isScrollAtTop
                                    ? '120%'
                                    : '100%',
                            }}
                        >
                            {itemsNavBar.map((item, i) =>
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
                <div
                    className={styles.rightSide}
                    style={{
                        opacity: authValidated ? 1 : 0,
                        pointerEvents: authValidated ? 'auto' : 'none',
                        transition: 'opacity ease-in-out 300ms',
                    }}
                >
                    {!adminMode && !isScrollAtTop &&
                        <motion.div
                            className={styles.iconContainer}
                            onClick={() => setIsScrollAtTop(true)}
                            initial='hidden'
                            animate='visible'
                            variants={{
                                hidden: {
                                    opacity: 0
                                },
                                visible: {
                                    opacity: 1
                                }
                            }}
                        >
                            <SearchRoundedIcon
                                style={{
                                    fontSize: 'calc(var(--navbar-height) * 0.36)',
                                    color: 'var(--global-white)',
                                    position: 'relative',
                                    top: '1px',
                                }}
                            />
                        </motion.div>
                    }
                    {!adminMode && auth?.currentUser &&
                        <Link
                            href={'/wishlist'}
                        >
                            <motion.div
                                className={styles.iconContainer}
                                initial='hidden'
                                animate='visible'
                                variants={{
                                    hidden: {
                                        opacity: 0
                                    },
                                    visible: {
                                        opacity: 1
                                    }
                                }}
                            >
                                <FavoriteBorderRoundedIcon
                                    style={{
                                        fontSize: 'calc(var(--navbar-height) * 0.36)',
                                        color: 'var(--global-white)',
                                        position: 'relative',
                                        top: '1px',
                                    }}
                                />
                            </motion.div>
                        </Link>
                    }
                    {!adminMode &&
                        <CartIcon />
                    }
                    <AvatarMenu />
                </div>
            </div>
        </div>
    )
}