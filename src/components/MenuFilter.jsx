import styles from '@/styles/components/MenuFilter.module.css'
import { motion } from "framer-motion";
import Link from 'next/link';
import { useEffect } from 'react';
import { SlClose } from "react-icons/sl";
import { PRODUCTS_TYPES, SEARCH_PRODUCT_COLORS, SEARCH_ART_COLORS, SEARCH_FILTERS, CURRENCIES } from '@/consts';
import ColorButton from './ColorButton';
import { useAppContext } from './contexts/AppContext';
import { useTranslation } from 'next-i18next';

export default function MenuFilter(props) {
    const {
        show = false,
        open = false,
        onClose,
        getQueries,
        handleMultiSelection,
    } = props

    const {
        router,
        userCurrency,
    } = useAppContext()

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
    } = router.query

    const tSearch = useTranslation('search').t
    const tCategories = useTranslation('categories').t

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
                        height: '65%',
                        bottom: '-35%',
                    }
                }}
            >
                <div className={styles.inner}>
                    <button
                        className='buttonInvisible'
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 10,
                        }}
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
                    {SEARCH_FILTERS.map((filter, i) =>
                        <div
                            className={styles.section}
                            key={i}
                        >
                            <h3>{tSearch(filter.id)}</h3>
                            <div className={styles.options}>
                                {filter.options.map((option, i) =>
                                    <button
                                        className={`${styles.option} ${router.query[filter.query]?.split(' ').includes(option) ? styles.optionActive : ''}`}
                                        onClick={() => handleMultiSelection(filter.query, router.query[filter.query], !router.query[filter.query]?.split(' ').includes(option), option)}
                                        key={i}
                                    >
                                        {tCategories(option)}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={styles.section}>
                        <h3>Product Color</h3>
                        <div className={styles.options}>
                            {SEARCH_PRODUCT_COLORS.map((color, i) =>
                                <ColorButton
                                    key={i}
                                    selected={cl === color.color_display.id_string}
                                    color={{ title: color.color_display.title, colors: [color.color_display.color] }}
                                    onClick={() =>
                                        router.push({
                                            pathname: router.pathname,
                                            query: color.color_display.id_string === cl
                                                ? getQueries({}, ['cl'])
                                                : getQueries({ cl: color.color_display.id_string })
                                        }, undefined, { scroll: false })
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>Art Color</h3>
                        <div className={styles.options}>
                            {SEARCH_ART_COLORS.map((color, i) =>
                                <ColorButton
                                    key={i}
                                    selected={ac === color.color_display.id_string}
                                    color={{ title: color.color_display.title, colors: [color.color_display.color] }}
                                    onClick={() =>
                                        router.push({
                                            pathname: router.pathname,
                                            query: color.color_display.id_string === ac
                                                ? getQueries({}, ['ac'])
                                                : getQueries({ ac: color.color_display.id_string })
                                        }, undefined, { scroll: false })
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h3>{tSearch('price')}</h3>
                        <div className={styles.options}>
                            <button
                                className={`${styles.option} ${!min && !max ? styles.optionActive : ''}`}
                                onClick={() => {
                                    if (min || max) {
                                        router.push({
                                            pathname: router.pathname,
                                            query: getQueries({}, ['min', 'max'])
                                        }, undefined, { scroll: false })
                                    }
                                }}
                            >
                                {tSearch('any-price')}
                            </button>
                            {userCurrency && CURRENCIES[userCurrency.code].search_options.map((option, i) =>
                                <button
                                    key={i}
                                    onClick={() =>
                                        router.push({
                                            pathname: router.pathname,
                                            query: option.min === min && option.max === max
                                                ? getQueries({}, ['min', 'max'])
                                                : getQueries(option, ['min', 'max'].filter(ele => !Object.keys(option).includes(ele)))
                                        }, undefined, { scroll: false })
                                    }
                                    className={`${styles.option} ${option.min === min && option.max === max ? styles.optionActive : ''}`}

                                >
                                    {!option.min && option.max
                                        ? tSearch('up-to', { currencySymbol: userCurrency?.symbol, max: option.max })
                                        : option.min && option.max
                                            ? tSearch('to', { currencySymbol: userCurrency?.symbol, min: option.min, max: option.max })
                                            : tSearch('above', { currencySymbol: userCurrency?.symbol, min: option.min })
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}