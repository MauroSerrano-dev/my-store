import TagsSelector from '@/components/material-ui/TagsSelector'
import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/products/type_id/prod_id/edit.module.css'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { COLLECTIONS, TAGS_POOL, PRODUCTS_TYPES, COLORS_POOL, SIZES_POOL, PROVIDERS_POOL, THEMES_POOL, SEARCH_ART_COLORS, COMMON_TRANSLATES } from '@/consts'
import ColorSelector from '@/components/ColorSelector'
import SizesSelector from '@/components/SizesSelector'
import { ButtonGroup, Checkbox, FormControlLabel, Switch } from '@mui/material'
import NoFound404 from '@/components/NoFound404'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import Chain from '@/components/svgs/Chain'
import BrokeChain from '@/components/svgs/BrokeChain'
import ButtonIcon from '@/components/material-ui/ButtonIcon'
import ImagesSliderEditable from '@/components/ImagesSliderEditable'
import { showToast } from '@/utils/toasts'
import { getObjectsDiff, getProductVariantInfo } from '@/utils'
import Head from 'next/head'
import Selector from '@/components/material-ui/Selector'
import { isNewProductValid } from '@/utils/edit-product'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { isAdmin } from '@/utils/validations'
import { useTranslation } from 'next-i18next'
import { useAppContext } from '@/components/contexts/AppContext'
import MyButton from '@/components/material-ui/MyButton'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import Link from 'next/link'
import PrintifyIdPicker from '@/components/PrintifyIdPicker'
import ProductPriceInput from '@/components/ProductPriceInput'
import { LoadingButton } from '@mui/lab'
import Modal from '@/components/Modal'
import { SlClose } from "react-icons/sl";

