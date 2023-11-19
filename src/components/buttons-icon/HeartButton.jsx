import styles from '@/styles/components/buttons-icon/HeartButton.module.css'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'

const circles = [
    { x: '-350%', y: '-50%' },
    { x: '250%', y: '-50%' },
    { x: '-50%', y: '-350%' },
    { x: '-50%', y: '250%' },
    { x: '-280%', y: '-280%' },
    { x: '180%', y: '-280%' },
    { x: '180%', y: '180%' },
    { x: '-280%', y: '180%' },
]

export default function HeartButton(props) {
    const {
        color = '#fe251b',
        checked,
        onClick,
    } = props

    const [stateBalls, setStateBalls] = useState(false)
    const [allowChange, setAllowChange] = useState(false)

    const size = 35

    useEffect(() => {
        setTimeout(() => {
            setStateBalls(!checked)
        }, 100)
        setTimeout(() => {
            setAllowChange(true)
        }, 200)
    }, [checked])

    return (
        <motion.div
            className={styles.container}
            onClick={onClick}
            style={{
                width: size,
                height: size,
            }}
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
            <motion.div
                initial='off'
                animate={
                    checked
                        ? 'on'
                        : 'off'
                }
                variants={{
                    on: {
                        scale: 1,
                        transition: {
                            duration: allowChange ? 0.3 : 0,
                            ease: [0, .18, 0, 2],
                        }
                    },
                    off: {
                        scale: 0,
                        transition: {
                            duration: allowChange ? 0.3 : 0,
                            ease: [1, 0, 0, 1],
                        }
                    },
                }}
                style={{
                    position: 'absolute',
                }}
            >
                <FavoriteRoundedIcon
                    style={{
                        fontSize: size,
                        color: color,
                    }}
                />
            </motion.div>
            {allowChange && circles.map((circle, i) =>
                <motion.div
                    key={i}
                    className={styles.circle}
                    style={{
                        left: '50%',
                        top: '50%',
                        width: size / 5,
                        height: size / 5,
                    }}
                    initial='off'
                    animate={
                        checked
                            ? 'on'
                            : 'off'
                    }
                    variants={{
                        on: {
                            transform: `translateX(${circle.x}) translateY(${circle.y})`,
                            transition: {
                                duration: allowChange ? 0.3 : 0,
                                ease: [0, .18, 0, 2],
                            }
                        },
                        off: {
                            transform: 'translateX(-50%) translateY(-50%)',
                            transition: {
                                duration: allowChange ? 0.3 : 0,
                                ease: [1, 0, .95, .21],
                            }
                        },
                    }}
                >
                    <motion.div
                        className={styles.circleInner}
                        style={{
                            backgroundColor: color
                        }}
                        initial='off'
                        animate={
                            checked && stateBalls
                                ? 'on'
                                : 'off'
                        }
                        variants={{
                            on: {
                                width: '100%',
                                height: '100%',
                                transition: {
                                    duration: allowChange ? 0.3 : 0,
                                    ease: [0, .18, 0, 1.5],
                                }
                            },
                            off: {
                                width: '0%',
                                height: '0%',
                                transition: {
                                    duration: allowChange ? 0.3 : 0,
                                    ease: 'easeIn',
                                }
                            },
                        }}
                    >
                    </motion.div>
                </motion.div>
            )}
            <FavoriteBorderRoundedIcon
                style={{
                    fontSize: size,
                }}
            />
        </motion.div>
    )
}