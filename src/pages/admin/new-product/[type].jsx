import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button, Checkbox, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { TAGS_POOL, TYPES_POOL } from '../../../../consts'
import ColorSelector from '@/components/ColorSelector'
import TextInput from '@/components/material-ui/TextInput'
import TagsSelector from '@/components/material-ui/Autocomplete'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ButtonIcon from '@/components/material-ui/ButtonIcon'
import SizesSelector from '@/components/SizesSelector';
import Chain from '@/components/svgs/Chain';
import BrokeChain from '@/components/svgs/BrokeChain';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../../../utils/toasts';
import NoFound404 from '@/pages/404';

const INICIAL_PRODUCT = {
    id: '',
    title: '',
    description: '',
    colors: [],
    sizes: [],
    images: [],
    image_showcase_index: 0,
    image_hover_index: 1,
    popularity: 0,
}

export default withRouter(props => {

    const {
        router,
        session,
        windowWidth,
        supportsHoverAndPointer,
    } = props;

    const [product, setProduct] = useState(INICIAL_PRODUCT)
    const [colorIndex, setColorIndex] = useState(0)
    const [images, setImages] = useState()
    const [type, setType] = useState()
    const [colorsChained, setColorsChained] = useState([])
    const [sizesChained, setSizesChained] = useState({})
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    useEffect(() => {
        if (router.isReady) {
            if (TYPES_POOL.some(t => t.id === router.query.type))
                setType(router.query.type)
            if (router.query.type === 't-shirts') {
                const tShirtsInfos = TYPES_POOL.find(t => t.id === 't-shirts')
                setProduct(prev => (
                    {
                        ...prev,
                        sizes: tShirtsInfos.sizes,
                        variants: tShirtsInfos.variants,
                        tags: ['t-shirts']
                    }
                ))
            }
        }
    }, [router])

    async function saveProduct() {

        if (product.title === '') {
            showInfoToast({ msg: 'Some fields missing.' })
            return
        }

        const variants = product.variants
            .filter(vari => product.colors.some(color => vari.options.includes(color.id)) && product.sizes.some(size => vari.options.includes(size.id)))
            .map(vari => ({ ...vari, color_id: product.colors.find(cl => vari.options.includes(cl.id)).id, size_id: product.sizes.find(sz => vari.options.includes(sz.id)).id }))

        variants.forEach(vari =>
            delete vari.options
        )

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: {
                    ...product,
                    title_lower_case: product.title.toLowerCase(),
                    type: type,
                    min_price: variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, variants[0].price),
                    images: product.colors.reduce((acc, color) => acc.concat(images[color.id].map(img => ({ src: img.src, color_id: img.color_id, variants_id: img.variants_id }))), []),
                    variants: variants,
                    sold_out: {
                        expiration_date: null,
                        percentage: null,
                    },
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                response.status < 300
                    ? showSuccessToast({ msg: response.msg })
                    : showErrorToast({ msg: response.msg })
            })
            .catch(err => showErrorToast({ msg: err }))
    }

    function updateProductField(fieldName, newValue) {
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    function handlePrintifyId(providerId, newValue) {
        setProduct(prev => ({ ...prev, printify_ids: { ...prev.printify_ids, [providerId]: newValue } }))
    }

    function handleChangeColors(value, i, color) {
        console.log(value, i, color)
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
                setImages(prevImgs => ({ ...prevImgs, [color.id]: [{ src: '', variants_id: product.variants.filter(vari => vari.options.includes(color.id)).map(vari => vari.id), color_id: color.id, hover: false, showcase: false }] }))
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
            }
        })
    }

    function handleSelectedColor(value, i) {
        setColorIndex(i)
    }

    function handleAddNewImage() {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].concat({ src: '', variants_id: product.variants.filter(vari => vari.options.includes(colorId)).map(vari => vari.id), color_id: colorId, hover: false, showcase: false }) }))
    }

    function handleDeleteImageField(index) {
        const colorId = product.colors[colorIndex].id
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].filter((img, i) => index !== i) }))
    }

    function updateImageField(fieldname, newValue, index) {
        const colorId = product.colors[colorIndex].id
        console.log(newValue)
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].map((img, i) => index === i ? { ...img, [fieldname]: newValue } : img) }))
    }

    function handleChangeSizes(value) {
        setProduct(prev => ({ ...prev, sizes: value }))
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
                            vari.options.includes(sizeId) && vari.options.some(op => colorsChained.includes(op))
                                ? {
                                    ...vari,
                                    price: prev.variants.find(v => v.options.includes(colorId) && sizesChained[colorId].some(sId => v.options.includes(sId)))
                                        ? prev.variants.find(v => v.options.includes(colorId) && sizesChained[colorId].some(sId => v.options.includes(sId))).price
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
                            vari.options.includes(sizeId) && vari.options.includes(colorId)
                                ? {
                                    ...vari,
                                    price: prev.variants.find(v => v.options.includes(colorId) && sizesChained[colorId].some(sId => v.options.includes(sId)))
                                        ? prev.variants.find(v => v.options.includes(colorId) && sizesChained[colorId].some(sId => v.options.includes(sId))).price
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
                        vari.options.includes(colorId)
                            ? {
                                ...vari,
                                price: colorsChained.length > 0
                                    ? prev.variants.find(v => colorsChained.some(cId => v.options.includes(cId)) && vari.options.some(ele => v.options.includes(ele))).price
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.options.includes(sId)) && colorsChained.some(cId => vari.options.includes(cId))
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
                    colorsChained.some(cId => vari.options.includes(cId)) && vari.options.includes(sizeId)
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
                    sizesChained[product.colors[colorIndex].id].some(sId => vari.options.includes(sId)) && vari.options.includes(colorId)
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
                    vari.options.includes(sizeId) && vari.options.includes(colorId)
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
                ? <NoFound404
                    windowWidth={windowWidth}
                    supportsHoverAndPointer={supportsHoverAndPointer}
                />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.top}>
                            <div className={styles.productOption}>
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
                                            Voltar
                                        </p>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {type &&
                            <div className={styles.productContainer}>
                                <div className={styles.productLeft}>
                                    <SizesSelector
                                        value={product.sizes}
                                        options={TYPES_POOL.find(t => t.id === type).sizes}
                                        onChange={handleChangeSizes}
                                    /* style={{
                                        paddingLeft: '50px',
                                        paddingRight: '50px',
                                    }} */
                                    />
                                    <ColorSelector
                                        value={product.colors}
                                        options={TYPES_POOL.find(t => t.id === type).colors}
                                        onChange={handleChangeColors}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                    {images?.[product?.colors?.[colorIndex]?.id] &&
                                        <ImagesSlider
                                            index={currentImgIndex}
                                            onChange={(imgIndex) => setCurrentImgIndex(imgIndex)}
                                            images={images[product.colors[colorIndex].id]}
                                        />
                                    }
                                </div>
                                <div className={styles.productRight}>
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='ID'
                                        onChange={event => updateProductField('id', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Title'
                                        onChange={event => updateProductField('title', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Description'
                                        onChange={event => updateProductField('description', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    <TextInput
                                        colorText='var(--color-success)'
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        label='Default Printify ID'
                                        onChange={event => updateProductField('printify_id_default', event.target.value)}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                    {TYPES_POOL.find(t => t.id === type).providers.map((provider, i) =>
                                        <TextInput
                                            colorText='var(--color-success)'
                                            supportsHoverAndPointer={supportsHoverAndPointer}
                                            key={i}
                                            label={`${provider.title} Printify ID`}
                                            onChange={event => handlePrintifyId(provider.id, event.target.value)}
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
                                                            value={product.variants.find(vari => vari.options.includes(size.id) && vari.options.includes(product.colors[colorIndex].id)).price}
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
                                                            value={product.variants.find(vari => vari.options.includes(size.id) && vari.options.includes(product.colors[colorIndex].id)).price}
                                                            min={product.variants[0].cost}
                                                            max={product.variants.reduce((acc, vari) => vari.cost > acc.cost ? vari : acc, { cost: 0 }).cost * 3}
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
                                        onClick={() => saveProduct()}
                                        sx={{
                                            width: '100%',
                                            color: '#ffffff',
                                        }}
                                    >
                                        Save Product
                                    </Button>
                                </div>
                            </div>
                        }
                    </main>
                </div>
    )
})