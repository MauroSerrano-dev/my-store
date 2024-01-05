import { withRouter } from 'next/router'
import styles from '@/styles/pages/search.module.css'
import { useEffect, useRef, useState } from 'react'
import Product from '@/components/products/Product'
import Link from 'next/link'
import Selector from '@/components/material-ui/Selector'
import { Checkbox, FormControlLabel, Pagination, PaginationItem } from '@mui/material'
import Footer from '@/components/Footer'
import { SEARCH_PRODUCT_COLORS, SEARCH_ART_COLORS, SEARCH_FILTERS, COMMON_TRANSLATES, LIMITS, PRODUCTS_TYPES, CURRENCIES } from '@/consts'
import ColorButton from '@/components/ColorButton'
import Tag from '@/components/material-ui/Tag'
import CircleIcon from '@mui/icons-material/Circle';
import ProductSkeleton from '@/components/products/ProductSkeleton'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuFilter from '@/components/MenuFilter'
import lottie from 'lottie-web';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { useAppContext } from '@/components/contexts/AppContext'
import { showToast } from '@/utils/toasts'
const { v4: uuidv4 } = require('uuid')

const QUERIES = {
    h: { title: 'categories', show: true, showTitle: false, isFilter: true },
    min: { title: 'min', show: true, showTitle: true, isFilter: true },
    max: { title: 'max', show: true, showTitle: true, isFilter: true },
    order: { title: 'order by', show: false, showTitle: false, isFilter: false },
    c: { title: 'collection', show: true, showTitle: true, isFilter: true },
    t: { title: 'tags', show: true, showTitle: false, isFilter: true },
    v: { title: 'type', show: true, showTitle: false, isFilter: true },
    cl: { title: 'product color', show: true, showTitle: false, isFilter: true },
    ac: { title: 'art color', show: true, showTitle: false, isFilter: true },
    p: { title: 'page', show: false, showTitle: false, isFilter: false },
    s: { title: 'search', show: false, showTitle: false, isFilter: true },
    l: { title: 'language', show: false, showTitle: false, isFilter: false },
    limit: { title: 'limit', show: false, showTitle: false, isFilter: false },
}

