import Link from 'next/link'
import styles from '@/styles/components/NavBar.module.css'
import Logo from './svgs/Logo';
import SearchBar from './SearchBar';
import AvatarMenu from './buttons-icon/AvatarMenu';
import CartIcon from './buttons-icon/CartIcon';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { NAVBAR_ITEMS } from '@/consts';
import { motion } from "framer-motion";
import { MenuToggle } from './MenuToggle';
import { useTranslation } from 'next-i18next';
import { useAppContext } from './contexts/AppContext';
import LanguageSelector from './buttons-icon/LanguageSelector';
import AppAlert from './buttons-icon/AppAlert';
import { SHOW_APP_ALERT } from '@/utils/app-controller';

export default function NavBar(props) {
    const {
        isScrollAtTop,
        setIsScrollAtTop,
        handleChangeSearch,
        setProductOptions,
        handleClickSearch,
        handleKeyDownSearch,
        menuOpen,
        switchMenu,
        adminMode,
        setAdminMenuOpen,
        adminMenuOpen
    } = props

    const {
        mobile,
        authValidated,
    } = useAppContext()

    const tNavbar = useTranslation('navbar').t
    const tCategories = useTranslation('categories').t

    return (
        <div className={styles.container}>
            <div
                className={styles.bodyContainer}
            >
                <div className={styles.leftSide}>
                    {adminMode
                        ? <motion.div
                            initial={false}
                            animate={adminMenuOpen ? "open" : "closed"}
                        >
                            <MenuToggle
                                toggle={() => setAdminMenuOpen(prev => !prev)}
                            />
                        </motion.div>
                        : <motion.div
                            initial={false}
                            animate={menuOpen ? "open" : "closed"}
                        >
                            <MenuToggle
                                toggle={() => switchMenu()}
                            />
                        </motion.div>
                    }
                    {!mobile &&
                        (SHOW_APP_ALERT
                            ? <AppAlert />
                            : <Link
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
                        )
                    }
                </div>
                <div
                    className={styles.middle}
                >
                    {adminMode
                        ? <div></div>
                        : mobile
                            ? (SHOW_APP_ALERT
                                ? <AppAlert />
                                : <Link
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
                            )
                            : <SearchBar
                                show={isScrollAtTop}
                                placeholder={tNavbar('search_bar_placeholder')}
                                onChange={handleChangeSearch}
                                onKeyDown={handleKeyDownSearch}
                                onClick={handleClickSearch}
                                setOptions={setProductOptions}
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
                            {NAVBAR_ITEMS.map((option, i) =>
                                <Link
                                    key={i}
                                    href={`/search?${option.query}=${option.id}`}
                                    aria-label={option.id}
                                    className={`noUnderline fillHeight flex center ${styles.titleLink}`}
                                >
                                    <p className={styles.title}>
                                        {tCategories(option.id).toUpperCase()}
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
                    <LanguageSelector />
                    {!adminMode &&
                        <CartIcon />
                    }
                    <AvatarMenu />
                </div>
            </div>
        </div>
    )
}