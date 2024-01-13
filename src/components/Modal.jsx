import { useEffect, useState } from 'react'
import styles from '../styles/components/Modal.module.css'
import { motion } from "framer-motion"

export default function Modal(props) {
    const {
        closeModal,
        children,
        className,
        open,
        duration = 300,
        closedCallBack
    } = props

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpacity, setModalOpacity] = useState(false)

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener('resize', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        open
            ? handleOpenModal()
            : handleCloseModal()
    }, [open])

    function handleOpenModal() {
        if (!modalOpen) {
            setModalOpen(true)
            setModalOpacity(true)
        }
    }

    function handleCloseModal() {
        if (modalOpen) {
            setModalOpacity(false)
            setTimeout(() => {
                setModalOpen(false)
                if (closedCallBack)
                    closedCallBack()
            }, duration)
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault()
            closeModal()
            event.target.blur()
        }
    }

    return (modalOpen &&
        <motion.div
            className={styles.container}
            initial='hidden'
            animate={modalOpacity ? 'visible' : 'hidden'}
            variants={{
                hidden: {
                    opacity: 0,
                },
                visible: {
                    opacity: 1,
                }
            }}
            transition={{
                duration: duration / 1000,
                ease: [.62, -0.18, .32, 1.17]
            }}
        >
            <div
                className={styles.background}
                onClick={closeModal}
            >
            </div>
            <motion.div
                className={styles.modal}
                initial='hidden'
                animate={modalOpacity ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        scale: 0.8,
                        opacity: 0,
                    },
                    visible: {
                        scale: modalOpacity ? 1 : 0.8,
                        opacity: modalOpacity ? 1 : 0,
                    }
                }}
                transition={{
                    duration: duration / 1000,
                    ease: [.37, .01, 0, 1.02]
                }}
            >
                <div className={className}>
                    {children}
                </div>
            </motion.div>
        </motion.div>
    )
}
