import { withRouter } from 'next/router'
import styles from '../styles/search.module.css'
import { useEffect, useState } from 'react'
import Product from '@/components/Product'
import Link from 'next/link';
import Selector from '@/components/material-ui/Selector';
import { Checkbox, FormControlLabel } from '@mui/material';
import Footer from '@/components/Footer';

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

export default withRouter(props => {
    const {
        userCurrency,
        supportsHoverAndPointer,
        loading,
        setLoading,
        router
    } = props
    const {
        s,
        t,
        page = 1,
        min,
        max,
        order = 'popularity',
    } = props.router.query

    const [products, setProducts] = useState([])
    const [themes, setThemes] = useState([])
    const [orderBy, setOrderBy] = useState(order)
    const [minOrMax, setMinOrMax] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const [itemsPerLine, setItemsPerLine] = useState(0)

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            getProductsByCategory()
                .then(products => setProducts(products))
        }
        if (t) {
            setThemes(t?.split(' '))
        }
        else {
            setThemes([])
        }
        if ((min || max) && order !== 'lowest-price' && order !== 'higher-price') {
            setOrderBy('lowest-price')
        }
        else {
            setOrderBy(order)
        }
        if (!min && !max) {
            setMinOrMax(false)
        }
        else {
            setMinOrMax(true)
        }
    }, [router])

    useEffect(() => {
        function getItemsPerLine(width) {
            if (width > 1250)
                return 5
            if (width > 1060)
                return 4
            if (width > 860)
                return 3
            else
                return 2
        }

        const handleResize = () => {
            setItemsPerLine(getItemsPerLine(window.innerWidth))
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function getProductsByCategory() {
        setProducts([])

        const options = {
            method: 'GET',
            headers: {
                ...router.query,
            }
        }

        const products = fetch("/api/products-by-queries", options)
            .then(response => response.json())
            .then(response => {
                setNoResults(response.products.length === 0)
                return response.products
            })
            .catch(err => console.error(err))

        return products
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

    function handleCheckBox(checked, queryName, value) {
        if (checked) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, [queryName]: themes.concat(value).join(' ') }
            })
        }
        else {
            router.push({
                pathname: router.pathname,
                query: themes.length === 1
                    ? getQueries({}, [queryName])
                    : { ...router.query, [queryName]: themes.filter(theme => theme !== value).join(' ') }
            })
        }
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
                                    marginTop: '-0.8',
                                    marginBottom: '-0.8',
                                }}
                                control={
                                    <Checkbox
                                        checked={themes.includes(theme.value)}
                                        onChange={e => handleCheckBox(e.target.checked, 't', theme.value)}
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
                        {MOST_SEARCHED_VALUES.map((theme, i) =>
                            <FormControlLabel
                                name='most searched'
                                key={i}
                                sx={{
                                    marginTop: -0.8,
                                    marginBottom: -0.8,
                                }}
                                control={
                                    <Checkbox
                                        checked={themes.includes(theme.value)}
                                        onChange={e => handleCheckBox(e.target.checked, 't', theme.value)}
                                        sx={{
                                            color: '#ffffff'
                                        }}
                                    />
                                }
                                label={theme.name}
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
                                    ? 'bold'
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
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            Up to $15
                        </Link>
                        <Link
                            href={{
                                pathname: router.pathname,
                                query: getQueries({ min: '15', max: '25' })
                            }}
                            className='noUnderline'
                            style={{
                                fontWeight: min === '15' && max === '25'
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $15 to $25
                        </Link>
                        <Link
                            href={{
                                pathname: router.pathname,
                                query: getQueries({ min: '25', max: '40' })
                            }}
                            className='noUnderline'
                            style={{
                                fontWeight: min === '25' && max === '40'
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $25 to $40
                        </Link>
                        <Link
                            href={{
                                pathname: router.pathname,
                                query: getQueries({ min: '40' }, ['max'])
                            }}
                            className='noUnderline'
                            style={{
                                fontWeight: min === '40' && !max
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $40 & Above
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
                </div>
                <div
                    className={styles.products}
                >
                    <div className={styles.productsHead}>
                        <h1>
                            Search
                        </h1>
                        <Selector
                            name='search'
                            label='Order By'
                            value={orderBy}
                            options={
                                minOrMax
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
                    <div className={styles.productsBody}>
                        {noResults
                            ? <h2>No Results</h2>
                            : products.map((product, i) =>
                                <Product
                                    key={i}
                                    userCurrency={userCurrency}
                                    product={product}
                                    width={`calc(${100 / itemsPerLine}% - 1rem)`}
                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                    loading={loading}
                                    setLoading={setLoading}
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
                                                    delay: 0.5 + 0.3 * Math.floor(i / itemsPerLine),
                                                }
                                            }
                                        }
                                    }
                                />
                            )}
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    )
})