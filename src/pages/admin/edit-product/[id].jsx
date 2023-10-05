import TagsSelector from '@/components/material-ui/Autocomplete';
import TextInput from '@/components/material-ui/TextInput';
import styles from '@/styles/admin/edit-product/id.module.css'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { TAGS_POOL, TYPES_POOL } from '../../../../consts';
import ColorSelector from '@/components/ColorSelector';
import SizesSelector from '@/components/SizesSelector';
import { Button, Checkbox, FormControlLabel, Slider } from '@mui/material';
import Link from 'next/link';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import NoFound404 from '@/pages/404';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Chain from '@/components/svgs/Chain';
import BrokeChain from '@/components/svgs/BrokeChain';
import ButtonIcon from '@/components/material-ui/ButtonIcon';
import ImagesSlider from '@/components/ImagesSlider';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../../../utils/toasts';
import { getProductsDiff } from '../../../../utils';

export default withRouter(props => {

    const {
        router,
        supportsHoverAndPointer,
        session,
    } = props;

    const [product, setProduct] = useState()
    const [inicialProduct, setInicialProduct] = useState({})
    const [colorIndex, setColorIndex] = useState(0)
    const [colorsChained, setColorsChained] = useState([])
    const [sizesChained, setSizesChained] = useState({})
    const [disableUpdateButton, setDisableUpdateButton] = useState(false)

    useEffect(() => {
        if (router.isReady) {
            getProductById(router.query.id)
        }
    }, [router])

    async function getProductById(id) {
        const options = {
            method: 'GET',
            headers: {
                id: id,
            }
        }
        const product = await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))

        if (product.colors.every(cl => product.variants.filter(vari => vari.color_id === cl.id).every(variColor => variColor.price === product.variants.find(vari => vari.size_id === variColor.size_id).price)))
            setColorsChained(product.colors.map(cl => cl.id))

        setSizesChained(product.colors.reduce((acc, cl) => ({ ...acc, [cl.id]: [] }), {}))
        setInicialProduct(product)
        setProduct(product)
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
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].concat({ src: '', variants_id: product.variants.filter(vari => vari.options.includes(colorId)).map(vari => vari.id), color_id: colorId, hover: false, showcase: false }) }))
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
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    async function updateProduct() {
        setDisableUpdateButton(true)
        const diff = getProductsDiff(product, inicialProduct)
        const diffKeys = Object.keys(diff)
        const fieldsDiff = diffKeys.join(', ')
        if (diffKeys.length === 0) {
            showInfoToast({ msg: 'No changes made.' })
            setDisableUpdateButton(false)
            return
        }

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: {
                    ...product,
                    min_price: product.variants.reduce((acc, vari) => acc < vari.price ? acc : vari.price, product.variants[0].price),
                    images: product.colors.reduce((acc, color) => acc.concat(product.images.filter(img => img.color_id === color.id)), []),
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => {
                if (response.status < 300) {
                    setInicialProduct(product)
                    showSuccessToast({ msg: response.msg })
                }
                else {
                    showErrorToast({ msg: response.msg })
                }
            })
            .catch(err => showErrorToast({ msg: err }))

        setDisableUpdateButton(false)
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
                            <div className={styles.productContainer}>
                                <div className={styles.productLeft}>
                                    <SizesSelector
                                        value={product.sizes}
                                        options={TYPES_POOL.find(t => t.id === product.type).sizes}
                                        onChange={() => { }}
                                    />
                                    <ColorSelector
                                        value={product.colors}
                                        options={TYPES_POOL.find(t => t.id === product.type).colors}
                                        onChange={handleChangeColors}
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '50px',
                                        }}
                                    />
                                    {product.images.filter(img => img.color_id === product.colors[colorIndex].id).length > 0 &&
                                        <ImagesSlider
                                            images={product.images.filter(img => img.color_id === product.colors[colorIndex].id)}
                                        />
                                    }
                                </div>
                                <div className={styles.productRight}>
                                    <p>Type: {product.type}</p>
                                    <TextInput
                                        label='Title'
                                        value={product.title}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                    <TextInput
                                        label='Description'
                                        value={product.description}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                    <TagsSelector
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                        options={TAGS_POOL}
                                        label='Tags'
                                        value={product.tags}
                                        onChange={(event, value) => updateProductField('tags', value)}
                                    />
                                    <FormControlLabel
                                        label='Sold Out'
                                        sx={{
                                            '--text-color': '#ffffff',
                                            marginTop: '-0.8',
                                            marginBottom: '-0.8',
                                        }}
                                        control={
                                            <Checkbox
                                                checked={product.soldOut}
                                                onChange={e => { }}
                                                sx={{
                                                    color: '#ffffff'
                                                }}
                                            />
                                        }
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
                                    {sizesChained[product.colors[colorIndex].id] &&
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
                                                            onChange={event => handleChangePrice(isNaN(Number(event.target.value)) ? 0 : Math.abs(Number(event.target.value.slice(0, Math.min(event.target.value.length, 7)))), size.id)}
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
                                                {product.images.length > 0 &&
                                                    <div className='flex row justify-end' style={{ fontSize: '11px', gap: '1rem', width: '100%', paddingRight: '11%' }}>
                                                        <p>showcase</p>
                                                        <p>hover</p>
                                                    </div>
                                                }
                                                <div className='flex column' style={{ gap: '0.8rem' }} >
                                                    {product.images.filter(img => img.color_id === product.colors[colorIndex].id).map((img, i) =>
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