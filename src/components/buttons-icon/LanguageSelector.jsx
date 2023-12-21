import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import styles from '@/styles/components/buttons-icon/LanguageSelector.module.css'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import { CircleFlag } from 'react-circle-flags'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import { languageToCountry } from '@/consts'

export default function LanguageSelector() {
    const {
        router,
        supportsHoverAndPointer,
    } = useAppContext()

    const [open, setOpen] = useState(false)
    const { i18n } = useTranslation()
    const tLanguages = useTranslation('languages').t

    function handleClickOption(newLanguage) {
        if (router.locale !== newLanguage) {
            const { pathname, asPath, query } = router
            router.push({ pathname, query }, asPath, { locale: newLanguage, scroll: false })
        }
    }

    function handleMouseEnter() {
        if (supportsHoverAndPointer) {
            setOpen(true)
        }
    }

    function handleMouseLeave() {
        setOpen(false)
    }

    function handleOnClick() {
        if (!supportsHoverAndPointer) {
            setOpen(prev => !prev)
        }
    }

    useEffect(() => {
        setOpen(false)
    }, [router])

    useEffect(() => {
        function handleCloseMenuOnScroll() {
            setOpen(false)
        }

        if (!supportsHoverAndPointer) {
            window.addEventListener('scroll', handleCloseMenuOnScroll)
        }

        return () => {
            if (!supportsHoverAndPointer) {
                window.removeEventListener('scroll', handleCloseMenuOnScroll)
            }
        }
    }, [supportsHoverAndPointer])

    return (
        <button
            className={`${styles.container} buttonInvisible`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleOnClick}
            style={{
                backgroundColor: open ? 'rgba(0, 0, 0, 0.15)' : 'transparent'
            }}
        >
            <div
                className={`${styles.iconContainer} flex center`}
            >
                {i18n.language === 'en'
                    ? <LanguageOutlinedIcon style={{ fontSize: 30 }} />
                    : <CircleFlag style={{ pointerEvents: 'none' }} countryCode={languageToCountry[i18n.language]} height="30" />
                }
            </div>
            {open &&
                <motion.div
                    className={styles.contentContainer}
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                        }
                    }}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div
                        className={styles.session}
                        style={{
                            minWidth: 165,
                        }}
                    >
                        <MenuItem
                            onClick={() => handleClickOption('en')}
                            style={{
                                backgroundColor: i18n.language === 'en' ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent',
                                color: i18n.language === 'en' ? '#000000' : undefined,
                            }}
                        >
                            <ListItemIcon>
                                <LanguageOutlinedIcon style={{ fontSize: 30 }} />
                            </ListItemIcon>
                            {tLanguages('en')}
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => handleClickOption('es')}
                            style={{
                                backgroundColor: i18n.language === 'es' ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent',
                                color: i18n.language === 'es' ? '#000000' : undefined,
                            }}
                        >
                            <ListItemIcon>
                                <CircleFlag countryCode={'es'} height="27" />
                            </ListItemIcon>
                            {tLanguages('es')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleClickOption('pt-BR')}
                            style={{
                                backgroundColor: i18n.language === 'pt-BR' ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent',
                                color: i18n.language === 'pt-BR' ? '#000000' : undefined,
                            }}
                        >
                            <ListItemIcon>
                                <CircleFlag countryCode={'br'} height="27" />
                            </ListItemIcon>
                            {tLanguages('pt-BR')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleClickOption('pt')}
                            style={{
                                backgroundColor: i18n.language === 'pt' ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent',
                                color: i18n.language === 'pt' ? '#000000' : undefined,
                            }}
                        >
                            <ListItemIcon>
                                <CircleFlag countryCode={'pt'} height="27" />
                            </ListItemIcon>
                            {tLanguages('pt')}
                        </MenuItem>
                    </div>
                </motion.div>
            }
        </button>
    )
}