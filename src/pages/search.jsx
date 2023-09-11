import { withRouter } from 'next/router'
import styles from '../styles/search.module.css'
import { useEffect, useState } from 'react'
import Product from '@/components/Product'
import { useRouter } from 'next/router';
import Link from 'next/link';

export default withRouter((props) => {
    const { } = props
    const [products, setProducts] = useState([])
    const router = useRouter()

    const {
        c,
        s,
        t,
        page,
        min,
        max
    } = props.router.query

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            getProductsByCategory()
                .then(products => setProducts(products))
        }
    }, [router])

    function getProductsByCategory() {

        const options = {
            method: 'GET',
            headers: {
                ...router.query
            }
        }

        const products = fetch("/api/products-by-queries", options)
            .then(response => response.json())
            .then(response => response.products)
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

    return (
        <div className={styles.main}>
            <div className={styles.menuFilters}>
                <div className={styles.priceFilter}>
                    <h4>Price</h4>
                    <Link legacyBehavior href={{
                        pathname: router.pathname,
                        query: getQueries({}, ['min', 'max'])
                    }}>
                        <a
                            className={'noUnderline'}
                            aria-label='Any Price'
                            style={{
                                fontWeight: !min && !max
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            Any Price
                        </a>
                    </Link>
                    <Link legacyBehavior href={{
                        pathname: router.pathname,
                        query: getQueries({ max: 15 }, ['min'])
                    }}>
                        <a
                            className={'noUnderline'}
                            aria-label='up to 15'
                            style={{
                                fontWeight: !min && max === '15'
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            Up to $15
                        </a>
                    </Link>
                    <Link legacyBehavior href={{
                        pathname: router.pathname,
                        query: getQueries({ min: '15', max: '25' })
                    }}>
                        <a
                            className={'noUnderline'}
                            aria-label='15 to 25'
                            style={{
                                fontWeight: min === '15' && max === '25'
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $15 to $25
                        </a>
                    </Link>
                    <Link legacyBehavior href={{
                        pathname: router.pathname,
                        query: getQueries({ min: '25', max: '40' })
                    }}>
                        <a
                            className={'noUnderline'}
                            aria-label='25 to 40'
                            style={{
                                fontWeight: min === '25' && max === '40'
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $25 to $40
                        </a>
                    </Link>
                    <Link legacyBehavior href={{
                        pathname: router.pathname,
                        query: getQueries({ min: '40' }, ['max'])
                    }}>
                        <a
                            className={'noUnderline'}
                            aria-label='40 and above'
                            style={{
                                fontWeight: min === '40' && !max
                                    ? 'bold'
                                    : 400
                            }}
                        >
                            $40 & Above
                        </a>
                    </Link>
                    <div className={styles.priceFilterInputs}>
                        <input
                            placeholder='Min'
                        />
                        <input
                            placeholder='Max'
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
                {products.map((product, i) =>
                    <Product
                        key={i}
                        name={product.title}
                        price={product.variants[0].price}
                        currencySymbol='$'
                        outOfStock={false}
                        img={product.image_showcase.src}
                        imgHover={product.image_hover.src}
                        url={`/product?id=${product.id}`}
                        width='calc(25% - 1rem)'
                    />
                )}
            </div>
        </div>
    )
})