export default withRouter(() => {
    const {
        auth,
        router,
        session,
        setAdminMenuOpen,
        windowWidth,
    } = useAppContext()

    const [product, setProduct] = useState()
    const [images, setImages] = useState()
    const [inicialProduct, setInicialProduct] = useState()
    const [colorIndex, setColorIndex] = useState(0)
    const [colorsChained, setColorsChained] = useState([])
    const [sizesChained, setSizesChained] = useState({})
    const [disableUpdateButton, setDisableUpdateButton] = useState(false)
    const [artColorChained, setArtColorChained] = useState()
    const [artIdChained, setArtIdChained] = useState()
    const [fieldChanged, setFieldChanged] = useState({})
    const [viewStatus, setViewStatus] = useState('front')

    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    const TYPE = PRODUCTS_TYPES.find(type => type.id === product?.type_id)
    const COLORS = product?.colors_ids.map(cl_id => COLORS_POOL[cl_id])
    const SIZES = product?.sizes_ids.map(sz_id => SIZES_POOL.find(size => size.id === sz_id))

    useEffect(() => {
        setAdminMenuOpen(false)
    }, [])

    useEffect(() => {
        if (router.isReady) {
            getProductById(router.query.prod_id)
        }
    }, [router])

    useEffect(() => {
        if (inicialProduct) {
            setArtColorChained(inicialProduct?.variants.every(vari => vari.art.color_id === inicialProduct.variants[0].art.color_id))
            setArtIdChained(inicialProduct?.variants.every(vari => vari.art.id === inicialProduct.variants[0].art.id))
        }
    }, [inicialProduct])

    async function getProductById(id) {
        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                id: id || '',
            }
        }
        const product = await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))
        if (product) {
            if (product.colors_ids.every(cl => product.variants.filter(vari => vari.color_id === cl).every(variColor => variColor.price === product.variants.find(vari => vari.size_id === variColor.size_id).price)))
                setColorsChained(product.colors_ids)

            setSizesChained(product.colors_ids.reduce((acc, cl) => ({ ...acc, [cl]: [] }), {}))

            setInicialProduct(product)
            setProduct({ ...product, variants: product.variants.map(vari => getProductVariantInfo(vari, product.type_id)) })
            setImages(product.images.reduce((acc, image) => acc[image.color_id] === undefined ? { ...acc, [image.color_id]: product.images.filter(img => img.color_id === image.color_id) } : acc, {}))
        }
    }

    function handleSelectedColor(value, i) {
        setColorIndex(i)
    }

    function handleChainSize(sizeId) {
        const colorId = product.colors_ids[colorIndex]
        // unchain
        if (sizesChained[colorId].includes(sizeId)) {
            if (isCurrentColorChained()) {
                setSizesChained(prev => {
                    let newValue = { ...prev } //criar uma nova referencia de obj, para ser detectada a mudança
                    colorsChained.forEach(clId => newValue[clId] = newValue[clId].filter(sId => sId !== sizeId))
                    return newValue
                })
            }
            else {
                setSizesChained(prev => (
                    {
                        ...prev,
                        [colorId]: prev[colorId].filter(sId => sId !== sizeId)
                    }
                ))
            }
        }
        //chain
        else {
            if (isCurrentColorChained()) {
                setProduct(prev => (
                    {
                        ...prev,
                        variants: prev.variants.map(vari =>
                            vari.size_id === sizeId && colorsChained.includes(vari.color_id)
                                ? {
                                    ...vari,
                                    price: prev.variants.find(v => v.color_id === colorId && sizesChained[colorId].some(sId => v.size_id === sId))
                                        ? prev.variants.find(v => v.color_id === colorId && sizesChained[colorId].some(sId => v.size_id === sId)).price
                                        : vari.price
                                }
                                : vari
                        )
                    }
                ))
                setSizesChained(prev => {
                    let newValue = { ...prev } //criar uma nova referencia de obj, para ser detectada a mudança
                    colorsChained.forEach(clId => newValue[clId] = prev[clId].concat(sizeId))
                    return newValue
                })
            }
            else {
                setProduct(prev => (
                    {
                        ...prev,
                        variants: prev.variants.map(vari =>
                            vari.size_id === sizeId && vari.color_id === colorId
                                ? {
                                    ...vari,
                                    price: prev.variants.find(v => v.color_id === colorId && sizesChained[colorId].some(sId => v.size_id === sId))
                                        ? prev.variants.find(v => v.color_id === colorId && sizesChained[colorId].some(sId => v.size_id === sId)).price
                                        : vari.price
                                }
                                : vari
                        )
                    }
                ))
                setSizesChained(prev => (
                    {
                        ...prev,
                        [colorId]: prev[colorId].concat(sizeId)
                    }
                ))
            }
        }
    }

    function handleChainColor(colorId) {
        //unchain
        if (colorsChained.includes(colorId)) {
            setColorsChained(prev => prev.filter(ele => ele !== colorId))
        }
        //chain
        else {
            setProduct(prev => (
                {
                    ...prev,
                    variants: prev.variants.map(vari =>
                        vari.color_id === colorId
                            ? {
                                ...vari,
                                price: colorsChained.length > 0
                                    ? prev.variants.find(v => colorsChained.some(cId => v.color_id === cId && v.size_id === vari.size_id)).price
                                    : vari.price
                            }
                            : vari
                    )
                }
            ))
            setColorsChained(prev => prev.concat(colorId))
            if (Object.keys(sizesChained).map(ele => Number(ele)).some(cId => colorsChained.includes(cId))) {
                setSizesChained(prev => ({ ...prev, [colorId]: prev[Object.keys(prev).map(ele => Number(ele)).find(cId => colorsChained.includes(cId))] }))
            }
        }
    }

    function handleAddNewImage() {
        const colorId = product.colors_ids[colorIndex]
        setImages(prev => ({
            ...prev,
            [colorId]: prev[colorId].concat({
                src: typeof Object.values(product.printify_ids)[0] === 'string'
                    ? ''
                    : { front: '', back: '' },
                color_id: colorId,
                hover: false,
                showcase: false
            })
        }))
    }

    function handleChangePrice(value, sizeId) {
        if (sizesChained[product.colors_ids[colorIndex]].includes(sizeId) && isCurrentColorChained())
            changeChainedColorsChainedSizesPrice(value)
        else if (isCurrentColorChained())
            changeChainedColorsUnchainedSizePrice(sizeId, value)
        else if (sizesChained[product.colors_ids[colorIndex]].includes(sizeId))
            changeChainedSizesUnchainedColorPrice(product.colors_ids[colorIndex], value)
        else
            changeVariantPrice(sizeId, product.colors_ids[colorIndex], value)
    }

    function isCurrentColorChained() {
        return colorsChained.includes(product.colors_ids[colorIndex])
    }

    function changeVariantPrice(sizeId, colorId, value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    vari.size_id === sizeId && vari.color_id === colorId
                        ? { ...vari, price: value }
                        : vari
                )
            }
        ))
    }

    function changeChainedSizesUnchainedColorPrice(colorId, value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    sizesChained[product.colors_ids[colorIndex]].some(sId => vari.size_id === sId && vari.color_id === colorId)
                        ? { ...vari, price: value }
                        : vari
                )
            }
        ))
    }

    function changeChainedColorsChainedSizesPrice(value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    sizesChained[product.colors_ids[colorIndex]].some(sId => vari.size_id === sId) && colorsChained.some(cId => vari.color_id === cId)
                        ? { ...vari, price: value }
                        : vari
                )
            }
        ))
    }

    function changeChainedColorsUnchainedSizePrice(sizeId, value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    colorsChained.some(cId => vari.color_id === cId && vari.size_id === sizeId)
                        ? { ...vari, price: value }
                        : vari
                )
            }
        ))
    }

    function updateProductField(fieldName, newValue) {
        setFieldChanged(prev => ({ ...prev, [fieldName]: true }))
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    async function updateProduct() {
        setDisableUpdateButton(true)
        try {
            if (!isNewProductValid(product, images)) {
                setDisableUpdateButton(false)
                return
            }
            const newMinPrice = product.variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, product.variants[0].price)
            const newProduct = {
                ...product,
                variants: product.variants.map(vari => ({ id: vari.id, art: vari.art, sales: vari.sales, price: vari.price, size_id: vari.size_id, color_id: vari.color_id })),
                promotion: product.promotion
                    ? { ...product.promotion, min_price_original: newMinPrice }
                    : null,
                min_price: product.promotion
                    ? Math.round(newMinPrice * (1 - product.promotion.percentage))
                    : newMinPrice,
                images: product.colors_ids.reduce((acc, color_id) => acc.concat(images[color_id].map(img => ({ src: img.src, color_id: img.color_id }))), []),
            }

            const diff = getObjectsDiff(newProduct, inicialProduct)
            const diffKeys = Object.keys(diff)

            if (diffKeys.length === 0) {
                showToast({ msg: 'No changes made.' })
                setDisableUpdateButton(false)
                return
            }

            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                },
                body: JSON.stringify({
                    product_id: newProduct.id,
                    product_new_fields: diffKeys.reduce((acc, diffKey) => ({ ...acc, [diffKey]: newProduct[diffKey] }), {})
                })
            }
            await fetch("/api/product", options)
                .then(response => response.json())
                .then(response => {
                    if (response.error) {
                        setDisableUpdateButton(false)
                        showToast({ type: 'error', msg: tToasts(response.error) })
                    }
                    else {
                        setInicialProduct(newProduct)
                        showToast({ type: 'success', msg: tToasts(response.message) })
                        router.push(`/admin/products/${product.type_id}`)
                    }
                })
                .catch(() => {
                    setDisableUpdateButton(false)
                    showToast({ type: 'error', msg: 'default_error' })
                })
        }
        catch (error) {
            setDisableUpdateButton(false)
            console.error('Error updating product', error)
            showToast({ type: 'error', msg: 'default_error' })
        }
    }

    function handleChangeColors(value, i, color) {
        setProduct(prev => {
            setColorIndex(prevIndex => value.length > prev.colors_ids.length
                ? value.length - 1
                : prevIndex >= prev.colors_ids.length - 1
                    ? value.length - 1
                    : prevIndex
            )
            // add color
            if (value.length > prev.colors_ids.length) {
                setColorsChained(prevC => prevC.concat(color.id))
                setSizesChained(sizesChainedPrev =>
                    Object.keys(sizesChainedPrev).map(ele => Number(ele)).some(cId => colorsChained.includes(cId))
                        ? { ...sizesChainedPrev, [color.id]: sizesChainedPrev[Object.keys(sizesChainedPrev).map(ele => Number(ele)).find(cId => colorsChained.includes(cId))] }
                        : { ...sizesChainedPrev, [color.id]: [] }
                )
                setImages(prevImgs => ({ ...prevImgs, [color.id]: [{ src: '', color_id: color.id }, { src: '', color_id: color.id }, { src: '', color_id: color.id }, { src: '', color_id: color.id }] }))

                return {
                    ...prev,
                    colors_ids: value.map(cl => cl.id),
                    variants: prev.variants
                        .concat(
                            TYPE.variants
                                .filter(vari => color.id === vari.color_id && prev.sizes_ids.includes(vari.size_id))
                                .map(vari => ({ ...vari, art: { id: artIdChained ? prev.id : '', color_id: artColorChained && prev.variants.length > 0 ? prev.variants[0].art.color_id : null } }))
                        )
                }
            }
            // remove color
            else {
                setColorsChained(prevC => prevC.filter(ccId => ccId !== color.id))
                setSizesChained(prevS => {
                    delete prevS[color.id]
                    return prevS
                })
                setImages(prevImgs => {
                    delete prevImgs[color.id]
                    return prevImgs
                })
                return {
                    ...prev,
                    colors_ids: value.map(cl => cl.id),
                    variants: prev.variants
                        .filter(vari => value.some(cl => cl.id === vari.color_id))
                }
            }
        })
    }

    function updateImageSrc(newValue, index) {
        const colorId = product.colors_ids[colorIndex]
        setImages(prev => ({
            ...prev,
            [colorId]: prev[colorId].map((img, i) => index === i
                ? { ...img, src: typeof img.src === 'string' ? newValue : { ...img.src, [viewStatus]: newValue } }
                : img
            )
        }))
    }

    function handleDeleteImageField(index) {
        const colorId = product.colors_ids[colorIndex]
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].filter((img, i) => index !== i) }))
    }


    function handlePrintifyId(providerId, newValue, artPosition) {
        setProduct(prev => ({
            ...prev,
            printify_ids: typeof Object.values(prev.printify_ids)[0] === 'string'
                ? { ...prev.printify_ids, [providerId]: newValue }
                : { ...prev.printify_ids, [providerId]: { ...prev.printify_ids[providerId], [artPosition]: newValue } }
        }))
    }

    function handleChangeSizes(value, i, size) {
        setProduct(prev =>
            value.length > prev.sizes_ids.length
                // add size
                ? {
                    ...prev,
                    sizes_ids: value.map(sz => sz.id),
                    variants: prev.variants
                        .concat(
                            TYPE.variants
                                .filter(vari => size.id === vari.size_id && prev.colors_ids.includes(vari.color_id))
                                .map(vari => ({ ...vari, art: { id: artIdChained ? prev.id : '', color_id: artColorChained && prev.variants.length > 0 ? prev.variants[0].art.color_id : null } }))
                        )
                }
                // remove size
                : {
                    ...prev,
                    sizes_ids: value.map(sz => sz.id),
                    variants: prev.variants
                        .filter(vari => value.some(sz => sz.id === vari.size_id))
                }
        )
    }

    function handleChainArtColor() {
        setArtColorChained(prev => {
            if (!prev) //connecting
                setProduct(prod => ({ ...prod, variants: prod.variants.map(vari => ({ ...vari, art: { ...vari.art, color_id: prod.variants[0].art.color_id } })) }))
            return !prev
        })
    }

    function handleArtColor(value, i, color) {
        if (artColorChained)
            setProduct(prev => (
                {
                    ...prev,
                    variants: prev.variants.map(vari => ({ ...vari, art: { ...vari.art, color_id: color.id === vari.art.color_id ? null : color.id } }))
                }
            ))
        else
            setProduct(prev => (
                {
                    ...prev,
                    variants: prev.variants.map(vari => vari.color_id === prev.colors_ids[colorIndex]
                        ? { ...vari, art: { ...vari.art, color_id: color.id === vari.art.color_id ? null : color.id } }
                        : vari
                    )
                }
            ))
    }

    function handleChainArtId() {
        setArtIdChained(prev => {
            if (!prev) //connecting
                setProduct(prod => ({ ...prod, variants: prod.variants.map(vari => ({ ...vari, art: { ...vari.art, id: prod.id } })) }))
            else //disconnecting
                setProduct(prod => ({ ...prod, variants: prod.variants.map(vari => ({ ...vari, art: { ...vari.art, id: null } })) }))
            return !prev
        })
    }

    function handleArtId(event) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari => vari.color_id === prev.colors_ids[colorIndex]
                    ? { ...vari, art: { ...vari.art, id: event.target.value } }
                    : vari
                )
            }
        ))
    }

    function handleBackVariant(event) {
        if (event.target.checked) {
            if (images)
                setImages(prev => (
                    Object.keys(prev).reduce((acc, key) => ({
                        ...acc,
                        [key]: [
                            ...prev[key].map(img => ({ ...img, src: { front: img.src, back: '' } })),
                        ]
                    }), {})
                ))
            setProduct(prev => ({
                ...prev,
                printify_ids: Object.keys(prev.printify_ids).reduce((acc, key) => ({ ...acc, [key]: { front: prev.printify_ids[key], back: '' } }), {})
            }))
        }
        else {
            if (images)
                setImages(prev =>
                    Object.keys(prev).reduce((acc, key) => ({
                        ...acc,
                        [key]: prev[key].map(img => ({ ...img, src: img.src.front }))
                    }), {})
                )
            setProduct(prev => ({
                ...prev,
                printify_ids: Object.keys(prev.printify_ids).reduce((acc, key) => ({
                    ...acc,
                    [key]: prev.printify_ids[key].front
                }), {})
            }))
        }
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <main className={styles.main}>
                        {product &&
                            <Link
                                href={`/admin/products/${product.type_id}`}
                                style={{
                                    position: 'absolute',
                                    left: 110,
                                }}
                            >
                                <MyButton
                                    variant='outlined'
                                    className='flex center'
                                >
                                    <KeyboardArrowLeftOutlinedIcon
                                        sx={{
                                            marginLeft: -1.2
                                        }}
                                    />
                                    Back
                                </MyButton>
                            </Link>
                        }
                        {product &&
                            <div className={styles.sectionsContainer}>
                                <section className='flex center column fillWidth'>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!product.disabled}
                                                onChange={event => updateProductField('disabled', !event.target.checked)}
                                                color='success'
                                            />
                                        }
                                        label="Visible"
                                    />
                                    <h2>ID: {product.id}</h2>
                                </section>
                                <section className={styles.section}>
                                    <div className={styles.sectionLeft}>
                                        <TextInput
                                            label='Title'
                                            value={product.title}
                                            onChange={event => updateProductField('title', event.target.value)}
                                            colorText={fieldChanged['title'] ? 'var(--color-success)' : 'var(--text-color)'}
                                        />
                                        <Selector
                                            label='Collection'
                                            options={COLLECTIONS.map(coll => ({ value: coll.id, name: coll.title }))}
                                            value={product.collection_id || ''}
                                            style={{
                                                height: 56,
                                            }}
                                            onChange={event => updateProductField('collection_id', event.target.value)}
                                            colorText={fieldChanged['collection'] ? 'var(--color-success)' : 'var(--text-color)'}
                                        />
                                        <TagsSelector
                                            options={THEMES_POOL.map(theme => theme.id)}
                                            label='Themes'
                                            value={product.themes}
                                            onChange={(event, value) => updateProductField('themes', value)}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                        <TagsSelector
                                            options={TAGS_POOL}
                                            label='Tags'
                                            value={product.tags}
                                            onChange={(event, value) => updateProductField('tags', value)}
                                        />
                                    </div>
                                    <div className={styles.sectionRight}>
                                        {TYPE.providers.map(prov_id => PROVIDERS_POOL[prov_id]).map((provider, i) =>
                                            <PrintifyIdPicker
                                                onChoose={productPrintifyId => handlePrintifyId(provider.id, productPrintifyId, 'front')}
                                                key={i}
                                                value={typeof product.printify_ids[provider.id] === 'string' ? product.printify_ids[provider.id] : product.printify_ids[provider.id].front}
                                                colorText='var(--color-success)'
                                                provider={provider}
                                                blueprint_ids={TYPE.blueprint_ids}
                                                style={{
                                                    width: '100%',
                                                }}
                                            />
                                        )}
                                        {TYPE.allow_back_variant &&
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={typeof Object.values(product.printify_ids)[0] !== 'string'}
                                                        onChange={handleBackVariant}
                                                        color='success'
                                                    />
                                                }
                                                label="Back Variant"
                                            />
                                        }
                                        {typeof Object.values(product.printify_ids)[0] !== 'string' && TYPE.allow_back_variant && TYPE.providers.map(prov_id => PROVIDERS_POOL[prov_id]).map((provider, i) =>
                                            <PrintifyIdPicker
                                                onChoose={productPrintifyId => handlePrintifyId(provider.id, productPrintifyId, 'back')}
                                                key={i}
                                                value={typeof product.printify_ids[provider.id] === 'string' ? product.printify_ids[provider.id] : product.printify_ids[provider.id].back}
                                                colorText='var(--color-success)'
                                                provider={provider}
                                                blueprint_ids={TYPE.blueprint_ids}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        )}
                                    </div>
                                </section>
                                <section
                                    className='fillWidth flex center column'
                                    style={{ gap: '1rem' }}
                                >
                                    <SizesSelector
                                        value={SIZES}
                                        options={TYPE.sizes.map(sz_id => SIZES_POOL.find(size => size.id === sz_id))}
                                        onChange={handleChangeSizes}
                                    />
                                    <ColorSelector
                                        value={COLORS}
                                        options={TYPE.colors.map(cl_id => COLORS_POOL[cl_id])}
                                        onChange={handleChangeColors}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                </section>
                                {product.colors_ids.length > 0 && product.sizes_ids.length > 0 &&
                                    <section className={styles.section}>
                                        <div className={styles.sectionLeft}>
                                            <div>
                                                <h3>
                                                    Product Colors
                                                </h3>
                                                <ColorSelector
                                                    value={[COLORS_POOL[product.colors_ids[colorIndex]]]}
                                                    options={product.colors_ids.map(cl_id => COLORS_POOL[cl_id])}
                                                    onChange={handleSelectedColor}
                                                    style={{
                                                        paddingTop: '1rem',
                                                        paddingBottom: '1rem',
                                                    }}
                                                />
                                                <div className='flex' style={{ gap: '0.5rem' }}>
                                                    {product.colors_ids.map((color_id, i) =>
                                                        <MyButton
                                                            key={i}
                                                            variant={colorsChained.includes(color_id) ? 'contained' : 'outlined'}
                                                            onClick={() => handleChainColor(color_id)}
                                                            style={{
                                                                minWidth: 40,
                                                                width: 40,
                                                                height: 40,
                                                                padding: 0,
                                                            }}
                                                        >
                                                            {colorsChained.includes(color_id) ? <Chain iconSize={25} /> : <BrokeChain iconSize={25} />}
                                                        </MyButton>
                                                    )}
                                                </div>
                                            </div>
                                            {sizesChained[product.colors_ids[colorIndex]] &&
                                                <div className='flex column' style={{ gap: '1rem' }}>
                                                    <div
                                                        className='flex center column fillWidth'
                                                        style={{
                                                            gap: '1rem'
                                                        }}
                                                    >
                                                        <h3>
                                                            {COLORS_POOL[product.colors_ids[colorIndex]].title} Price (USD)
                                                        </h3>
                                                    </div>
                                                    <div>
                                                        <h3>Images</h3>
                                                        {typeof Object.values(product.printify_ids)[0] !== 'string' &&
                                                            <ButtonGroup
                                                                sx={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <MyButton
                                                                    variant={viewStatus === 'front' ? 'contained' : 'outlined'}
                                                                    onClick={() => setViewStatus('front')}
                                                                    style={{
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Front
                                                                </MyButton>
                                                                <MyButton
                                                                    variant={viewStatus === 'back' ? 'contained' : 'outlined'}
                                                                    onClick={() => setViewStatus('back')}
                                                                    style={{
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Back
                                                                </MyButton>
                                                            </ButtonGroup>
                                                        }
                                                        {images[product.colors_ids[colorIndex]].length > 0 &&
                                                            <div className='flex row justify-end' style={{ fontSize: '11px', gap: '1rem', width: '100%', paddingRight: '11%' }}>
                                                                <p>showcase</p>
                                                                <p>hover</p>
                                                            </div>
                                                        }
                                                        <div className='flex column' style={{ gap: '0.8rem' }} >
                                                            {images[product.colors_ids[colorIndex]].map((img, i) =>
                                                                <div
                                                                    className='flex row align-center fillWidth space-between'
                                                                    key={i}
                                                                >
                                                                    <TextInput
                                                                        label={`Image ${i + 1}`}
                                                                        onChange={event => updateImageSrc(event.target.value, i)}
                                                                        style={{
                                                                            width: '70%'
                                                                        }}
                                                                        value={typeof img.src === 'string' ? img.src : img.src[viewStatus]}
                                                                    />
                                                                    <Checkbox
                                                                        checked={i === product.image_showcase_index}
                                                                        onChange={event => updateProductField('image_showcase_index', event.target.checked ? i : -1)}
                                                                        sx={{
                                                                            color: '#ffffff'
                                                                        }}
                                                                    />
                                                                    <Checkbox
                                                                        checked={i === product.image_hover_index}
                                                                        onChange={event => updateProductField('image_hover_index', event.target.checked ? i : -1)}
                                                                        sx={{
                                                                            color: '#ffffff'
                                                                        }}
                                                                    />
                                                                    <ButtonIcon
                                                                        icon={<ClearRoundedIcon />}
                                                                        onClick={() => handleDeleteImageField(i)}
                                                                    />
                                                                </div>
                                                            )}
                                                            <MyButton
                                                                variant='outlined'
                                                                onClick={handleAddNewImage}
                                                                style={{
                                                                    width: '100%',
                                                                    marginBottom: '1rem'
                                                                }}
                                                            >
                                                                Add New Image
                                                            </MyButton>
                                                        </div>
                                                        <div
                                                            className='flex center column fillWidth'
                                                            style={{
                                                                gap: '1rem'
                                                            }}
                                                        >
                                                            <h3>
                                                                {tCommon(COLORS_POOL[product.colors_ids[colorIndex]].title)} Price (USD)
                                                            </h3>
                                                            {SIZES?.map((size, i) =>
                                                                <ProductPriceInput
                                                                    productType={product.type_id}
                                                                    onClickChain={() => handleChainSize(size.id)}
                                                                    chained={sizesChained[product.colors_ids[colorIndex]].includes(size.id)}
                                                                    size={size}
                                                                    key={i}
                                                                    product={product}
                                                                    onChangeText={event => handleChangePrice(isNaN(Number(event.target.value)) ? 0 : Math.abs(Number(event.target.value.slice(0, Math.min(event.target.value.length, 7)))), size.id)}
                                                                    onChangeSlider={event => handleChangePrice(event.target.value, size.id)}
                                                                    price={product.variants.find(vari => vari.size_id === size.id && vari.color_id === product.colors_ids[colorIndex]).price}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className={styles.sectionRight}>
                                            <h3>
                                                Preview
                                            </h3>
                                            {images?.[product?.colors_ids?.[colorIndex]] &&
                                                <ImagesSliderEditable
                                                    images={Object.keys(images).reduce((acc, key) => acc.concat(images[key]), []).map(img => ({ ...img, src: typeof img.src === 'string' ? img.src : img.src[viewStatus] }))}
                                                    currentColor={COLORS_POOL[product.colors_ids[colorIndex]]}
                                                    colors={COLORS}
                                                />
                                            }
                                            <div className='flex row center' style={{ gap: '1rem' }}>
                                                <MyButton
                                                    variant={artColorChained ? 'contained' : 'outlined'}
                                                    onClick={handleChainArtColor}
                                                    style={{
                                                        minWidth: 27,
                                                        width: 27,
                                                        height: 27,
                                                        padding: 0,
                                                    }}
                                                >
                                                    {artColorChained ? <Chain iconSize={20} /> : <BrokeChain iconSize={20} />}
                                                </MyButton>
                                                <h3>
                                                    Art Color
                                                </h3>
                                            </div>
                                            <ColorSelector
                                                value={[SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color], title: cl.color_display.title })).find(scl => scl.id === product.variants.find(vari => vari.color_id === product.colors_ids[colorIndex]).art.color_id)]}
                                                options={SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color], title: cl.color_display.title }))}
                                                onChange={handleArtColor}
                                                style={{
                                                    paddingBottom: '1rem',
                                                }}
                                            />
                                            <div className='flex row center' style={{ gap: '1rem' }}>
                                                <MyButton
                                                    variant={artIdChained ? 'contained' : 'outlined'}
                                                    onClick={handleChainArtId}
                                                    style={{
                                                        minWidth: 56,
                                                        width: 56,
                                                        height: 56,
                                                        padding: 0,
                                                    }}
                                                >
                                                    {artIdChained ? <Chain /> : <BrokeChain />}
                                                </MyButton>
                                                <TextInput
                                                    disabled={artIdChained}
                                                    label='Art ID'
                                                    value={product.variants.find(vari => vari.color_id === product.colors_ids[colorIndex]).art.id || ''}
                                                    onChange={handleArtId}
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </section>
                                }
                                <LoadingButton
                                    onClick={updateProduct}
                                    loading={disableUpdateButton}
                                    variant='contained'
                                    size='large'
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    Update Product
                                </LoadingButton>
                            </div>
                        }
                        {product === null &&
                            <div>
                                <h1>Product not exist</h1>
                            </div>
                        }
                        {product === undefined &&
                            <div>
                            </div>
                        }
                    </main>
                </div>
    )
})

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}