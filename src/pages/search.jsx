import { withRouter } from 'next/router'
import styles from '@/styles/pages/search.module.css'
import { useEffect, useRef, useState } from 'react'
import Product from '@/components/products/Product'
import Link from 'next/link'
import Selector from '@/components/material-ui/Selector'
import { Checkbox, FormControlLabel, Pagination, PaginationItem } from '@mui/material'
import Footer from '@/components/Footer'
import { SEARCH_COLORS } from '../../consts'
import ColorButton from '@/components/ColorButton'
import Tag from '@/components/material-ui/Tag'
import CircleIcon from '@mui/icons-material/Circle';
import ProductSkeleton from '@/components/products/ProductSkeleton'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuFilter from '@/components/MenuFilter'

const THEMES_VALUES = [
    { name: 'Computer', value: 'computer' },
    { name: 'Games', value: 'games' },
    { name: 'Music', value: 'music' },
]

const MOST_SEARCHED_VALUES = [
    { name: 'Funny', value: 'funny' },
    { name: 'Birthday', value: 'birthday' },
    { name: 'For Couples', value: 'for-couples' },
]

const QUERIES = {
    h: { title: 'category', show: true, showTitle: true, isFilter: true },
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

export default withRouter(props => {
    const {
        userCurrency,
        supportsHoverAndPointer,
        router,
        windowWidth,
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
        p = '1',
        limit = '60',
    } = props.router.query

    const mobile = windowWidth <= 700

    const [products, setProducts] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const [productsPerLine, setProductsPerLine] = useState(0)
    const [lastPage, setLastPage] = useState()
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [filtersOpenDelay, setFiltersOpenDelay] = useState(false)

    const productsContainer = useRef(null)

    const themes = h?.split(' ') || []
    const tags = t?.split(' ') || []

    useEffect(() => {
        if (router.isReady)
            getProductsByQuery()
    }, [router])

    useEffect(() => {
        function handleResize() {
            const containerWidth = productsContainer.current.offsetWidth

            if (!mobile) {
                setFiltersOpen(false)
                setFiltersOpenDelay(false)
            }

            if (containerWidth > 900) {
                setProductWidth((containerWidth - 16 * 5) / 5)
                setProductsPerLine(5)
            }
            else if (containerWidth > 700) {
                setProductWidth((containerWidth - 16 * 4) / 4)
                setProductsPerLine(4)
            }
            else if (containerWidth > 500) {
                setProductWidth((containerWidth - 16 * 3) / 3)
                setProductsPerLine(3)
            }
            else {
                setProductWidth((containerWidth - 16 * 2) / 2)
                setProductsPerLine(2)
            }
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
        setProducts()

        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                limit: limit,
                ...router.query,
            }
        }

        fetch("/api/products-by-queries", options)
            .then(response => response.json())
            .then(response => {
                setProducts(response.products)
                setLastPage(response.last_page)
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

    function handleThemesSelect(checked, value) {
        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, 'h': value }
            }, undefined, { scroll: false })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: getQueries({}, 'h')
            }, undefined, { scroll: false })
        }
    }

    function handleTagsSelect(checked, value) {
        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, 't': tags.concat(value).join(' ') }
            }, undefined, { scroll: false })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: tags.length === 1
                    ? getQueries({}, 't')
                    : { ...router.query, 't': tags.filter(theme => theme !== value).join(' ') }
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

    return (
        <div className='fillWidth'>
            <main className={styles.main}>
                {!mobile &&
                    <div className={styles.menuFilters}>
                        <div className={styles.filterBlock}>
                            <h3>Categories</h3>
                            {THEMES_VALUES.map((theme, i) =>
                                <FormControlLabel
                                    name='categories'
                                    label={theme.name}
                                    key={i}
                                    sx={{
                                        marginTop: -0.6,
                                        marginBottom: -0.6,
                                    }}
                                    control={
                                        <Checkbox
                                            checked={themes.includes(theme.value)}
                                            onChange={e => handleThemesSelect(e.target.checked, theme.value)}
                                            sx={{
                                                color: '#ffffff'
                                            }}
                                        />
                                    }
                                />
                            )}
                        </div>
                        <div className={styles.filterBlock}>
                            <h3>Most Searched</h3>
                            {MOST_SEARCHED_VALUES.map((tag, i) =>
                                <FormControlLabel
                                    name='most searched'
                                    key={i}
                                    sx={{
                                        marginTop: -0.6,
                                        marginBottom: -0.6,
                                    }}
                                    control={
                                        <Checkbox
                                            checked={tags.includes(tag.value)}
                                            onChange={e => handleTagsSelect(e.target.checked, tag.value)}
                                            sx={{
                                                color: '#ffffff'
                                            }}
                                        />
                                    }
                                    label={tag.name}
                                />
                            )}
                        </div>
                        <div className={styles.filterBlock}>
                            <h3>Price</h3>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({}, ['min', 'max'])
                                }}
                                scroll={false}
                                className='noUnderline'
                                style={{
                                    fontWeight: !min && !max
                                        ? '700'
                                        : 400
                                }}
                            >
                                Any Price
                            </Link>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({ max: 15 }, ['min'])
                                }}
                                scroll={false}
                                className='noUnderline'
                                style={{
                                    fontWeight: !min && max === '15'
                                        ? '700'
                                        : 400
                                }}
                            >
                                Up to {userCurrency.symbol}15
                            </Link>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({ min: '15', max: '25' })
                                }}
                                scroll={false}
                                className='noUnderline'
                                style={{
                                    fontWeight: min === '15' && max === '25'
                                        ? '700'
                                        : 400
                                }}
                            >
                                {userCurrency.symbol}15 to {userCurrency.symbol}25
                            </Link>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({ min: '25', max: '40' })
                                }}
                                scroll={false}
                                className='noUnderline'
                                style={{
                                    fontWeight: min === '25' && max === '40'
                                        ? '700'
                                        : 400
                                }}
                            >
                                {userCurrency.symbol}25 to {userCurrency.symbol}40
                            </Link>
                            <Link
                                href={{
                                    pathname: router.pathname,
                                    query: getQueries({ min: '40' }, ['max'])
                                }}
                                scroll={false}
                                className='noUnderline'
                                style={{
                                    fontWeight: min === '40' && !max
                                        ? '700'
                                        : 400
                                }}
                            >
                                {userCurrency.symbol}40 & Above
                            </Link>
                            <div className={styles.priceFilterInputs}>
                                <input
                                    name='min'
                                    placeholder='Min'
                                    spellCheck={false}
                                />
                                <input
                                    name='max'
                                    placeholder='Max'
                                    spellCheck={false}
                                />
                                <button>
                                    Go
                                </button>
                            </div>
                        </div>
                        <div className={styles.filterBlock}>
                            <h3>Product Color</h3>
                            <div className={styles.colorsContainer}>
                                {SEARCH_COLORS.map((color, i) =>
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
                        <div className={styles.filterBlock}>
                            <h3>Art Color</h3>
                            <div className={styles.colorsContainer}>
                                {SEARCH_COLORS.map((color, i) =>
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
                        <div className='flex row center' style={{ gap: '1rem' }}>
                            {mobile
                                ? <button
                                    className='flex center buttonInvisible'
                                    onClick={() => {
                                        if (filtersOpen)
                                            handleCloseFilter()
                                        else {
                                            setFiltersOpen(true)
                                            setFiltersOpenDelay(true)
                                        }
                                    }}
                                    style={{
                                        outline: 'none',
                                        fontSize: 20,
                                    }}
                                >
                                    Filters <KeyboardArrowDownRoundedIcon style={{ transform: filtersOpen ? 'rotateZ(-180deg)' : 'none', transition: 'ease-in-out 200ms transform' }} />
                                </button>
                                : <h1
                                    style={{
                                        fontSize: mobile ? 20 : 27
                                    }}
                                >
                                    {Object.keys(router.query).filter(key => QUERIES[key].isFilter).length === 0 ? 'All Products' : Object.keys(router.query).filter(key => QUERIES[key].isFilter).length === 1 ? 'Filter' : 'Filters'}
                                </h1>
                            }
                            {!mobile &&
                                < div className='flex row center' style={{ gap: '0.5rem' }}>
                                    {Object.keys(router.query).filter(key => QUERIES[key]?.show).map(key => router.query[key].split(' ').map((value, i) =>
                                        <Tag
                                            key={i}
                                            label={
                                                QUERIES[key].showTitle
                                                    ? <span>{QUERIES[key].title}: {value}</span>
                                                    : key === 'cl'
                                                        ? <span className='flex row center' style={{ gap: '0.2rem' }}>product: {value} <CircleIcon style={{ color: SEARCH_COLORS.find(cl => cl.color_display.id_string === value).color_display.color }} /></span>
                                                        : key === 'ac'
                                                            ? <span className='flex row center' style={{ gap: '0.2rem' }}>art: {value} <CircleIcon style={{ color: SEARCH_COLORS.find(cl => cl.color_display.id_string === value).color_display.color }} /></span>
                                                            : value
                                            }
                                            onDelete={() => handleDeleteTag(key, value)}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <Selector
                            name='order'
                            label='Order By'
                            value={order}
                            options={
                                min || max
                                    ? [
                                        { value: 'lowest-price', name: 'Lowest Price' },
                                        { value: 'higher-price', name: 'Higher Price' },
                                    ]
                                    : [
                                        { value: 'popularity', name: 'Popularity' },
                                        { value: 'newest', name: 'Newest' },
                                        { value: 'lowest-price', name: 'Lowest Price' },
                                        { value: 'higher-price', name: 'Higher Price' },
                                    ]
                            }
                            width='170px'
                            onChange={(event) => handleChangeOrder(event.target.value)}
                            supportsHoverAndPointer={supportsHoverAndPointer}
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
                            ? Array(Number(limit)).fill(null).map((ske, i) =>
                                <ProductSkeleton
                                    key={i}
                                    productWidth={productWidth}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                />
                            )
                            : products.length === 0
                                ? <h2>No Results</h2>
                                : products.map((product, i) =>
                                    <Product
                                        key={i}
                                        userCurrency={userCurrency}
                                        product={product}
                                        width={productWidth}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        inicialVariantId={
                                            product.variants.find(vari => {
                                                if (cl && ac)
                                                    return SEARCH_COLORS.find(scolor => scolor.color_display.id_string === cl)?.colors.some(color => color.id === vari.color_id) && SEARCH_COLORS.find(scolor => scolor.color_display.id_string === ac)?.id === vari.art.color_id
                                                if (cl)
                                                    return SEARCH_COLORS.find(scolor => scolor.color_display.id_string === cl)?.colors.some(color => color.id === vari.color_id)
                                                if (ac) {
                                                    return SEARCH_COLORS.find(scolor => scolor.color_display.id_string === ac)?.id === vari.art.color_id
                                                }
                                                return null
                                            })?.id || null
                                        }
                                    />
                                )
                        }
                    </div>
                    {productWidth > 0 &&
                        <Pagination
                            size={mobile ? 'small' : 'large'}
                            count={lastPage}
                            color="primary"
                            page={Number(p)}
                            renderItem={(item) => (
                                <PaginationItem
                                    className={`${styles.pageButton} noUnderline`}
                                    component={Link}
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
            </main>
            <MenuFilter
                show={mobile && filtersOpenDelay}
                open={filtersOpen}
                onClose={handleCloseFilter}
            />
            {productWidth &&
                <Footer />
            }
        </div>
    )
})