import styles from '@/styles/admin/products/type_id/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoFound404 from '@/components/NoFound404';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES, PRODUCTS_TYPES } from '@/consts';
import { useEffect, useState } from 'react';
import ProductAdmin from '@/components/products/ProductAdmin';
import { Fab, Pagination, PaginationItem, Slider } from '@mui/material';
const { v4: uuidv4 } = require('uuid')
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { getDateFormat } from '@/utils';
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
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { createPromotionForProducts, getAllProducts, getProductsByQueries } from '../../../../../frontend/product';

export default function ProductsId() {
    const {
        session,
        router,
        windowWidth,
        userLocation,
        isAdmin
    } = useAppContext()

    const mobile = windowWidth <= 700

    const [products, setProducts] = useState()
    const [productsKey, setProductsKey] = useState(0)
    const [lastPage, setLastPage] = useState()

    const [productsSelected, setProductsSelected] = useState([])

    const [productsPromotionModal, setProductsPromotionModal] = useState([])
    const [productsPromotionModalOpen, setProductsPromotionModalOpen] = useState(false)

    const [creatingPromotion, setCreatingPromotion] = useState(false)

    const [searchInput, setSearchInput] = useState('')

    const [promotion, setPromotion] = useState({ percentage: 15, expire_at: dayjs().add(1, 'month') })

    const tToasts = useTranslation('toasts').t

    const modalOpen = productsPromotionModal?.length > 0

    useEffect(() => {
        if (router.isReady && isAdmin)
            getProductsByQuery()
    }, [router])


    useEffect(() => {
        if (!modalOpen)
            resetModal()
    }, [productsPromotionModal])

    async function getProductsByQuery() {
        try {
            const response = router.query.type_id === 'all'
                ? await getAllProducts({
                    p: router.query.p,
                    join_disabled: true,
                })
                : await getProductsByQueries({
                    y: router.query.type_id,
                    i: searchInput.toLowerCase(),
                    p: router.query.p,
                    join_disabled: true,
                })

            setProducts(response.products)
            setLastPage(response.last_page)
            setProductsKey(uuidv4())
        }
        catch (error) {
            console.error(error)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) })
        }
    }

    async function createPromotion() {
        try {
            setCreatingPromotion(true)

            const products_ids = productsPromotionModal.map(product => product.id)
            const promo = { ...promotion, percentage: promotion.percentage / 100, expire_at: Timestamp.fromDate(promotion.expire_at.toDate()) }

            await createPromotionForProducts(products_ids, promo)
            getProductsByQuery()
            setProductsPromotionModalOpen(false)
            showToast({ type: 'success', msg: tToasts(promo.percentage === 0 ? 'promotion_deleted_successfully' : 'promotion_created_successfully') })
        }
        catch (error) {
            console.error(error)
            showToast({ type: 'error', msg: tToasts(error.message) })
            setCreatingPromotion(false)
        }
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
            return showToast({ msg: tToasts('no_products_selected') })
        setProductsPromotionModal(products)
        setProductsPromotionModalOpen(true)
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

    function resetModal() {
        setPromotion({ percentage: 15, expire_at: dayjs().add(1, 'month') })
        setCreatingPromotion(false)
    }

    function getProfit(product) {
        const cheapestVariant = product.variants.find(vari => vari.price === (product.promotion ? product.promotion.min_price_original : product.min_price))
        const futurePrice = (product.promotion ? product.promotion.min_price_original : product.min_price) * (1 - (promotion.percentage / 100))
        return ((futurePrice - PRODUCTS_TYPES.find(type => type.id === product.type_id).variants.find(vari => vari.id === cheapestVariant.id).cost) / 100).toFixed(2)
    }

    function handleSearch() {
        getProductsByQuery()
    }

    function handleOnChangeSearch(event) {
        setSearchInput(event.target.value)
    }

    function handleOnKeyDownSearch(event) {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    function handleClosePromotionModal() {
        setProductsSelected([])
        setProductsPromotionModalOpen(false)
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin
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
                        <Modal
                            className={styles.promotionModal}
                            open={productsPromotionModalOpen}
                            closeModal={handleClosePromotionModal}
                            closedCallBack={() => setProductsPromotionModal([])}
                        >
                            <div className='flex column'>
                                <span>Duration: {promotion.expire_at.diff(dayjs().startOf('day'), 'day')} days</span>
                                <div className={styles.productsPromotionModal}>
                                    {productsPromotionModal.map((prod, i) =>
                                        <div
                                            className={styles.productPromotionModal}
                                            key={i}
                                        >
                                            <div
                                                className={styles.productPromotionModalImage}
                                            >
                                                <Image
                                                    priority
                                                    src={typeof prod.images[0].src === 'string' ? prod.images[0].src : prod.images[0].src.front}
                                                    quality={100}
                                                    alt='product'
                                                    fill
                                                    sizes='100px'
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '0.3rem'
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={styles.productPromotionModalBody}
                                            >
                                                <div className={styles.priceDiff}>
                                                    <span style={{ color: 'var(--color-error)' }} >${((prod.promotion ? prod.promotion.min_price_original : prod.min_price) / 100).toFixed(2)}</span>
                                                    <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 27 }} />
                                                    <span style={{ color: 'var(--color-success)' }}>${(((prod.promotion ? prod.promotion.min_price_original : prod.min_price) * (1 - (promotion.percentage / 100)) / 100).toFixed(2))}</span>
                                                </div>
                                            </div>
                                            <div className={styles.profitContainer}>
                                                <span style={{ fontSize: 15 }}>Profit</span>
                                                <span className={styles.profitValue}>${getProfit(prod)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                        <div className={styles.mainTop}>
                            <div className='flex row' style={{ gap: '0.5rem' }}>
                                <TextInput
                                    size='small'
                                    value={searchInput}
                                    onChange={handleOnChangeSearch}
                                    onKeyDown={handleOnKeyDownSearch}
                                    label='Product ID'
                                />
                                <MyButton
                                    onClick={handleSearch}
                                >
                                    <SearchRoundedIcon />
                                </MyButton>
                            </div>
                            <MyButton
                                onClick={() => handlePromotionClick(productsSelected)}
                            >
                                Create Promotion
                            </MyButton>
                        </div>
                        <div className={styles.products}>
                            {products
                                ? products?.map(product =>
                                    <ProductAdmin
                                        selected={productsSelected.some(prod => prod.id === product.id)}
                                        onChangeSelection={event => handleChangeSelection(event.target.checked, product)}
                                        onPromotionClick={() => handlePromotionClick([product])}
                                        key={`${product.id} ${productsKey}`}
                                        product={product}
                                    >
                                        {product.title}
                                    </ProductAdmin>
                                )
                                : Array(20).fill(null).map((ske, i) =>
                                    <ProductSkeleton
                                        key={i}
                                    />
                                )
                            }
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
                                    alignItems: 'center',
                                }}
                                renderItem={item => (
                                    <PaginationItem
                                        className='pageButtonForDark noUnderline'
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
                        {PRODUCTS_TYPES.find(tp => tp.id === router.query.type_id) &&
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
                </div >
    )
}
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}