export default withRouter(() => {

    const {
        router,
        supportsHoverAndPointer,
        userCurrency,
        windowWidth,
    } = useAppContext()

    const {
        i,
        s,
        t,
        h,
        y,
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

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t
    const tSearch = useTranslation('search').t
    const tCategories = useTranslation('categories').t

    const mobile = windowWidth <= 700

    const [products, setProducts] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const [productsKey, setProductsKey] = useState(0)
    const [lastPage, setLastPage] = useState()
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [filtersOpenDelay, setFiltersOpenDelay] = useState(false)
    const [minInput, setMinInput] = useState('')
    const [maxInput, setMaxInput] = useState('')
    const [toastActive, setToastActive] = useState(false)

    const productsContainer = useRef(null)

    useEffect(() => {
        if (router.isReady && userCurrency)
            getProductsByQuery()
    }, [router, userCurrency])

    useEffect(() => {
        function handleResize() {
            const containerWidth = productsContainer.current.offsetWidth

            if (!mobile) {
                setFiltersOpen(false)
                setFiltersOpenDelay(false)
            }

            if (containerWidth > 900)
                setProductWidth((containerWidth - 16 * 5) / 5)
            else if (containerWidth > 700)
                setProductWidth((containerWidth - 16 * 4) / 4)
            else if (containerWidth > 500)
                setProductWidth((containerWidth - 16 * 3) / 3)
            else
                setProductWidth((containerWidth - 16 * 2) / 2)
        }

        if (windowWidth) {
            handleResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [windowWidth])

    function getProductsByQuery() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            }
        }
        if (limit)
            options.headers.limit = limit
        if (i18n.language)
            options.headers.user_language = i18n.language
        if (p)
            options.headers.p = p
        if (i)
            options.headers.i = i
        if (s)
            options.headers.s = s
        if (t)
            options.headers.t = t
        if (h)
            options.headers.h = h
        if (y)
            options.headers.y = y
        if (v)
            options.headers.v = v
        if (c)
            options.headers.c = c
        if (cl)
            options.headers.cl = cl
        if (ac)
            options.headers.ac = ac
        if (min)
            options.headers.min = Number(min / userCurrency.rate)
        if (max)
            options.headers.max = Number(max / userCurrency.rate)
        if (order)
            options.headers.order = order

        fetch("/api/products-by-queries", options)
            .then(response => response.json())
            .then(response => {
                setProducts(response.products)
                setLastPage(response.last_page)
                setProductsKey(uuidv4())
            })
            .catch(err => console.error(err))
    }

    function getQueries(newQueries, deleteQueries) {
        const oldQueries = { ...router.query }
        if (deleteQueries) {
            for (let i = 0; i < deleteQueries.length; i++) {
                delete oldQueries[deleteQueries[i]]
            }
        }
        return ({ ...oldQueries, ...newQueries })
    }

    function handleChangeOrder(newOrder) {
        router.push({
            pathname: router.pathname,
            query: newOrder === 'popularity'
                ? getQueries({}, ['order'])
                : getQueries({ order: newOrder })
        }, undefined, { scroll: false })
    }

    function handleMultiSelection(queryKey, values, checked, value) {
        const query = values?.split(' ') || []

        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, [queryKey]: query.concat(value).join(' ') }
            }, undefined, { scroll: false })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: query.length === 1
                    ? getQueries({}, [queryKey])
                    : { ...router.query, [queryKey]: query.filter(theme => theme !== value).join(' ') }
            }, undefined, { scroll: false })
        }
    }

    function handleDeleteTag(queryName, value) {
        router.push({
            pathname: router.pathname,
            query: router.query[queryName].split(' ').length === 1
                ? getQueries({}, [queryName])
                : { ...router.query, [queryName]: router.query[queryName].split(' ').filter(queryValue => queryValue !== value).join(' ') }
        }, undefined, { scroll: false })
    }

    function handleCloseFilter() {
        setFiltersOpen(false)
        setTimeout(() =>
            setFiltersOpenDelay(false)
            , 350)
    }

    function handleOpenFilter() {
        setFiltersOpen(true)
        setFiltersOpenDelay(true)
    }

    const animationContainer = useRef(null)

    useEffect(() => {
        let animation
        if (animationContainer.current) {
            animation = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('@/utils/animations/animationNoProducts.json'),
            })
        }

        return () => {
            if (animation)
                animation.destroy();
        }
    }, [products])

    function handleChangeMinMax(value, field) {
        if (value.length > LIMITS.input_min_max) {
            if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
            return
        }
        if (field === 'min')
            setMinInput(value)
        if (field === 'max')
            setMaxInput(value)
    }

    return (
        <div className='fillWidth'>
            <main className={styles.main}>
                {!mobile &&
                    <div className={styles.menuFilters}>
                        {SEARCH_FILTERS.map((filter, i) =>
                            <div
                                className={styles.filterBlock}
                                key={i}
                            >
                                <h3>{tSearch(filter.id)}</h3>
                                {filter.options.map((option, i) =>
                                    <FormControlLabel
                                        name={option}
                                        label={tCategories(option)}
                                        key={i}
                                        sx={{
                                            marginTop: -0.6,
                                            marginBottom: -0.6,
                                        }}
                                        control={
                                            <Checkbox
                                                checked={(router.query[filter.query]?.split(' ') || []).includes(option)}
                                                onChange={e => handleMultiSelection(filter.query, router.query[filter.query], e.target.checked, option)}
                                                sx={{
                                                    color: '#ffffff'
                                                }}
                                            />
                                        }
                                    />
                                )}
                            </div>
                        )}
                        <div className={styles.filterBlock}>
                            <h3>{tSearch('product-color')}</h3>
                            <div className={styles.colorsContainer}>
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
                                            color={{ id_string: color.color_display.id_string, colors: [color.color_display.color] }}
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className={styles.filterBlock}>
                            <h3>{tSearch('art-color')}</h3>
                            <div className={styles.colorsContainer}>
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
                                            color={{ id_string: color.color_display.id_string, colors: [color.color_display.color] }}
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className={styles.filterBlock}>
                            <h3>{tSearch('price')}</h3>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({}, ['min', 'max'])
                                }}
                                scroll={false}
                                className={`${!min && !max ? styles.optionActive : ''} noUnderline`}
                            >
                                {tSearch('any-price')}
                            </Link>
                            {userCurrency && CURRENCIES[userCurrency.code].search_options.map((option, i) =>
                                <Link
                                    key={i}
                                    href={{
                                        pathname: router.pathname,
                                        query: getQueries(option, ['max', 'min'].filter(ele => !Object.keys(option).includes(ele)))
                                    }}
                                    scroll={false}
                                    className={`${option.min === min && option.max === max ? styles.optionActive : ''} noUnderline`}
                                >
                                    {!option.min && option.max
                                        ? tSearch('up-to', { currencySymbol: userCurrency?.symbol, max: option.max })
                                        : option.min && option.max
                                            ? tSearch('to', { currencySymbol: userCurrency?.symbol, min: option.min, max: option.max })
                                            : tSearch('above', { currencySymbol: userCurrency?.symbol, min: option.min })
                                    }
                                </Link>
                            )}
                            <div className={styles.priceFilterInputs}>
                                <div className={styles.minMaxPrefix}>
                                    <span>
                                        {userCurrency?.symbol}
                                    </span>
                                    <input
                                        name='min'
                                        type='number'
                                        placeholder={tSearch('min')}
                                        spellCheck={false}
                                        value={minInput}
                                        onChange={event => handleChangeMinMax(event.target.value, 'min')}
                                        className={styles.minMaxInputs}
                                    />
                                </div>
                                <div className={styles.minMaxPrefix}>
                                    <span>
                                        {userCurrency?.symbol}
                                    </span>
                                    <input
                                        name='max'
                                        type='number'
                                        placeholder={tSearch('max')}
                                        spellCheck={false}
                                        value={maxInput}
                                        onChange={event => handleChangeMinMax(event.target.value, 'max')}
                                        className={styles.minMaxInputs}
                                    />
                                </div>
                                <Link
                                    href={{
                                        pathname: router.pathname,
                                        query: minInput && maxInput
                                            ? getQueries({ min: minInput, max: maxInput })
                                            : minInput
                                                ? getQueries({ min: minInput }, ['max'])
                                                : maxInput
                                                    ? getQueries({ max: maxInput }, ['min'])
                                                    : getQueries({}, ['min', 'max'])
                                    }}
                                    scroll={false}
                                    className='noUnderline fill'
                                >
                                    <button
                                        className={styles.minMaxButton}
                                    >
                                        {tSearch('min-max-button')}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
                <div
                    className={styles.products}
                    style={{
                        width: mobile ? '100%' : 'calc(100% - 300px)',
                    }}
                >
                    <div
                        className={styles.productsHead}
                    >
                        <div
                            className={styles.productsHeadLeft}
                            style={{
                                maxWidth: 'calc(100% - 190px)'
                            }}
                        >
                            {mobile
                                ? <button
                                    className='flex center buttonInvisible'
                                    onClick={() => {
                                        if (filtersOpen)
                                            handleCloseFilter()
                                        else
                                            handleOpenFilter()
                                    }}
                                    style={{
                                        outline: 'none',
                                        fontSize: 20,
                                    }}
                                >
                                    {tSearch('filters', { count: 2 })} <KeyboardArrowDownRoundedIcon style={{ transform: filtersOpen ? 'rotateZ(-180deg)' : 'none', transition: 'ease-in-out 200ms transform' }} />
                                </button>
                                : <h1
                                    style={{
                                        fontSize: mobile ? 20 : 27,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {
                                        Object.keys(router.query).filter(key => QUERIES[key].isFilter).length === 0
                                            ? tSearch('all-products')
                                            : tSearch('filters', { count: Object.keys(router.query).filter(key => QUERIES[key].isFilter).length })
                                    }
                                </h1>
                            }
                            {!mobile &&
                                <div className={styles.tagsContainer}>
                                    {Object.keys(router.query).filter(key => QUERIES[key]?.show).map(key => router.query[key].split(' ').map((value, i) =>
                                        <Tag
                                            key={i}
                                            label={
                                                QUERIES[key].showTitle
                                                    ? <span>{tSearch(QUERIES[key].title)}: {tCategories(value).toLowerCase()}</span>
                                                    : key === 'cl'
                                                        ? <span className='flex row center' style={{ gap: '0.2rem' }}>product: {value} <CircleIcon style={{ color: SEARCH_PRODUCT_COLORS.find(cl => cl.color_display.id_string === value).color_display.color }} /></span>
                                                        : key === 'ac'
                                                            ? <span className='flex row center' style={{ gap: '0.2rem' }}>art: {value} <CircleIcon style={{ color: SEARCH_ART_COLORS.find(cl => cl.color_display.id_string === value).color_display.color }} /></span>
                                                            : tCategories(value).toLowerCase()
                                            }
                                            onDelete={() => handleDeleteTag(key, value)}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <Selector
                            name='order'
                            label={tSearch('order-by')}
                            value={order}
                            options={
                                min || max
                                    ? [
                                        { value: 'lowest-price', name: tSearch('lowest-price') },
                                        { value: 'higher-price', name: tSearch('higher-price') },
                                    ]
                                    : [
                                        { value: 'popularity', name: tSearch('popularity') },
                                        { value: 'newest', name: tSearch('newest') },
                                        { value: 'lowest-price', name: tSearch('lowest-price') },
                                        { value: 'higher-price', name: tSearch('higher-price') },
                                    ]
                            }
                            width={mobile ? '160px' : '190px'}
                            style={{
                                fontSize: mobile ? '13px' : '16px'
                            }}
                            styleLabel={{
                                fontSize: mobile ? '13px' : '16px'
                            }}
                            onChange={(event) => handleChangeOrder(event.target.value)}
                        />
                    </div>
                    <div
                        className={styles.productsBody}
                        ref={productsContainer}
                        style={{
                            rowGap: supportsHoverAndPointer ? 8 : 16,
                        }}
                    >
                        {!products || !router.isReady
                            ? Array(20).fill(null).map((ske, i) =>
                                <ProductSkeleton
                                    key={i}
                                    productWidth={productWidth}
                                />
                            )
                            : products.length === 0
                                ? <div className={styles.noProductsContainer}>
                                    <div
                                        ref={animationContainer}
                                        className={styles.animationContainer}
                                    >
                                    </div>
                                    <h2>{tSearch('No Products Found')}</h2>
                                </div>
                                : products.map(product =>
                                    <Product
                                        key={`${product.id} ${productsKey}`}
                                        product={product}
                                        width={productWidth}
                                        inicialVariantId={product.variants.find(vari => {
                                            if (cl && ac)
                                                return SEARCH_PRODUCT_COLORS.find(scolor => scolor.color_display.id_string === cl)?.colors.some(color => color.id === vari.color_id) && SEARCH_ART_COLORS.find(scolor => scolor.color_display.id_string === ac)?.id === vari.art.color_id
                                            if (cl)
                                                return SEARCH_PRODUCT_COLORS.find(scolor => scolor.color_display.id_string === cl)?.colors.some(color => color.id === vari.color_id)
                                            if (ac) {
                                                return SEARCH_ART_COLORS.find(scolor => scolor.color_display.id_string === ac)?.id === vari.art.color_id
                                            }
                                            return null
                                        })?.id || null}
                                    />
                                )
                        }
                    </div>
                    {productWidth > 0 && products?.length !== 0 &&
                        <Pagination
                            size={mobile ? 'small' : 'large'}
                            count={lastPage}
                            color="primary"
                            page={Number(p)}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            renderItem={item => (
                                <PaginationItem
                                    className={`${styles.pageButton} noUnderline`}
                                    component={item.page === Number(p || 1) || item.page === 0 || item.page === lastPage + 1 ? null : Link}
                                    href={{
                                        pathname: router.pathname,
                                        query: item.page === 1 ? getQueries({}, ['p']) : getQueries({ p: item.page })
                                    }}
                                    {...item}
                                />
                            )}
                        />
                    }
                </div>
            </main >
            <MenuFilter
                show={mobile && filtersOpenDelay}
                open={filtersOpen}
                onClose={handleCloseFilter}
                getQueries={getQueries}
                handleMultiSelection={handleMultiSelection}
            />
            {productWidth &&
                <Footer />
            }
        </div >
    )
})

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['search', 'footer'])))
        }
    }
}