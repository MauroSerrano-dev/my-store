import { useEffect, useState } from 'react'
import styles from '../styles/components/Modal.module.css'
import { motion } from "framer-motion"

export default function Modal(props) {
    const {
        closeModal,
        showModalOpacity,
        children,
        className
    } = props

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener('resize', handleKeyDown)
        }
    }, [])

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault()
            closeModal()
            event.target.blur()
        }
    }

    return (
        <motion.div
            className={styles.container}
            initial='hidden'
            animate={showModalOpacity ? 'visible' : 'hidden'}
            variants={{
                hidden: {
                    opacity: 0,
                },
                visible: {
                    opacity: 1,
                }
            }}
            transition={{
                duration: showModalOpacity
                    ? 0.3
                    : 0.3,
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
                animate={showModalOpacity ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        scale: 0.8,
                        opacity: 0,
                    },
                    visible: {
                        scale: showModalOpacity ? 1 : 0.8,
                        opacity: showModalOpacity ? 1 : 0,
                    }
                }}
                transition={{
                    duration: showModalOpacity
                        ? 0.3
                        : 0.3,
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
