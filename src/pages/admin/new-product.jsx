import { CustomTextField } from '@/components/CustomTextField'
import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import Router from "next/router";
import Autocomplete from '@mui/material/Autocomplete';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { TAGS_POOL, TYPES_POOL } from '../../../consts'
import Selector from '@/components/Selector'
import ColorSelector from '@/components/ColorSelector'

const INICIAL_PRODUCT = {
    colors: [],
    images: [],
    options: [],
    variants: []
}

export default withRouter(props => {

    const { id_printify } = props.router.query

    const [product, setProduct] = useState()
    const [newProduct, setNewProduct] = useState(INICIAL_PRODUCT)
    const [allProducts, setAllProducts] = useState()
    const [newProductId, setNewProductId] = useState()

    const [currentColorIndex, setCurrentColorIndex] = useState(-1)

    const [tags, setTags] = useState([])
    const [categories, setCategories] = useState([])

    const [newTag, setNewTag] = useState('')
    const [newImage, setNewImage] = useState('')

    const [currentImgIndex, setCurrentImgIndex] = useState(0)
    const [showcaseImage, setShowcaseImage] = useState('')
    const [hoverImage, setHoverImage] = useState('')

    useEffect(() => {
        if (id_printify)
            getProductByPrintifyId(id_printify)
        else
            getAllProducts()
    }, [id_printify])

    async function getAllProducts() {
        const options = {
            method: 'GET',
        }
        await fetch("/api/printify-all-new-products", options)
            .then(response => response.json())
            .then(response => setAllProducts(response.products))
            .catch(err => console.error(err))
    }

    async function getProductByPrintifyId(id) {
        const options = {
            method: 'GET',
            headers: {
                id: id
            }
        }
        await fetch("/api/printify-product", options)
            .then(response => response.json())
            .then(response => setProduct(response))
            .catch(err => console.error(err))
    }

    async function saveProduct(props) {
        const {
            productArg,
            newProductIdArg,
            categoriesArg,
            tagsArg,
            imagesArg,
            showcaseImgArg,
            hoverImgArg,
        } = props

        const create_at = new Date()

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: {
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
                }
            })
        }
        await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => console.log(response.msg))
            .catch(err => console.error(err))
    }

    function handleGoBack() {
        product
            ? clearFields()
            : Router.push('/admin')
    }

    function clearFields() {
        setProduct()
        setNewProductId()
        setTags([])
        setCurrentImgIndex(0)
        setCategories([])
        setNewImage('')
        setNewTag('')
        setNewProduct(INICIAL_PRODUCT)
    }

    function handleImagesOnChange(event) {
        event.preventDefault()
        setNewImage(event.target.value.toLowerCase())
    }

    function handleImagesKeyDown(event) {
        if (event.key === 'Enter' && newImage !== '') {
            event.preventDefault()
            setNewProduct(prev => ({ ...prev, images: [...prev.images, newImage] }))
            setNewImage('')
        }
    }

    function handleAutoCompleteTagsChange(event, value) {
        event.preventDefault()
        if (event.key !== 'Enter') {
            setTags(value)
        }
    }

    function handleAutoCompleteImagesChange(event, value) {
        event.preventDefault()
        if (event.key !== 'Enter') {
            setNewProduct(prev => ({ ...prev, images: prev.images.filter(image => value.includes(image.src) || image.color_id !== prev.colors[currentColorIndex].id) }))
        }
    }

    function handleShowcaseImageChange(event) {
        setShowcaseImage(event.target.value)
    }

    function handleHoverImageChange(event) {
        setHoverImage(event.target.value)
    }

    function handleColorClick(option) {

        function variantsHasThisImage(image, variants) {
            return image.variant_ids.some(id => variants.some(variant => variant.id === id))
        }

        setNewProduct(prev => {
            if (prev.colors.some(color => color.id === option.id)) {
                setCurrentColorIndex(prevIndex => prevIndex > prev.colors.length - 2 ? prevIndex - 1 : prevIndex)
                const newVariants = prev.variants.filter(variant => !variant.options.includes(option.id))
                const newImages = prev.images.filter(image => variantsHasThisImage(image, newVariants))
                return {
                    ...prev,
                    colors: prev.colors.filter(color => color.id !== option.id),
                    variants: newVariants,
                    images: newImages,
                }
            }
            else {
                setCurrentColorIndex(prev.colors.length)
                const newVariants = product.variants.filter(variant => variant.options.includes(option.id))
                const newImages = prev.images
                    .concat(product.images
                        .filter(image => variantsHasThisImage(image, newVariants))
                        .map(image => ({
                            ...image,
                            color_id: option.id
                        })))

                return {
                    ...prev,
                    colors: prev.colors.concat(option),
                    variants: prev.variants.concat(newVariants),
                    images: newImages,
                }

            }
        })
    }

    function handleChangeCurrentVariant(option, index) {
        setCurrentColorIndex(index)
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
                            href={id_printify ? '/admin/new-product' : '/admin'}
                        >
                            <a
                                className='noUnderline'
                            >
                                <Button
                                    variant='outlined'
                                    onClick={handleGoBack}
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
                {product &&
                    <div className={styles.productContainer}>
                        <div className={styles.productLeft}>
                            {product.options.some(option => option.type == 'color') &&
                                <div
                                    style={{
                                        padding: '0px 4rem'
                                    }}
                                >
                                    <ColorSelector
                                        options={product.options.filter(option => option.type == 'color')[0].values}
                                        onClick={handleColorClick}
                                        value={newProduct.colors}
                                    />
                                </div>
                            }
                            <ImagesSlider
                                images={newProduct.images.filter(image => image.color_id === newProduct.colors[currentColorIndex].id)}
                                currentImgIndex={currentImgIndex}
                                setCurrentImgIndex={setCurrentImgIndex}
                            />
                        </div>
                        <div className={styles.fieldsContainer}>
                            <CustomTextField
                                label='New Product ID'
                                autoComplete='off'
                                spellCheck={false}
                                onChange={(e) => setNewProductId(e.target.value)}
                                sx={{
                                    width: '100%'
                                }}
                            />
                            <Selector
                                options={TYPES_POOL.map(type => ({ value: type, name: type }))}
                                label='Type'
                            />
                            <Autocomplete
                                multiple
                                options={TAGS_POOL}
                                onChange={handleAutoCompleteTagsChange}
                                sx={{
                                    '.MuiAutocomplete-tag': {
                                        backgroundColor: '#363a3d',
                                        '--text-color': 'var(--global-white)',
                                    },
                                    '.MuiAutocomplete-clearIndicator': {
                                        color: 'var(--global-white)'
                                    },
                                    '.MuiAutocomplete-popupIndicator': {
                                        color: 'var(--global-white)'
                                    },
                                    '.MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 255, 0.4) !important',
                                        transition: 'all ease-in-out 200ms'
                                    },
                                    '.MuiChip-deleteIcon:hover': {
                                        color: 'rgba(255, 255, 255, 0.8) !important',
                                    },
                                    width: '100%',
                                }}
                                renderInput={(params) => (
                                    <CustomTextField
                                        {...params}
                                        variant="outlined"
                                        label="Tags"
                                        placeholder="Tag"
                                        value={newTag}
                                    />
                                )}
                            />
                            {newProduct.colors.length > 0 &&
                                <ColorSelector
                                    options={newProduct.colors}
                                    value={[newProduct.colors[currentColorIndex]]}
                                    onClick={handleChangeCurrentVariant}
                                />
                            }
                            <div className={styles.variantContainer}>
                                <Autocomplete
                                    multiple
                                    options={newProduct.images.filter(image => image.color_id === newProduct.colors[currentColorIndex].id).map(image => image.src)}
                                    value={newProduct.images.filter(image => image.color_id === newProduct.colors[currentColorIndex].id).map(image => image.src)}
                                    onChange={handleAutoCompleteImagesChange}
                                    sx={{
                                        '.MuiAutocomplete-tag': {
                                            backgroundColor: '#363a3d',
                                            '--text-color': 'var(--global-white)',
                                        },
                                        '.MuiAutocomplete-clearIndicator': {
                                            color: 'var(--global-white)'
                                        },
                                        '.MuiAutocomplete-popupIndicator': {
                                            color: 'var(--global-white)'
                                        },
                                        '.MuiChip-deleteIcon': {
                                            color: 'rgba(255, 255, 255, 0.4) !important',
                                            transition: 'all ease-in-out 200ms'
                                        },
                                        '.MuiChip-deleteIcon:hover': {
                                            color: 'rgba(255, 255, 255, 0.8) !important',
                                        },
                                        width: '100%',
                                    }}
                                    renderInput={(params) => (
                                        <CustomTextField
                                            {...params}
                                            variant="outlined"
                                            label="Images"
                                            placeholder="Image"
                                            value={newTag}
                                            onKeyDown={handleImagesKeyDown}
                                            onChange={handleImagesOnChange}
                                        />
                                    )}
                                />
                                <CustomTextField
                                    variant="outlined"
                                    label="Showcase Image"
                                    value={showcaseImage}
                                    onChange={handleShowcaseImageChange}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                                <CustomTextField
                                    variant="outlined"
                                    label="Hover Image"
                                    value={hoverImage}
                                    onChange={handleHoverImageChange}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <Button
                                variant='contained'
                                onClick={() => saveProduct({
                                    productArg: product,
                                    newProductIdArg: newProductId,
                                    categoriesArg: categories,
                                    tagsArg: tags,
                                    imagesArg: newProduct.images.map(img => ({ src: img })),
                                    showcaseImgArg: { src: showcaseImage },
                                    hoverImgArg: { src: hoverImage },
                                })}
                                sx={{
                                    width: '100%',
                                    color: 'var(--global-white)',
                                }}
                            >
                                Save Product
                            </Button>
                        </div>
                    </div>
                }
                {
                    allProducts && !id_printify &&
                    <div className={styles.block}>
                        {allProducts.map((prod, i) =>
                            <Link
                                legacyBehavior
                                href={`/admin/new-product/?id_printify=${prod.id}`}
                                key={i}
                            >
                                <a
                                    className={`${styles.productOption} noUnderline`}
                                >
                                    <Button
                                        id={styles.productButton}
                                        variant='outlined'
                                    >
                                        <img
                                            className={styles.productImg}
                                            src={prod.images[0].src}
                                            alt={prod.title}
                                        />
                                        {prod.title}
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