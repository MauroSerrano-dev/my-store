import ImagesSliderEditable from '@/components/ImagesSliderEditable'
import styles from '@/styles/admin/products/type_id/new.module.css'
import { FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import { COLLECTIONS, TAGS_POOL, THEMES_POOL, PRODUCTS_TYPES, COLORS_POOL, SIZES_POOL, PROVIDERS_POOL, SEARCH_ART_COLORS, COMMON_TRANSLATES } from '@/consts'
import ColorSelector from '@/components/ColorSelector'
import TextInput from '@/components/material-ui/TextInput'
import TagsSelector from '@/components/material-ui/TagsSelector'
import SizesSelector from '@/components/SizesSelector'
import Chain from '@/components/svgs/Chain'
import BrokeChain from '@/components/svgs/BrokeChain'
import { showToast } from '@/utils/toasts'
import NoFound404 from '@/components/NoFound404'
import Selector from '@/components/material-ui/Selector'
import { isNewProductValid } from '@/utils/edit-product'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import TextOutlinedInput from '@/components/material-ui/TextOutlinedInput'
import { useAppContext } from '@/components/contexts/AppContext'
import MyButton from '@/components/material-ui/MyButton'
import { LoadingButton } from '@mui/lab'
import PrintifyIdPicker from '@/components/PrintifyIdPicker'
import ProductPriceInput from '@/components/ProductPriceInput'
import { variantModel } from '@/utils/models'
import ImagesEditor from '@/components/editors/ImagesEditor'

const INICIAL_PRODUCT = {
    id: '',
    title: '',
    collection_id: null,
    disabled: true,
    colors_ids: [],
    sizes_ids: [],
    images: [],
    tags: [],
    themes: [],
    variants: [],
    image_showcase_index: 0,
    image_hover_index: 1,
    popularity: 0,
    printify_ids: [],
    total_sales: 0,
}

export default withRouter(() => {
    const {
        router,
        session,
        setAdminMenuOpen,
        isAdmin,
    } = useAppContext()

    const [product, setProduct] = useState(INICIAL_PRODUCT)
    const [colorIndex, setColorIndex] = useState(0)
    const [images, setImages] = useState()
    const [type, setType] = useState()
    const [colorsChained, setColorsChained] = useState([])
    const [sizesChained, setSizesChained] = useState({})
    const [loadingCreateButton, setLoadingCreateButton] = useState(false)
    const [artIdChained, setArtIdChained] = useState(true)
    const [artColorChained, setArtColorChained] = useState(true)
    const [viewStatus, setViewStatus] = useState('front')

    const tColors = useTranslation('colors').t
    const tToasts = useTranslation('toasts').t

    useEffect(() => {
        console.log('variants', product?.variants)
    }, [product])

    useEffect(() => {
        setAdminMenuOpen(false)
    }, [])

    useEffect(() => {
        if (router.isReady) {
            const { type_id } = router.query
            const tp = PRODUCTS_TYPES.find(t => t.id === type_id)
            if (tp) {
                setProduct(prev => (
                    {
                        ...prev,
                        type_id: tp.id,
                        family_id: tp.family_id,
                        printify_ids: tp.providers.reduce((acc, prov_id) => ({ ...acc, [prov_id]: '' }), {}),
                        sizes_ids: tp.sizes,
                        tags: tp.inicial_tags,
                    }
                ))
                setType(tp)
            }
        }
    }, [router])

    async function createProduct() {
        setLoadingCreateButton(true)

        if (!isNewProductValid(product, images, tToasts)) {
            setLoadingCreateButton(false)
            return
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
            },
            body: JSON.stringify({
                product: {
                    ...product,
                    id: product.id + '-' + type.id,
                    collection_id: product.collection_id,
                    title_lower_case: product.title.toLowerCase(),
                    min_price: product.variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, product.variants[0].price),
                    images: product.colors_ids.reduce((acc, color_id) => acc.concat(images[color_id].map(img => ({ src: img.src, color_id: img.color_id }))), []),
                    variants: product.variants.map(vari => variantModel(vari)),
                    promotion: null,
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                if (response.status < 300) {
                    showToast({ type: 'success', msg: tToasts(response.msg) })
                    router.push(`/admin/products/${router.query.type_id}`)
                }
                else {
                    setLoadingCreateButton(false)
                    showToast({ type: 'error', msg: tToasts(response.msg) })
                }
            })
            .catch(error => {
                console.error(error)
                setLoadingCreateButton(false)
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    function updateProductField(fieldName, newValue) {
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    function handlePrintifyId(providerId, newValue, artPosition) {
        setProduct(prev => ({
            ...prev,
            printify_ids: typeof Object.values(prev.printify_ids)[0] === 'string'
                ? { ...prev.printify_ids, [providerId]: newValue }
                : { ...prev.printify_ids, [providerId]: { ...prev.printify_ids[providerId], [artPosition]: newValue } }
        }))
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
                setImages(prevImgs => {
                    return {
                        ...prevImgs,
                        [color.id]: []
                    }
                })
                return {
                    ...prev,
                    colors_ids: value.map(cl => cl.id),
                    variants: prev.variants
                        .concat(
                            type.variants
                                .filter(vari => color.id === vari.color_id && prev.sizes_ids.includes(vari.size_id))
                                .map(vari => (
                                    {
                                        ...vari,
                                        price: prev.variants.filter(varia => colorsChained.includes(varia.color_id) && varia.size_id === vari.size_id).length > 0
                                            ? prev.variants.find(varia => colorsChained.includes(varia.color_id) && varia.size_id === vari.size_id).price
                                            : vari.inicial_price,
                                        art: {
                                            id: artIdChained
                                                ? prev.id
                                                : '',
                                            color_id: artColorChained && prev.variants.length > 0
                                                ? prev.variants[0].art.color_id
                                                : null
                                        }
                                    }
                                ))
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

    function handleSelectedColor(value, i) {
        setColorIndex(i)
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
                            type.variants
                                .filter(vari => size.id === vari.size_id && prev.colors_ids.includes(vari.color_id))
                                .map(vari => (
                                    {
                                        ...vari,
                                        price: vari.inicial_price,
                                        art: {
                                            id: artIdChained
                                                ? prev.id
                                                : '',
                                            color_id: artColorChained && prev.variants.length > 0
                                                ? prev.variants[0].art.color_id
                                                : null
                                        }
                                    }
                                ))
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
                                    ? prev.variants.find(v => colorsChained.includes(v.color_id) && vari.size_id === v.size_id).price
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

    function changeChainedColorsChainedSizesPrice(value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    sizesChained[product.colors_ids[colorIndex]].some(sId => vari.size_id === sId) && colorsChained.includes(vari.color_id)
                        ? { ...vari, price: Number(value) }
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
                        ? { ...vari, price: Number(value) }
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.size_id === sId && vari.color_id === colorId)
                        ? { ...vari, price: Number(value) }
                        : vari
                )
            }
        ))
    }

    function changeVariantPrice(sizeId, colorId, value) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari =>
                    vari.size_id === sizeId && vari.color_id === colorId
                        ? { ...vari, price: Number(value) }
                        : vari
                )
            }
        ))
    }

    function handleChangePrice(value, sizeId) {
        const colorId = product.colors_ids[colorIndex]
        if (sizesChained[product.colors_ids[colorIndex]].includes(sizeId) && isCurrentColorChained())
            changeChainedColorsChainedSizesPrice(value)
        else if (isCurrentColorChained())
            changeChainedColorsUnchainedSizePrice(sizeId, value)
        else if (sizesChained[product.colors_ids[colorIndex]].includes(sizeId))
            changeChainedSizesUnchainedColorPrice(colorId, value)
        else
            changeVariantPrice(sizeId, colorId, value)
    }

    function isCurrentColorChained() {
        return colorsChained.includes(product.colors_ids[colorIndex])
    }

    function handleArtColor(value, i, color) {
        if (artColorChained)
            setProduct(prev => (
                {
                    ...prev,
                    variants: prev.variants.map(vari => ({
                        ...vari,
                        art: {
                            ...vari.art,
                            color_id: color.id === vari.art.color_id
                                ? null
                                : color.id
                        }
                    }))
                }
            ))
        else
            setProduct(prev => (
                {
                    ...prev,
                    variants: prev.variants.map(vari => vari.color_id === prev.colors[colorIndex].id
                        ? { ...vari, art: { ...vari.art, color_id: color.id === vari.art.color_id ? null : color.id } }
                        : vari
                    )
                }
            ))
    }

    function handleArtId(event) {
        setProduct(prev => (
            {
                ...prev,
                variants: prev.variants.map(vari => ({ ...vari, art: { ...vari.art, id: event.target.value } }))
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

    function handleChainArtColor() {
        setArtColorChained(prev => {
            if (!prev) //connecting
                setProduct(prod => ({ ...prod, variants: prod.variants.map(vari => ({ ...vari, art: { ...vari.art, color_id: prod.variants[0].art.color_id } })) }))
            return !prev
        })
    }

    function handleChangeId(event) {
        const value = event.target.value.toLowerCase().replaceAll(' ', '-')
        if (artIdChained)
            setProduct(prev => ({ ...prev, id: value, variants: prev.variants.map(vari => ({ ...vari, art: { ...vari.art, id: value } })) }))
        else
            setProduct(prev => ({ ...prev, id: value }))
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
            : session === null || !isAdmin
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        {type &&
                            <div className={styles.sectionsContainer}>
                                <section className={`${styles.section} ${styles.one}`}>
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
                                    <div className='flex center fillWidth'>
                                        <TextOutlinedInput
                                            colorText='var(--color-success)'
                                            label='ID'
                                            value={product.id}
                                            onChange={handleChangeId}
                                            style={{
                                                width: '100%'
                                            }}
                                            inputAdornment={
                                                <p>
                                                    -{type.id}
                                                </p>
                                            }
                                        />
                                    </div>
                                </section>
                                <section className={styles.section}>
                                    <div className={styles.sectionLeft}>
                                        <TextInput
                                            colorText='var(--color-success)'
                                            label='Title'
                                            value={product.title}
                                            onChange={event => updateProductField('title', event.target.value)}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                        <Selector
                                            label='Collection'
                                            options={[{ id: 'none', title: 'None' }].concat(COLLECTIONS).map(coll => ({ value: coll.id, name: coll.title }))}
                                            value={product.collection_id || 'none'}
                                            style={{
                                                height: 56,
                                                color: 'var(--color-success)'
                                            }}
                                            onChange={event => updateProductField('collection_id', event.target.value === 'none' ? null : event.target.value)}
                                        />
                                        <TagsSelector
                                            options={THEMES_POOL}
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
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sectionRight}>
                                        {type.providers.map(prov_id => PROVIDERS_POOL[prov_id]).map((provider, i) =>
                                            <PrintifyIdPicker
                                                onChoose={productPrintifyId => handlePrintifyId(provider.id, productPrintifyId, 'front')}
                                                key={i}
                                                value={typeof product.printify_ids[provider.id] === 'string' ? product.printify_ids[provider.id] : product.printify_ids[provider.id].front}
                                                colorText='var(--color-success)'
                                                provider={provider}
                                                blueprint_ids={type.blueprint_ids}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        )}
                                        {type.allow_back_variant &&
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
                                        {typeof Object.values(product.printify_ids)[0] !== 'string' && type.allow_back_variant && type.providers.map(prov_id => PROVIDERS_POOL[prov_id]).map((provider, i) =>
                                            <PrintifyIdPicker
                                                onChoose={productPrintifyId => handlePrintifyId(provider.id, productPrintifyId, 'back')}
                                                key={i}
                                                value={typeof product.printify_ids[provider.id] === 'string' ? product.printify_ids[provider.id] : product.printify_ids[provider.id].back}
                                                colorText='var(--color-success)'
                                                provider={provider}
                                                blueprint_ids={type.blueprint_ids}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        )}
                                    </div>
                                </section>
                                <section className={`${styles.section} ${styles.two}`}>
                                    <h3>
                                        {type.title} Colors Pool
                                    </h3>
                                    <ColorSelector
                                        value={product.colors_ids.map(cl_id => COLORS_POOL[cl_id])}
                                        options={type.colors.map(cl_id => COLORS_POOL[cl_id])}
                                        onChange={handleChangeColors}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                    <SizesSelector
                                        value={product.sizes_ids.map(sz_id => SIZES_POOL.find(sz => sz.id === sz_id))}
                                        options={type.sizes.map(sz_id => SIZES_POOL.find(size => size.id === sz_id))}
                                        onChange={handleChangeSizes}
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
                                                {images?.[product?.colors_ids?.[colorIndex]] &&
                                                    <div className='flex column' style={{ gap: '1rem' }}>
                                                        <div>
                                                            <ImagesEditor
                                                                product_id={product.id + '-' + type.id}
                                                                product={product}
                                                                colorIndex={colorIndex}
                                                                images={images}
                                                                setImages={setImages}
                                                                updateProductField={updateProductField}
                                                                viewStatus={viewStatus}
                                                                setViewStatus={setViewStatus}
                                                            />
                                                        </div>
                                                        <div
                                                            className='flex center column fillWidth'
                                                            style={{
                                                                gap: '1rem'
                                                            }}
                                                        >
                                                            <h3>
                                                                {tColors(COLORS_POOL[product.colors_ids[colorIndex]].id_string)} Price (USD)
                                                            </h3>
                                                            {product.sizes_ids.map((size_id, i) =>
                                                                <ProductPriceInput
                                                                    productType={type.id}
                                                                    onClickChain={() => handleChainSize(size_id)}
                                                                    chained={sizesChained[product.colors_ids[colorIndex]].includes(size_id)}
                                                                    size={SIZES_POOL.find(sz => sz.id === size_id)}
                                                                    key={i}
                                                                    product={product}
                                                                    onChangeText={event => handleChangePrice(isNaN(Number(event.target.value)) ? 0 : Math.abs(Number(event.target.value.slice(0, Math.min(event.target.value.length, 7)))), size_id)}
                                                                    onChangeSlider={event => handleChangePrice(event.target.value, size_id)}
                                                                    price={product.variants.find(vari => vari.size_id === size_id && vari.color_id === product.colors_ids[colorIndex]).price}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.sectionRight}>
                                            {images?.[product?.colors_ids?.[colorIndex]] &&
                                                <div>
                                                    <h3>
                                                        Preview
                                                    </h3>
                                                    <ImagesSliderEditable
                                                        images={Object.keys(images).reduce((acc, key) => acc.concat(images[key]), []).map(img => ({ ...img, src: typeof img.src === 'string' ? img.src : img.src[viewStatus] }))}
                                                        currentColor={COLORS_POOL[product.colors_ids[colorIndex]]}
                                                        colors={product.colors_ids.map(cl_id => COLORS_POOL[cl_id])}
                                                    />
                                                </div>
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
                                                value={[SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color], id_string: cl.color_display.id_string })).find(scl => scl.id === product.variants.find(vari => vari.color_id === product.colors_ids[colorIndex]).art.color_id)]}
                                                options={SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color], id_string: cl.color_display.id_string }))}
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
                                                    colorText='var(--color-success)'
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
                                    onClick={createProduct}
                                    variant='contained'
                                    loading={loadingCreateButton}
                                    size='large'
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    Create Product
                                </LoadingButton>
                            </div>
                        }
                    </main>
                </ div>
    )
})

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}