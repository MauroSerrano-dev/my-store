import TagsSelector from '@/components/material-ui/TagsSelector';
import TextInput from '@/components/material-ui/TextInput';
import styles from '@/styles/admin/edit-product/id.module.css'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { COLLECTIONS, TAGS_POOL, PRODUCT_TYPES, COLORS_POOL, SIZES_POOL, PROVIDERS_POOL, THEMES_POOL, SEARCH_ART_COLORS } from '../../../../consts';
import ColorSelector from '@/components/ColorSelector';
import SizesSelector from '@/components/SizesSelector';
import { Button, Checkbox, Slider } from '@mui/material';
import Link from 'next/link';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import NoFound404 from '@/pages/404';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Chain from '@/components/svgs/Chain';
import BrokeChain from '@/components/svgs/BrokeChain';
import ButtonIcon from '@/components/material-ui/ButtonIcon';
import ImagesSlider from '@/components/ImagesSlider';
import { showToast } from '../../../../utils/toasts';
import { getObjectsDiff } from '../../../../utils';
import Head from 'next/head';
import Selector from '@/components/material-ui/Selector';

export default withRouter(props => {

    const {
        router,
        supportsHoverAndPointer,
        session,
    } = props;

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

    const TYPE = PRODUCT_TYPES.find(type => type.id === product?.type_id)
    const COLORS = product?.colors_ids.map(cl_id => COLORS_POOL[cl_id])
    const SIZES = product?.sizes_ids.map(sz_id => SIZES_POOL.find(size => size.id === sz_id))

    useEffect(() => {
        if (router.isReady) {
            getProductById(router.query.id)
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
                id: id,
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
            setProduct(product)
            setImages(product.images.reduce((acc, image) => acc[image.color_id] === undefined ? { ...acc, [image.color_id]: product.images.filter(img => img.color_id === image.color_id) } : acc, {}))
        }
    }

    function handleSelectedColor(value, i) {
        setColorIndex(i)
    }

    function handleChainSize(sizeId) {
        const colorId = product.colors[colorIndex].id
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
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].concat({ src: '', variants_id: product.variants.filter(vari => vari.color_id === colorId).map(vari => vari.id), color_id: colorId, hover: false, showcase: false }) }))
    }

    function handleChangePrice(value, sizeId) {
        const colorId = product.colors[colorIndex].id
        if (sizesChained[product.colors[colorIndex].id].includes(sizeId) && isCurrentColorChained())
            changeChainedColorsChainedSizesPrice(value)
        else if (isCurrentColorChained())
            changeChainedColorsUnchainedSizePrice(sizeId, value)
        else if (sizesChained[product.colors[colorIndex].id].includes(sizeId))
            changeChainedSizesUnchainedColorPrice(colorId, value)
        else
            changeVariantPrice(sizeId, colorId, value)
    }

    function isCurrentColorChained() {
        return colorsChained.includes(product.colors[colorIndex].id)
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.size_id === sId && vari.color_id === colorId)
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.size_id === sId) && colorsChained.some(cId => vari.color_id === cId)
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

        const newProduct = {
            ...product,
            min_price: product.variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, product.variants[0].price),
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
                if (response.status < 300) {
                    setInicialProduct(newProduct)
                    showToast({ type: 'success', msg: response.msg })
                    router.push('/admin/edit-product')
                }
                else {
                    showToast({ type: 'error', msg: response.msg })
                }
            })
            .catch(err => showToast({ msg: err }))
        setDisableUpdateButton(false)
    }

    function handleChangeColors(value, i, color) {
        setProduct(prev => {
            setColorIndex(prevIndex => value.length > prev.colors.length
                ? value.length - 1
                : prevIndex >= prev.colors.length - 1
                    ? value.length - 1
                    : prevIndex
            )
            // add color
            if (value.length > prev.colors.length) {
                setColorsChained(prevC => prevC.concat(color.id))
                if (Object.keys(sizesChained).map(ele => Number(ele)).some(cId => colorsChained.includes(cId)))
                    setSizesChained(prev => ({ ...prev, [color.id]: prev[Object.keys(prev).map(ele => Number(ele)).find(cId => colorsChained.includes(cId))] }))
                else {
                    setSizesChained(prev => ({ ...prev, [color.id]: [] }))
                }
            }
            // remove color
            else {
                setColorsChained(prevC => prevC.filter(ccId => ccId !== color.id))
                setSizesChained(prevS => {
                    delete prevS[color.id]
                    return prevS
                })
            }
            return {
                ...prev,
                colors: value,
                images: prev.images.filter(img => img.color_id !== color.id)
            }
        })
    }

    function updateImageField(fieldname, newValue, index) {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].map((img, i) => index === i ? { ...img, [fieldname]: newValue } : img) }))
    }

    function handleDeleteImageField(index) {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].filter((img, i) => index !== i) }))
    }


    function handlePrintifyId(providerId, newValue) {
        setProduct(prev => ({ ...prev, printify_ids: { ...prev.printify_ids, [providerId]: newValue } }))
    }

    useEffect(() => {
        if (product) {
            product.images.forEach(image => {
                const img = new window.Image()
                img.src = image.src
                img.width = 250
                img.height = 300
            })
        }
    }, [product])

    function handleChangeSizes(value) {
        setProduct(prev => (
            {
                ...prev,
                sizes: value,
                variants: TYPE.variants.filter(vari => value.some(sz => sz.id === vari.size_id && prev.colors.some(cl => cl.id === vari.color_id)))
            }
        ))
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
                    variants: prev.variants.map(vari => vari.color_id === prev.colors[colorIndex].id
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
                variants: prev.variants.map(vari => vari.color_id === prev.colors[colorIndex].id
                    ? { ...vari, art: { ...vari.art, id: event.target.value } }
                    : vari
                )
            }
        ))
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <main className={styles.main}>
                        <div className={styles.top}>
                            <div className={styles.productOption}>
                                <Link
                                    href='/admin/edit-product'
                                    className='flex noUnderline'
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <KeyboardArrowLeftRoundedIcon
                                            style={{
                                                marginLeft: '-0.5rem'
                                            }}
                                        />
                                        <p
                                            style={{
                                                color: 'var(--primary)'
                                            }}
                                        >
                                            Back
                                        </p>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {product &&
                            <div className={styles.sectionsContainer}>
                                <section className='flex center fillWidth'>
                                    <h3>Type: {product.type_id}</h3>
                                </section>
                                <section className={styles.section}>
                                    <div className={styles.sectionLeft}>
                                        <TextInput
                                            label='Title'
                                            value={product.title}
                                            onChange={event => updateProductField('title', event.target.value)}
                                            colorText={fieldChanged['title'] ? 'var(--color-success)' : 'var(--text-color)'}
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                        />
                                        <TextInput
                                            label='Description'
                                            value={product.description}
                                            onChange={event => updateProductField('description', event.target.value)}
                                            colorText={fieldChanged['description'] ? 'var(--color-success)' : 'var(--text-color)'}
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                        />
                                        <Selector
                                            label='Collection'
                                            options={COLLECTIONS.map(coll => ({ value: coll.id, name: coll.title }))}
                                            value={product.collection_id}
                                            style={{
                                                height: 56,
                                            }}
                                            onChange={event => updateProductField('collection', COLLECTIONS.find(coll => coll.id === event.target.value))}
                                            colorText={fieldChanged['collection'] ? 'var(--color-success)' : 'var(--text-color)'}
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                        />
                                        <TagsSelector
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                            options={THEMES_POOL.map(theme => theme.id)}
                                            label='Themes'
                                            value={product.themes}
                                            onChange={(event, value) => updateProductField('themes', value)}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sectionRight}>
                                        {TYPE.providers.map(prov_id => PROVIDERS_POOL[prov_id]).map((provider, i) =>
                                            <TextInput
                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                                key={i}
                                                label={`${provider.title} Printify ID`}
                                                onChange={event => handlePrintifyId(provider.id, event.target.value)}
                                                value={product.printify_ids[provider.id]}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        )}
                                        <TagsSelector
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                            options={TAGS_POOL}
                                            label='Tags'
                                            value={product.tags}
                                            onChange={(event, value) => updateProductField('tags', value)}
                                        />
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
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                </section>
                                <section className={styles.section}>
                                    <div className={styles.sectionLeft}>
                                        {product.colors_ids.length > 0 &&
                                            <div>
                                                <ColorSelector
                                                    value={[COLORS_POOL[product.colors_ids[colorIndex]]]}
                                                    options={product.colors_ids.map(cl_id => COLORS_POOL[cl_id])}
                                                    onChange={handleSelectedColor}
                                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                                    style={{
                                                        paddingTop: '1rem',
                                                        paddingBottom: '1rem',
                                                    }}
                                                />
                                                <div className='flex' style={{ gap: '0.5rem' }}>
                                                    {product.colors_ids.map((color_id, i) =>
                                                        <Button
                                                            key={i}
                                                            variant={colorsChained.includes(color_id) ? 'contained' : 'outlined'}
                                                            onClick={() => handleChainColor(color_id)}
                                                            sx={{
                                                                minWidth: 40,
                                                                width: 40,
                                                                height: 40,
                                                                padding: 0,
                                                            }}
                                                        >
                                                            {colorsChained.includes(color_id) ? <Chain iconSize={25} /> : <BrokeChain iconSize={25} />}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        }
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
                                                    {SIZES?.map((size, i) =>
                                                        <div
                                                            className='flex center fillWidth'
                                                            style={{
                                                                gap: '1rem'
                                                            }}
                                                            key={i}
                                                        >
                                                            <Button
                                                                variant={sizesChained[product.colors_ids[colorIndex]].includes(size.id) ? 'contained' : 'outlined'}
                                                                onClick={() => handleChainSize(size.id)}
                                                                sx={{
                                                                    minWidth: 45,
                                                                    width: 45,
                                                                    height: 45,
                                                                    padding: 0,
                                                                }}
                                                            >
                                                                {sizesChained[product.colors_ids[colorIndex]].includes(size.id) ? <Chain /> : <BrokeChain />}
                                                            </Button>
                                                            <TextInput
                                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                                                label={`${size.title}`}
                                                                onChange={event => handleChangePrice(isNaN(Number(event.target.value)) ? 0 : Math.abs(Number(event.target.value.slice(0, Math.min(event.target.value.length, 7)))), size.id)}
                                                                value={product.variants.find(vari => vari.size_id === size.id && vari.color_id === product.colors_ids[colorIndex]).price}
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
                                                                value={product.variants.find(vari => vari.size_id === size.id && vari.color_id === product.colors_ids[colorIndex]).price}
                                                                min={product.variants[0].cost}
                                                                max={product.variants.reduce((acc, vari) => vari.cost > acc.cost ? vari : acc, { cost: 0 }).cost * 3}
                                                                valueLabelDisplay="auto"
                                                                onChange={event => handleChangePrice(event.target.value, size)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3>Images</h3>
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
                                                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                                                    label={`Image ${i + 1}`}
                                                                    onChange={event => updateImageField('src', event.target.value, i)}
                                                                    style={{
                                                                        width: '70%'
                                                                    }}
                                                                    value={img.src}
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
                                                                    supportsHoverAndPointer={supportsHoverAndPointer}
                                                                    icon={<ClearRoundedIcon />}
                                                                    onClick={() => handleDeleteImageField(i)}
                                                                />
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant='outlined'
                                                            onClick={handleAddNewImage}
                                                            sx={{
                                                                width: '100%',
                                                                marginBottom: '1rem'
                                                            }}
                                                        >
                                                            Add New Image
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className={styles.sectionRight}>
                                        <div className='flex row center' style={{ gap: '1rem' }}>
                                            <Button
                                                variant={artColorChained ? 'contained' : 'outlined'}
                                                onClick={handleChainArtColor}
                                                sx={{
                                                    minWidth: 27,
                                                    width: 27,
                                                    height: 27,
                                                    padding: 0,
                                                }}
                                            >
                                                {artColorChained ? <Chain iconSize={20} /> : <BrokeChain iconSize={20} />}
                                            </Button>
                                            <h3>
                                                Art Color
                                            </h3>
                                        </div>
                                        <ColorSelector
                                            value={[SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color] })).find(scl => scl.id === product.variants.find(vari => vari.color_id === product.colors_ids[colorIndex]).art.color_id)]}
                                            options={SEARCH_ART_COLORS.map(cl => ({ id: cl.id, colors: [cl.color_display.color] }))}
                                            onChange={handleArtColor}
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                            style={{
                                                paddingBottom: '1rem',
                                            }}
                                        />
                                        <div className='flex row center' style={{ gap: '1rem' }}>
                                            <Button
                                                variant={artIdChained ? 'contained' : 'outlined'}
                                                onClick={handleChainArtId}
                                                sx={{
                                                    minWidth: 56,
                                                    width: 56,
                                                    height: 56,
                                                    padding: 0,
                                                }}
                                            >
                                                {artIdChained ? <Chain /> : <BrokeChain />}
                                            </Button>
                                            <TextInput
                                                disabled={artIdChained}
                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                                label='Art ID'
                                                value={product.variants.find(vari => vari.color_id === product.colors_ids[colorIndex]).art.id || ''}
                                                onChange={handleArtId}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </div>
                                        {images?.[product?.colors_ids?.[colorIndex]] &&
                                            <ImagesSlider
                                                images={Object.keys(images).reduce((acc, key) => acc.concat(images[key]), [])}
                                                currentColor={COLORS_POOL[product.colors_ids[colorIndex]]}
                                                colors={COLORS}
                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                            />
                                        }
                                    </div>
                                </section>
                                <Button
                                    variant='contained'
                                    onClick={updateProduct}
                                    disabled={disableUpdateButton}
                                    sx={{
                                        width: '100%',
                                        color: '#ffffff',
                                    }}
                                >
                                    Update Product
                                </Button>
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