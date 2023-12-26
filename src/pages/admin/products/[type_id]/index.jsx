import styles from '@/styles/admin/products/type_id/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { useEffect, useState } from 'react';
import ProductAdmin from '@/components/products/ProductAdmin';
import { Fab, Pagination, PaginationItem, Slider } from '@mui/material';
const { v4: uuidv4 } = require('uuid')
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { getDateFormat, handleCloseModal, handleOpenModal } from '@/utils';
import TextInput from '@/components/material-ui/TextInput';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import MyButton from '@/components/material-ui/MyButton';
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next'

export default function ProductsId() {
    const {
        auth,
        session,
        router,
        windowWidth,
        userLocation
    } = useAppContext()

    const mobile = windowWidth <= 700

    const [products, setProducts] = useState()
    const [productsKey, setProductsKey] = useState(0)
    const [lastPage, setLastPage] = useState()

    const [productsSelected, setProductsSelected] = useState([])

    const [productsPromotionModal, setProductsPromotionModal] = useState([])
    const [promotionModalOpacity, setPromotionModalOpacity] = useState(false)

    const [creatingPromotion, setCreatingPromotion] = useState(false)

    const [promotion, setPromotion] = useState({ percentage: 15, expire_at: dayjs() })

    const tToasts = useTranslation('toasts').t

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

    function createPromotion() {
        setCreatingPromotion(true)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                products_ids: productsPromotionModal.map(product => product.id),
                promotion: { ...promotion, percentage: promotion.percentage / 100 },
            })
        }
        fetch("/api/promotion", options)
            .then(response => response.json())
            .then(response => {
                if (response.error)
                    showToast({ type: 'error', msg: response.error })
                else
                    showToast({ type: 'success', msg: response.message })
                setCreatingPromotion(false)
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
                setCreatingPromotion(false)
            })
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

    function handlePromotionClick(products) {
        if (products.length === 0)
            return showToast({ msg: 'No products selected' })
        handleOpenModal(setProductsPromotionModal, setPromotionModalOpacity, products)
    }

    function handleChangeSelection(value, product) {
        setProductsSelected(prev =>
            value
                ? prev.concat(product)
                : prev.filter(prod => product.id !== prod.id)
        )
    }

    function handleChangePromotion(fieldName, value) {
        setPromotion(prev => ({ ...prev, [fieldName]: value }))
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingLeft: 'calc(var(--admin-menu-width-close) + 2rem)',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        {productsPromotionModal?.length > 0 &&
                            <Modal
                                closeModal={() => handleCloseModal(setProductsPromotionModal, setPromotionModalOpacity, [])}
                                showModalOpacity={promotionModalOpacity}
                                className={styles.promotionModal}
                            >
                                <div className='flex column'>
                                    <span>Duration: {promotion.expire_at.diff(dayjs().startOf('day'), 'day')} days</span>
                                    {productsPromotionModal.map((prod, i) =>
                                        <div
                                            className='flex center'
                                            key={i}
                                        >
                                            <span>${((prod.promotion ? prod.promotion.min_price_original : prod.min_price) / 100).toFixed(2)}</span>
                                            <KeyboardArrowRightOutlinedIcon />
                                            <span>${(((prod.promotion ? prod.promotion.min_price_original : prod.min_price) * (1 - (promotion.percentage / 100)) / 100).toFixed(2))}</span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className='flex center fillWidth'
                                    style={{
                                        gap: '1rem'
                                    }}
                                >
                                    <TextInput
                                        dark
                                        label='%'
                                        onChange={event => {
                                            const value = event.target.value > 100
                                                ? 100
                                                : event.target.value < 0
                                                    ? 0
                                                    : (event.target.value || 0)
                                            if (!Number.isNaN(Number(value)))
                                                handleChangePromotion('percentage', value)
                                        }}
                                        value={promotion.percentage}
                                        style={{
                                            width: 90,
                                        }}
                                        styleInput={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            padding: 0,
                                            height: 45,
                                        }}
                                    />
                                    <Slider
                                        value={promotion.percentage}
                                        valueLabelFormat={`${promotion.percentage}%`}
                                        min={0}
                                        max={100}
                                        step={5}
                                        valueLabelDisplay="auto"
                                        onChange={event => handleChangePromotion('percentage', event.target.value)}
                                        sx={{
                                            '.MuiSlider-rail': {
                                                color: 'var(--primary) !important'
                                            },
                                            '.MuiSlider-track': {
                                                color: 'var(--primary) !important'
                                            },
                                            '.MuiSlider-thumb': {
                                                color: 'var(--primary) !important'
                                            },
                                            '.MuiSlider-valueLabelLabel': {
                                                color: 'var(--text-white) !important'
                                            },
                                        }}
                                    />
                                </div>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        label="Expire At"
                                        input
                                        disablePast
                                        value={promotion.expire_at}
                                        onChange={event => handleChangePromotion('expire_at', dayjs(event))}
                                        format={getDateFormat(userLocation.country)}
                                        sx={{
                                            '.MuiOutlinedInput-notchedOutline': {
                                                transition: 'border-color 150ms ease-in-out'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                                <LoadingButton
                                    loading={creatingPromotion}
                                    variant='contained'
                                    onClick={createPromotion}
                                    sx={{
                                        fontWeight: '600',
                                        textTransform: 'none',
                                    }}
                                >
                                    Create Promotion
                                </LoadingButton>
                            </Modal>
                        }
                        <div className={styles.mainTop}>
                            <MyButton
                                onClick={() => handlePromotionClick(productsSelected)}
                            >
                                Create Promotion
                            </MyButton>
                        </div>
                        <div className={styles.products}>
                            {products?.map(product =>
                                <ProductAdmin
                                    selected={productsSelected.some(prod => prod.id === product.id)}
                                    onChangeSelection={event => handleChangeSelection(event.target.checked, product)}
                                    onPromotionClick={() => handlePromotionClick([product])}
                                    key={`${product.id} ${productsKey}`}
                                    product={product}
                                >
                                    {product.title}
                                </ProductAdmin>
                            )}
                        </div>
                        {products && products?.length !== 0 &&
                            <Pagination
                                size={mobile ? 'small' : 'large'}
                                count={lastPage}
                                color="primary"
                                page={Number(router.query.p || 1)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
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