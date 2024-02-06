import { useEffect, useState } from 'react'
import styles from '@/styles/components/buttons-icon/AppAlert.module.css'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function AppAlert() {
    const {
        supportsHoverAndPointer,
        router
    } = useAppContext()

    const tToasts = useTranslation('toasts').t

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(false)
    }, [router])

    function handleOnClick() {
        if (!supportsHoverAndPointer) {
            setOpen(prev => !prev)
        }
    }

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={handleOnClick}
        >
            <div className={styles.alert}>
                <WarningAmberRoundedIcon
                    sx={{
                        fontSize: 'calc(var(--navbar-height) * 0.55)'
                    }}
                />
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
                    <div className={styles.contentVisible}>
                        <ul>
                            {process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === 'true' &&
                                <li>
                                    {tToasts('checkout_temporarily_disabled')}
                                </li>
                            }
                        </ul>
                    </div>
                </motion.div>
            }
        </div>
    )
}