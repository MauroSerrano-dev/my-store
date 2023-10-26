import styles from '../styles/components/MenuFilter.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SlClose } from "react-icons/sl";
import { PRODUCT_TYPES, SEARCH_PRODUCT_COLORS, SEARCH_ART_COLORS, SEARCH_FILTERS } from '../../consts';
import ColorButton from './ColorButton';

export default function MenuFilter(props) {
    const {
        show = false,
        open = false,
        onClose,
        getQueries,
        router,
        handleMultiSelection,
        handleThemesSelect,
        supportsHoverAndPointer,
    } = props

    const {
        s,
        t,
        h,
        c,
        min,
        max,
        order = min || max ? 'lowest-price' : 'popularity',
        cl,
        ac,
        v,
        p = '1',
        limit = '60',
    } = props.router.query

    const [searchFocus, setSearchFocus] = useState(false)

    useEffect(() => {
        if (open) {
            document.documentElement.style.overflowY = "hidden"
            document.body.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }

        return () => {
            document.documentElement.style.overflowY = "auto"
            document.body.style.overflowY = "auto"
        }
    }, [open])

    return (
        show &&
        <motion.div
            className={styles.filtersContainer}
        >
            <motion.div
                className={styles.filtersBackground}
                onClick={onClose}
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
                className={styles.filtersBody}
                initial='hidden'
                animate={open ? 'visible' : 'hidden'}
                variants={{
                    hidden: {
                        bottom: '-100%',
                        height: '65%',
                    },
                    visible: {
                        height: searchFocus ? '100%' : '65%',
                        bottom: searchFocus ? '0%' : '-35%',
                    }
                }}
            >
                <div className={styles.inner}>
                    <div
                        className='flex center row'
                        style={{
                            paddingTop: 10,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                paddingRight: 20,
                            }}
                        >
                            <input
                                onFocus={() => setSearchFocus(true)}
                                onBlur={() => setSearchFocus(false)}
                                style={{
                                    width: '100%'
                                }}
                            />
                        </div>
                        <button
                            className='flex center buttonInvisible'
                        >
                            <SlClose
                                onClick={onClose}
                                color='#ffffff'
                                className='noSelection'
                                style={{
                                    fontSize: '21px',
                                    cursor: 'pointer',
                                    color: 'var(--global-black)',
                                }}
                            />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <h3>Products</h3>
                        <div className={styles.options}>
                            {PRODUCT_TYPES.map((type, i) =>
                                <button
                                    className={styles.option}
                                    style={{
                                        backgroundColor: v?.includes(type.id) ? 'var(--primary)' : 'var(--filter-tag-color)'
                                    }}
                                    onClick={() => handleMultiSelection('v', v, !v?.includes(type.id), type.id)}
                                    key={i}
                                >
                                    {type.title}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>{SEARCH_FILTERS.categories.title}</h3>
                        <div className={styles.options}>
                            {SEARCH_FILTERS.categories.options.map((cat, i) =>
                                <button
                                    className={styles.option}
                                    style={{
                                        backgroundColor: h?.includes(cat.id) ? 'red' : 'black'
                                    }}
                                    onClick={() => handleThemesSelect(!h?.includes(cat.id), cat.id)}
                                    key={i}
                                >
                                    {cat.title}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>{SEARCH_FILTERS['most-searched'].title}</h3>
                        <div className={styles.options}>
                            {SEARCH_FILTERS['most-searched'].options.map((cat, i) =>
                                <button
                                    className={styles.option}
                                    style={{
                                        backgroundColor: t?.includes(cat.id) ? 'red' : 'black'
                                    }}
                                    onClick={() => handleMultiSelection('t', t, !t?.includes(cat.id), cat.id)}
                                    key={i}
                                >
                                    {cat.title}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>Product Color</h3>
                        <div className={styles.options}>
                            {SEARCH_PRODUCT_COLORS.map((color, i) =>
                                <Link
                                    scroll={false}
                                    href={{
                                        pathname: router.pathname,
                                        query: color.color_display.id_string === cl
                                            ? getQueries({}, ['cl'])
                                            : getQueries({ cl: color.color_display.id_string })
                                    }}
                                    key={i}
                                >
                                    <ColorButton
                                        selected={cl === color.color_display.id_string}
                                        color={{ title: color.color_display.title, colors: [color.color_display.color] }}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>Art Color</h3>
                        <div className={styles.options}>
                            {SEARCH_ART_COLORS.map((color, i) =>
                                <Link
                                    scroll={false}
                                    href={{
                                        pathname: router.pathname,
                                        query: color.color_display.id_string === ac
                                            ? getQueries({}, ['ac'])
                                            : getQueries({ ac: color.color_display.id_string })
                                    }}
                                    key={i}
                                >
                                    <ColorButton
                                        selected={ac === color.color_display.id_string}
                                        color={{ title: color.color_display.title, colors: [color.color_display.color] }}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}