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

const flagMapping = {
    en: 'en',
    es: 'es',
    'pt-BR': 'br',
    'pt-PT': 'pt'
}

export default function LanguageSelector() {
    const {
        router,
        supportsHoverAndPointer,
    } = useAppContext()

    const [open, setOpen] = useState(false)
    const { i18n } = useTranslation()

    function handleClickOption(newLanguage) {
        if (router.locale !== newLanguage) {
            const { pathname, asPath, query } = router
            router.push({ pathname, query }, asPath, { locale: newLanguage, scroll: false })
        }
        setOpen(false)
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
            window.addEventListener('scroll', handleCloseMenuOnScroll);
        }

        return () => {
            if (!supportsHoverAndPointer) {
                window.removeEventListener('scroll', handleCloseMenuOnScroll);
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
                    : <CircleFlag style={{ pointerEvents: 'none' }} countryCode={flagMapping[i18n.language]} height="30" />
                }
            </div>
            {open &&
                <motion.div
                    className={styles.contentContainer}
                    style={{
                        left: -195
                    }}
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
                        <MenuItem onClick={() => handleClickOption('en')}>
                            <ListItemIcon>
                                <LanguageOutlinedIcon style={{ fontSize: 30 }} />
                            </ListItemIcon>
                            {'English'}
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleClickOption('es')}>
                            <ListItemIcon>
                                <CircleFlag countryCode={'es'} height="27" />
                            </ListItemIcon>
                            {'Spanish'}
                        </MenuItem>
                        <MenuItem onClick={() => handleClickOption('pt-BR')}>
                            <ListItemIcon>
                                <CircleFlag countryCode={'br'} height="27" />
                            </ListItemIcon>
                            {'Brazillian Portuguese'}
                        </MenuItem>
                        <MenuItem onClick={() => handleClickOption('pt-PT')}>
                            <ListItemIcon>
                                <CircleFlag countryCode={'pt'} height="27" />
                            </ListItemIcon>
                            {'Portuguese'}
                        </MenuItem>
                    </div>
                </motion.div>
            }
        </button>
    )
}