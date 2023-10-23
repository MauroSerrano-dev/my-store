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
    order: { title: 'order by', show: true, showTitle: true, isFilter: false },
    c: { title: 'collection', show: true, showTitle: true, isFilter: true },
    t: { title: 'tags', show: true, showTitle: false, isFilter: true },
    v: { title: 'type', show: true, showTitle: true, isFilter: true },
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
        router
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
        p = 1,
    } = props.router.query

    const [products, setProducts] = useState()
    const [productWidth, setProductWidth] = useState(0)
    const [productsPerLine, setProductsPerLine] = useState(0)
    const [lastPage, setLastPage] = useState()

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

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function getProductsByQuery() {
        setProducts()

        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
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
        })
    }

    function handleThemesSelect(checked, value) {
        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, 'h': value }
            })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: getQueries({}, 'h')
            })
        }
    }

    function handleTagsSelect(checked, value) {
        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, 't': tags.concat(value).join(' ') }
            })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: tags.length === 1
                    ? getQueries({}, 't')
                    : { ...router.query, 't': tags.filter(theme => theme !== value).join(' ') }
            })
        }
    }

    function handleDeleteTag(queryName, value) {
        router.push({
            pathname: router.pathname,
            query: router.query[queryName].split(' ').length === 1
                ? getQueries({}, [queryName])
                : { ...router.query, [queryName]: router.query[queryName].split(' ').filter(queryValue => queryValue !== value).join(' ') }
        })
    }

    function handleChangePage(event) {
        console.log(event.target.value)
    }

    return (
        <div className='fillWidth'>
            <main className={styles.main}>
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
                                        query: color.color_display.title.toLowerCase() === cl
                                            ? getQueries({}, ['cl'])
                                            : getQueries({ cl: color.color_display.title.toLowerCase() })
                                    }}
                                    key={i}
                                >
                                    <ColorButton
                                        selected={cl === color.color_display.title.toLowerCase()}
                                        color={{ title: color.color_display.title, colors: color.color_display.colors }}
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
                                        query: color.color_display.title.toLowerCase() === ac
                                            ? getQueries({}, ['ac'])
                                            : getQueries({ ac: color.color_display.title.toLowerCase() })
                                    }}
                                    key={i}
                                >
                                    <ColorButton
                                        selected={ac === color.color_display.title.toLowerCase()}
                                        color={{ title: color.color_display.title, colors: color.color_display.colors }}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={styles.products}
                >
                    <div className={styles.productsHead}>
                        <div className='flex row center' style={{ gap: '1rem' }}>
                            <h1>
                                {Object.keys(router.query).filter(key => QUERIES[key].isFilter).length === 0 ? 'All Products' : 'Filter'}
                            </h1>
                            <div className='flex row center' style={{ gap: '0.5rem' }}>
                                {Object.keys(router.query).filter(key => QUERIES[key]?.show).map(key => router.query[key].split(' ').map((value, i) =>
                                    <Tag
                                        key={i}
                                        label={
                                            QUERIES[key].showTitle
                                                ? <span>{QUERIES[key].title}: {value}</span>
                                                : key === 'cl'
                                                    ? <span className='flex row center' style={{ gap: '0.2rem' }}>product: {value} <CircleIcon style={{ color: SEARCH_COLORS.find(cl => cl.color_display.title.toLowerCase() === value).color_display.colors[0] }} /></span>
                                                    : key === 'ac'
                                                        ? <span className='flex row center' style={{ gap: '0.2rem' }}>art: {value} <CircleIcon style={{ color: SEARCH_COLORS.find(cl => cl.color_display.title.toLowerCase() === value).color_display.colors[0] }} /></span>
                                                        : value
                                        }
                                        onDelete={() => handleDeleteTag(key, value)}
                                    />
                                ))}
                            </div>
                        </div>
                        <Selector
                            name='order'
                            label='Order By'
                            value={order}
                            colorText={router.isReady ? '#ffffff' : 'transparent'}
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
                    >
                        {!products || !router.isReady
                            ? <div></div>
                            : products.length === 0
                                ? <h2>No Results</h2>
                                : products.map((product, i) =>
                                    <Product
                                        key={i}
                                        userCurrency={userCurrency}
                                        product={product}
                                        width={productWidth}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        inicialColorId={
                                            product.variants.find(vari => {
                                                if (cl && ac)
                                                    return SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === cl)?.colors.find(clr => clr.id === vari.color_id) && SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === ac)?.colors.find(clr => clr.id === vari.art.color_id)
                                                if (cl)
                                                    return SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === cl)?.colors.find(clr => clr.id === vari.color_id)
                                                if (ac)
                                                    return SEARCH_COLORS.find(color => color.color_display.title.toLowerCase() === ac)?.colors.find(clr => clr.id === vari.art.color_id)
                                                return null
                                            })?.color_id || null
                                        }
                                        motionVariants={
                                            {
                                                hidden: {
                                                    opacity: 0,
                                                    y: 20,
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        duration: 0.3,
                                                        delay: 0.3 * Math.floor(i / (productsPerLine)),
                                                    }
                                                }
                                            }
                                        }
                                    />
                                )}
                    </div>
                    <Pagination
                        sx={{
                        }}
                        size='large'
                        count={lastPage}
                        color="primary"
                        page={Number(p)}
                        renderItem={(item) => (
                            <PaginationItem
                                className='noUnderline'
                                component={Link}
                                scroll={false}
                                href={{
                                    pathname: router.pathname,
                                    query: item.page === 1 ? getQueries({}, ['p']) : getQueries({ p: item.page })
                                }}
                                {...item}
                            />
                        )}
                    />
                </div>
            </main>
            <Footer />
        </div >
    )
})