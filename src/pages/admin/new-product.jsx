import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button, Checkbox, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { TAGS_POOL, TYPES_POOL } from '../../../consts'
import ColorSelector from '@/components/ColorSelector'
import TextInput from '@/components/material-ui/TextInput'
import TagsSelector from '@/components/material-ui/Autocomplete'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ButtonIcon from '@/components/material-ui/ButtonIcon'
import SizesSelector from '@/components/SizesSelector';


const INICIAL_PRODUCT = {
    id: '',
    description: '',
    colors: [],
    sizes: [],
    images: [],
    image_showcase_index: 0,
    image_hover_index: 1,
    popularity: 0,
}

export default withRouter(props => {

    const { router } = props;

    const [product, setProduct] = useState(INICIAL_PRODUCT)
    const [colorIndex, setColorIndex] = useState(0)
    const [images, setImages] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        if (router.isReady) {
            if (router.query.type) {
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
            else {
                setProduct(INICIAL_PRODUCT)
                setColorIndex(0)
                setImages()
                setType(null)
            }
        }
    }, [router])

    async function saveProduct() {
        const create_at = new Date()

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: {
                    ...product,
                    title_lower_case: product.title.toLowerCase(),
                    type: type,
                    images: product.colors.reduce((acc, color) => acc.concat(images[color.id].map(img => ({ src: img.src, color_id: img.color_id, variants_id: img.variants_id }))), []),
                    variants: product.variants.filter(vari => product.colors.some(color => vari.options.includes(color.id)) && product.sizes.some(size => vari.options.includes(size.id))),
                    create_at: {
                        text: create_at.toString(),
                        ms: create_at.valueOf(),
                    },
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => console.log(response.msg))
            .catch(err => console.error(err))
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
            setImages(prevImgs => {
                if (value.length > prev.colors.length) {
                    return { ...prevImgs, [color.id]: [{ src: '', variants_id: product.variants.filter(vari => vari.options.includes(color.id)).map(vari => vari.id), color_id: color.id, hover: false, showcase: false }] }
                }
                else {
                    delete prevImgs[color.id]
                    return prevImgs
                }
            })
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

    function handlePriceChange(sizeId, value) {
        setProduct(prev => ({ ...prev, variants: prev.variants.map(vari => vari.options.includes(sizeId) ? { ...vari, price: Number(value) } : vari) }))
    }

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div className={styles.top}>
                    <div className={styles.productOption}>
                        <Link
                            legacyBehavior
                            href={type ? '/admin/new-product' : '/admin'}
                        >
                            <a
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
                            </a>
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
                                    images={images[product.colors[colorIndex].id]}
                                />
                            }
                        </div>
                        <div className={styles.productRight}>
                            <TextInput
                                label='ID'
                                onChange={event => updateProductField('id', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <TextInput
                                label='Title'
                                onChange={event => updateProductField('title', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <TextInput
                                label='Default Printify ID'
                                onChange={event => updateProductField('printify_id_default', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            {TYPES_POOL.find(t => t.id === type).providers.map((provider, i) =>
                                <TextInput
                                    key={i}
                                    label={`${provider.title} Printify ID`}
                                    onChange={event => handlePrintifyId(provider.id, event.target.value)}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            )}
                            <TagsSelector
                                options={TAGS_POOL}
                                label='Tags'
                                value={product.tags}
                                onChange={(event, value) => updateProductField('tags', value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            {product.colors.length > 0 &&
                                <ColorSelector
                                    value={[product.colors[colorIndex]]}
                                    options={product.colors}
                                    onChange={handleSelectedColor}
                                    style={{
                                        paddingTop: '1rem',
                                        paddingBottom: '1rem',
                                    }}
                                />
                            }
                            {images?.[product?.colors?.[colorIndex]?.id] &&
                                <div className='flex column'>
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
                            }
                            <h3>
                                Price (USD)
                            </h3>
                            {product.sizes.map((size, i) =>
                                <div
                                    className='flex center'
                                    style={{
                                        gap: '1rem'
                                    }}
                                    key={i}
                                >
                                    <TextInput
                                        label={`${size.title}`}
                                        onChange={event => handlePriceChange(size.id, event.target.value)}
                                        value={product.variants.find(vari => vari.options.includes(size.id)).price}
                                        style={{
                                            width: '80px',
                                        }}
                                    />
                                    <Slider
                                        value={product.variants.find(vari => vari.options.includes(size.id)).price}
                                        min={product.variants.find(vari => vari.options.includes(size.id)).cost}
                                        max={product.variants.find(vari => vari.options.includes(size.id)).cost * 4}
                                        valueLabelDisplay="auto"
                                        onChange={event => handlePriceChange(size.id, event.target.value)}
                                    />
                                </div>
                            )}
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
                {type === null &&
                    <div className={styles.menuContainer}>
                        <h3>Create New Product</h3>
                        {TYPES_POOL.map((type, i) =>
                            <Link
                                legacyBehavior
                                href={`/admin/new-product?type=${type.id}`}
                                key={i}
                            >
                                <a
                                    className='noUnderline fillWidth'
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        {type.title}
                                    </Button>
                                </a>
                            </Link>
                        )}
                    </div>
                }
            </main>
        </div>
    )
})