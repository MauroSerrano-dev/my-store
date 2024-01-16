import styles from '@/styles/components/PosAddToCartModal.module.css'
import { motion } from "framer-motion";
import MyButton from './material-ui/MyButton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DONT_SHOW_POS_ADD } from '@/consts';
import { useAppContext } from './contexts/AppContext';
import { updateUser } from '../../frontend/user';
import { useTranslation } from 'next-i18next'

export default function PosAddToCartModal(props) {
    const {
        open = false,
        close,
    } = props

    const {
        session,
    } = useAppContext()

    const tCommon = useTranslation('common').t

    const [show, setShow] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        session
            ? setDontShowAgain(session.preferences.includes(DONT_SHOW_POS_ADD))
            : setDontShowAgain(localStorage.getItem(DONT_SHOW_POS_ADD))
    }, [session])

    useEffect(() => {
        if (open)
            setShow(true)
        else
            setTimeout(() => setShow(false), 300)
    }, [open])

    function handleDontShowAgain() {
        close()
        setTimeout(() => {
            setDontShowAgain(true)
        }, 300)
        if (session)
            updateUser(session.id, { preferences: [...session.preferences, DONT_SHOW_POS_ADD] })
        localStorage.setItem(DONT_SHOW_POS_ADD, 'true')
    }

    return (
        !dontShowAgain && show &&
        <motion.div
            className={styles.container}
        >
            <motion.div
                className={styles.background}
                onClick={close}
                initial='hidden'
                animate={open ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        opacity: 0,
                    },
                    visible: {
                        opacity: 1,
                    }
                }}
            >
            </motion.div>
            <motion.div
                className={styles.body}
                initial='hidden'
                animate={open ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        transform: 'translateY(170px)'
                    },
                    visible: {
                        transform: 'translateY(0px)'
                    }
                }}
            >
                <div className={styles.inner}>
                    <Link
                        className='fillWidth noUnderline'
                        href='/cart'
                    >
                        <MyButton
                            className='fillWidth'
                            size='large'
                        >
                            {tCommon('go_to_cart')}
                        </MyButton>
                    </Link>
                    <MyButton
                        size='large'
                        variant='outlined'
                        onClick={close}
                    >
                        {tCommon('continue_shopping')}
                    </MyButton>
                    <MyButton
                        size='large'
                        variant='text'
                        color='error'
                        onClick={handleDontShowAgain}
                    >
                        {tCommon('dont_show_again')}
                    </MyButton>
                </div>
            </motion.div>
        </motion.div>
    )
}