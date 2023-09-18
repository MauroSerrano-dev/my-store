import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { COLORS_POOL, TAGS_POOL, TYPES_POOL } from '../../../consts'
import ColorSelector from '@/components/ColorSelector'
import TextInput from '@/components/material-ui/TextInput'
import TagsSelector from '@/components/material-ui/Autocomplete'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ButtonIcon from '@/components/material-ui/ButtonIcon'


const INICIAL_PRODUCT = {
    id: '',
    colors: [],
    images: [],
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
            }
            else {
                setProduct(INICIAL_PRODUCT)
                setColorIndex(0)
                setImages()
                setType(null)
            }
        }
    }, [router])

    async function saveProduct(product) {
        const create_at = new Date()

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: product/* {
                    id: newProductIdArg,
                    id_printify: productArg.id,
                    categories: categoriesArg,
                    tags: tagsArg,
                    title: productArg.title,
                    images: imagesArg,
                    image_showcase: showcaseImgArg,
                    image_hover: hoverImgArg,
                    description: '',
                    variants: productArg.variants.map(variant => ({
                        id: variant.id,
                        cost: variant.cost,
                        price: variant.price,
                        grams: variant.grams,
                        is_printify_express_eligible: variant.is_printify_express_eligible,
                        options: variant.options,
                        quantity: variant.quantity,
                        sku: variant.sku,
                        title: variant.title,
                        sales: 0,
                        popularity: 0,
                        popularity_week: 0,
                        popularity_month: 0,
                        popularity_year: 0,
                    })),
                    options: productArg.options,
                    position: productArg.position,
                    create_at: {
                        text: create_at.toString(),
                        ms: create_at.valueOf(),
                    }
                } */
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => console.log(response.msg))
            .catch(err => console.error(err))
    }

    function handleProductField(fieldName, newValue) {
        setProduct(prev => ({ ...prev, [fieldName]: newValue }))
    }

    function handleChangeColors(value, i, colorId) {
        setProduct(prev => {
            setColorIndex(prevIndex => value.length > prev.colors.length
                ? value.length - 1
                : prevIndex >= prev.colors.length - 1
                    ? value.length - 1
                    : prevIndex
            )
            setImages(prevImgs => {
                if (value.length > prev.colors.length)
                    return { ...prevImgs, [colorId]: [{ src: '', variants_id: [], color_id: colorId, hover: false, showcase: false }] }
                else {
                    delete prevImgs[colorId]
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
        const colorId = [product.colors[colorIndex].id]
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].concat({ src: '', variants_id: [], color_id: colorId, hover: false, showcase: false }) }))
    }

    function handleDeleteImageField(index) {
        const colorId = [product.colors[colorIndex].id]
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].filter((img, i) => index !== i) }))
    }

    function updateImageField(fieldname, newValue, index) {
        const colorId = [product.colors[colorIndex].id]
        console.log(newValue)
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].map((img, i) => index === i ? { ...img, [fieldname]: newValue } : img) }))
    }

    function updateImageHoverOrShowcase(fieldname, newValue, index) {
        const colorId = [product.colors[colorIndex].id]
        setImages(prev => ({ ...prev, [colorId]: prev[colorId].map((img, i) => index === i ? { ...img, [fieldname]: newValue } : !newValue ? img : { ...img, [fieldname]: false }) }))
    }

    useEffect(() => {
        console.log('images', images)
    }, [images])

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
                            <ColorSelector
                                value={product.colors}
                                options={COLORS_POOL[type]}
                                onChange={handleChangeColors}
                                style={{
                                    paddingLeft: '100px',
                                    paddingRight: '100px',
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
                                onChange={event => handleProductField('id', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <TextInput
                                label='US Printify ID'
                                onChange={event => handleProductField('us_printify_id', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <TextInput
                                label='EU Printify ID'
                                onChange={event => handleProductField('eu_printify_id', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <TagsSelector
                                options={TAGS_POOL}
                                label='Tags'
                                onChange={event => handleProductField('tags', event.target.value)}
                                style={{
                                    width: '100%'
                                }}
                            />
                            <ColorSelector
                                value={[product.colors[colorIndex]]}
                                options={product.colors}
                                onChange={handleSelectedColor}
                                style={{
                                    paddingTop: '1rem',
                                    paddingBottom: '1rem',
                                }}
                            />
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
                                                    checked={img.showcase}
                                                    onChange={event => updateImageHoverOrShowcase('showcase', event.target.checked, i)}
                                                    sx={{
                                                        color: '#ffffff'
                                                    }}
                                                />
                                                <Checkbox
                                                    checked={img.hover}
                                                    onChange={event => updateImageHoverOrShowcase('hover', event.target.checked, i)}
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
                                                width: '100%'
                                            }}
                                        >
                                            Add New Image
                                        </Button>
                                    </div>
                                </div>
                            }
                            <Button
                                variant='contained'
                                onClick={() => saveProduct(product)}
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
                                href={`/admin/new-product?type=${type}`}
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
                                        {type}
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