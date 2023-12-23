import styles from '@/styles/admin/products/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect, useState } from 'react';
import ProductAdmin from '@/components/products/ProductAdmin';
import { Fab, Pagination, PaginationItem } from '@mui/material';
const { v4: uuidv4 } = require('uuid')
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function ProductsId() {
    const {
        auth,
        session,
        router,
        windowWidth,
    } = useAppContext()

    const mobile = windowWidth <= 700

    const [products, setProducts] = useState()
    const [productsKey, setProductsKey] = useState(0)
    const [lastPage, setLastPage] = useState()

    useEffect(() => {
        if (router.isReady)
            getProductsByQuery()
    }, [router])

    function getProductsByQuery() {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                y: router.query.type_id,
                p: router.query.p,
                join_disabled: true,
            }
        }

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

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.products}>
                            {products?.map(product =>
                                <ProductAdmin
                                    key={`${product.id} ${productsKey}`}
                                    product={product}
                                >
                                    {product.title}
                                </ProductAdmin>
                            )}
                            {products && products?.length !== 0 &&
                                <Pagination
                                    size={mobile ? 'small' : 'large'}
                                    count={lastPage}
                                    color="primary"
                                    page={Number(router.query.p || 1)}
                                    renderItem={item => (
                                        <PaginationItem
                                            className={`${styles.pageButton} noUnderline`}
                                            component={item.page === Number(router.query.p || 1) || item.page === 0 || item.page === lastPage + 1 ? null : Link}
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
                        {router.query.type_id &&
                            <Link
                                href={`/admin/products/${router.query.type_id}/new`}
                                style={{
                                    position: 'fixed',
                                    right: 20,
                                    bottom: 20,
                                }}
                            >
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                >
                                    <AddIcon />
                                </Fab>
                            </Link>
                        }
                    </main>
                </div>
    )
}
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}