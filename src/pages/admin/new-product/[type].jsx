import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product/type.module.css'
import { Button, Checkbox, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { COLLECTIONS, TAGS_POOL, PRODUCT_TYPES, COLORS_POOL, SIZES_POOL, PROVIDERS_POOL } from '../../../../consts'
import ColorSelector from '@/components/ColorSelector'
import TextInput from '@/components/material-ui/TextInput'
import TagsSelector from '@/components/material-ui/Autocomplete'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import ButtonIcon from '@/components/material-ui/ButtonIcon'
import SizesSelector from '@/components/SizesSelector'
import Chain from '@/components/svgs/Chain'
import BrokeChain from '@/components/svgs/BrokeChain'
import { showToast } from '../../../../utils/toasts'
import NoFound404 from '@/pages/404'
import Selector from '@/components/material-ui/Selector'

const INICIAL_PRODUCT = {
    id: '',
    title: '',
    description: '',
    collection: { id: '', title: '' },
    colors: [],
    sizes: [],
    images: [],
    image_showcase_index: 0,
    image_hover_index: 1,
    popularity: 0,
    printify_id_default: '',
    printify_ids: [],
    total_sales: 0,
    art: {
        id: '',
        color_id: '',
    },
}

export default withRouter(props => {

    const {
        router,
        session,
        supportsHoverAndPointer,
    } = props

    const [product, setProduct] = useState(INICIAL_PRODUCT)
    const [colorIndex, setColorIndex] = useState(0)
    const [images, setImages] = useState()
    const [type, setType] = useState()
    const [colorsChained, setColorsChained] = useState([])
    const [sizesChained, setSizesChained] = useState({})
    const [disableCreateButton, setDisableCreateButton] = useState(false)
    const [artColor, setArtColor] = useState(null)

    useEffect(() => {
        if (router.isReady) {
            const type_id = router.query.type
            const tp = PRODUCT_TYPES.find(t => t.id === type_id)
            setProduct(prev => (
                {
                    ...prev,
                    printify_ids: tp.providers.reduce((acc, prov_id) => ({ ...acc, [prov_id]: '' }), {}),
                    tags: [tp.id],
                    sizes: SIZES_POOL.filter(sz => tp.sizes.includes(sz.id))
                }
            ))
            setType(tp)
        }
    }, [router])

    async function createProduct() {
        setDisableCreateButton(true)

        if (product.colors.length === 0) {
            showToast({ msg: 'Choose at least one color.' })
            setDisableCreateButton(false)
            return
        }
        if (product.title === '') {
            showToast({ msg: 'Some fields missing.' })
            setDisableCreateButton(false)
            return
        }

        const prodColors = product.colors
        const prodSizes = product.sizes

        delete product.colors
        delete product.sizes

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
                    art: { id: product.id, color: artColor ? artColor.id : null, },
                    type_id: type.id,
                    title_lower_case: product.title.toLowerCase(),
                    colors_ids: prodColors.map(color => color.id),
                    sizes_ids: prodSizes.map(size => size.id),
                    min_price: product.variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, product.variants[0].price),
                    images: prodColors.reduce((acc, color) => acc.concat(images[color.id].map(img => ({ src: img.src, color_id: img.color_id }))), []),
                    variants: product.variants.map(vari => ({ ...vari, sales: 0 })),
                    sold_out: null,
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                response.status < 300
                    ? showToast({ type: 'success', msg: response.msg })
                    : showToast({ type: 'error', msg: response.msg })
            })
            .catch(err => showToast({ type: 'error', msg: err }))

        setDisableCreateButton(false)
        router.push('/admin/new-product')
    }

    function updateProductField(fieldName, newValue) {
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    function handlePrintifyId(providerId, newValue) {
        setProduct(prev => ({ ...prev, printify_ids: { ...prev.printify_ids, [providerId]: newValue } }))
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
                setImages(prevImgs => ({ ...prevImgs, [color.id]: [{ src: '', color_id: color.id, hover: false, showcase: false }] }))
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
            }
            return {
                ...prev,
                colors: value,
                variants: type.variants.filter(vari => value.some(cl => cl.id === vari.color_id && prev.sizes.some(sz => sz.id === vari.size_id)))
            }
        })
    }

    function handleSelectedColor(value, i) {
        setColorIndex(i)
    }

    function handleAddNewImage() {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].concat({ src: '', color_id: colorId, hover: false, showcase: false }) }))
    }

    function handleDeleteImageField(index) {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].filter((img, i) => index !== i) }))
    }

    function updateImageField(fieldname, newValue, index) {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].map((img, i) => index === i ? { ...img, [fieldname]: newValue } : img) }))
    }

    function handleChangeSizes(value) {
        setProduct(prev => (
            {
                ...prev,
                sizes: value,
                variants: type.variants.filter(vari => value.some(sz => sz.id === vari.size_id && prev.colors.some(cl => cl.id === vari.color_id)))
            }
        ))
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.size_id === sId) && colorsChained.includes(vari.color_id)
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

    return (
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.top}>
                            <Link
                                href='/admin/new-product'
                                className='noUnderline'
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
                        {type &&
                            <div className={styles.productContainer}>
                                <div className={styles.productLeft}>
                                    <SizesSelector
                                        value={product.sizes}
                                        options={type.sizes.map(sz_id => SIZES_POOL.find(size => size.id === sz_id))}
                                        onChange={handleChangeSizes}
                                    />
                                    <ColorSelector
                                        value={product.colors}
                                        options={type.colors.map(cl_id => COLORS_POOL.find(color => color.id === cl_id))}
                                        onChange={handleChangeColors}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                    {images?.[product?.colors?.[colorIndex]?.id] &&
                                        <ImagesSlider
                                            images={Object.keys(images).reduce((acc, key) => acc.concat(images[key]), [])}
                                            currentColor={product.colors[colorIndex]}
                                            colors={product.colors}
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                        />
                                    }
                                </div>
                                <div className={styles.productRight}>
                                    <div className='flex center'>
                                        <TextInput
                                            colorText='var(--color-success)'
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                            label='ID'
                                            value={product.id}
                                            onChange={event => updateProductField('id', event.target.value.toLowerCase().replace(' ', '-'))}
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                        <p style={{ whiteSpace: 'nowrap', paddingLeft: '0.5rem' }}>
                                            {type.id}
                                        </p>
                                    </div>
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Title'
                                        value={product.title}
                                        onChange={event => updateProductField('title', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Description'
                                        value={product.description}
                                        onChange={event => updateProductField('description', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <Selector
                                        label='Collection'
                                        options={COLLECTIONS.map(coll => ({ value: coll.id, name: coll.title }))}
                                        value={product.collection.id}
                                        style={{
                                            height: 56,
                                            color: 'var(--color-success)'
                                        }}
                                        onChange={event => updateProductField('collection', COLLECTIONS.find(coll => coll.id === event.target.value))}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                    <h3>
                                        Art Color
                                    </h3>
                                    <ColorSelector
                                        value={[artColor]}
                                        options={COLORS_POOL.filter(color => color.colors.length === 1)}
                                        onChange={(value, i, color) => setArtColor(prev => prev?.id === color.id ? null : color)}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        style={{
                                            paddingBottom: '1rem',
                                        }}
                                    />
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Default Printify ID'
                                        onChange={event => updateProductField('printify_id_default', event.target.value)}
                                        value={product.printify_id_default}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    {type.providers.map(prov_id => PROVIDERS_POOL.find(prov => prov.id === prov_id)).map((provider, i) =>
                                        <TextInput
                                            colorText='var(--color-success)'
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
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    {product.colors.length > 0 &&
                                        <div>
                                            <ColorSelector
                                                value={[product.colors[colorIndex]]}
                                                options={product.colors}
                                                onChange={handleSelectedColor}
                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                                style={{
                                                    paddingTop: '1rem',
                                                    paddingBottom: '1rem',
                                                }}
                                            />
                                            <div className='flex' style={{ gap: '0.5rem' }}>
                                                {product.colors.map((color, i) =>
                                                    <Button
                                                        key={i}
                                                        variant={colorsChained.includes(color.id) ? 'contained' : 'outlined'}
                                                        onClick={() => handleChainColor(color.id)}
                                                        sx={{
                                                            minWidth: 40,
                                                            width: 40,
                                                            height: 40,
                                                            padding: 0,
                                                        }}
                                                    >
                                                        {colorsChained.includes(color.id) ? <Chain iconSize={25} /> : <BrokeChain iconSize={25} />}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    }
                                    {images?.[product?.colors?.[colorIndex]?.id] &&
                                        <div className='flex column' style={{ gap: '1rem' }}>
                                            <div
                                                className='flex center column fillWidth'
                                                style={{
                                                    gap: '1rem'
                                                }}
                                            >
                                                <h3>
                                                    {product.colors[colorIndex].title} Price (USD)
                                                </h3>
                                                {product.sizes.map((size, i) =>
                                                    <div
                                                        className='flex center fillWidth'
                                                        style={{
                                                            gap: '1rem'
                                                        }}
                                                        key={i}
                                                    >
                                                        <Button
                                                            variant={sizesChained[product.colors[colorIndex].id].includes(size.id) ? 'contained' : 'outlined'}
                                                            onClick={() => handleChainSize(size.id)}
                                                            sx={{
                                                                minWidth: 45,
                                                                width: 45,
                                                                height: 45,
                                                                padding: 0,
                                                            }}
                                                        >
                                                            {sizesChained[product.colors[colorIndex].id].includes(size.id) ? <Chain /> : <BrokeChain />}
                                                        </Button>
                                                        <TextInput
                                                            colorText='var(--color-success)'
                                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                                            label={`${size.title}`}
                                                            onChange={event => handleChangePrice(event.target.value, size.id)}
                                                            value={product.variants.find(vari => vari.size_id === size.id && vari.color_id === product.colors[colorIndex].id).price}
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
                                                            value={product.variants.find(vari => vari.size_id === size.id && vari.color_id === product.colors[colorIndex].id).price}
                                                            min={type.variants[0].cost}
                                                            max={type.variants.reduce((acc, vari) => vari.cost > acc.cost ? vari : acc, { cost: 0 }).cost * 3}
                                                            valueLabelDisplay="auto"
                                                            onChange={event => handleChangePrice(event.target.value, size.id)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3>Images</h3>
                                                {images[product.colors[colorIndex].id].length > 0 &&
                                                    <div className='flex row justify-end' style={{ fontSize: '11px', gap: '1rem', width: '100%', paddingRight: '11%' }}>
                                                        <p>showcase</p>
                                                        <p>hover</p>
                                                    </div>
                                                }
                                                <div className='flex column' style={{ gap: '0.8rem' }} >
                                                    {images[product.colors[colorIndex].id].map((img, i) =>
                                                        <div
                                                            className='flex row align-center fillWidth space-between'
                                                            key={i}
                                                        >
                                                            <TextInput
                                                                colorText='var(--color-success)'
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
                                    <Button
                                        variant='contained'
                                        onClick={createProduct}
                                        disabled={disableCreateButton}
                                        sx={{
                                            width: '100%',
                                            color: '#ffffff',
                                        }}
                                    >
                                        Create Product
                                    </Button>
                                </div>
                            </div>
                        }
                    </main>
                </div>
    )
})