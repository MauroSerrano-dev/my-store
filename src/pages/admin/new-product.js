import { CustomTextField } from '@/components/CustomTextField'
import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import Router from "next/router";
import Autocomplete from '@mui/material/Autocomplete';
import MultiSelector from '@/components/MultiSelector'

export default function NewProduct() {

    const [product, setProduct] = useState()
    const [allProducts, setAllProducts] = useState()
    const [newProductId, setNewProductId] = useState()

    const [tagsList, setTagsList] = useState([])
    const [tags, setTags] = useState([])
    const [themes, setThemes] = useState([])
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])

    const [newTag, setNewTag] = useState('')
    const [newTheme, setNewTheme] = useState('')
    const [newImage, setNewImage] = useState('')

    const [currentImgIndex, setCurrentImgIndex] = useState(0)
    const [showcaseImage, setShowcaseImage] = useState('')
    const [hoverImage, setHoverImage] = useState('')

    useEffect(() => {
        getAllProducts()
    }, [])

    async function getAllProducts() {
        const options = {
            method: 'GET',
        }
        await fetch("/api/printify-all-new-products", options)
            .then(response => response.json())
            .then(response => {
                console.log(response.msg)
                setAllProducts(response.products)
            })
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
                    })),
                    options: productArg.options,
                    position: productArg.position,
                    create_at: {
                        text: create_at.toString(),
                        number: create_at.valueOf(),
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
        setTagsList([])
        setTags([])
        setThemes([])
        setCurrentImgIndex(0)
        setCategories([])
        setImages([])
        setNewImage('')
        setNewTag('')
        setNewTheme('')
    }

    function handleSetProduct(product) {
        setProduct(product)
        setTags(product.tags.map(tag => tag.toLowerCase()))
        setTagsList(product.tags.map(tag => tag.toLowerCase()))
    }

    function handleTagsOnChange(event) {
        event.preventDefault()
        setNewTag(event.target.value.toLowerCase())
    }

    function handleThemesOnChange(event) {
        event.preventDefault()
        setNewTheme(event.target.value.toLowerCase())
    }

    function handleImagesOnChange(event) {
        event.preventDefault()
        setNewImage(event.target.value.toLowerCase())
    }

    function handleTagsKeyDown(event) {
        if (event.key === 'Enter' && newTag !== '') {
            event.preventDefault()
            if (!tagsList.includes(newTag)) {
                setTagsList(prev => [...prev, newTag])
                setTags(prev => [...prev, newTag])
                setNewTag('')
            }
        }
    }

    function handleThemesKeyDown(event) {
        if (event.key === 'Enter' && newTheme !== '') {
            event.preventDefault()
            if (!tagsList.includes(newTheme)) {
                setThemes(prev => [...prev, newTheme])
                setNewTheme('')
            }
        }
    }

    function handleImagesKeyDown(event) {
        if (event.key === 'Enter' && newImage !== '') {
            event.preventDefault()
            setImages(prev => [...prev, newImage])
            setNewImage('')
        }
    }

    function handleAutoCompleteTagsChange(event, value) {
        event.preventDefault()
        if (event.key !== 'Enter') {
            setTags(value)
        }
    }

    function handleAutoCompleteThemesChange(event, value) {
        event.preventDefault()
        if (event.key !== 'Enter') {
            setThemes(value)
        }
    }

    function handleAutoCompleteImagesChange(event, value) {
        event.preventDefault()
        if (event.key !== 'Enter') {
            setImages(value)
        }
    }

    function handleCategorySelector(event, value) {
        const newCategory = value.props.value

        setCategories(prev =>
            prev.includes(newCategory)
                ? prev.filter(category => category !== newCategory)
                : [...prev, newCategory]
        )
    }

    function handleShowcaseImageChange(event) {
        setShowcaseImage(event.target.value)
    }

    function handleHoverImageChange(event) {
        setHoverImage(event.target.value)
    }

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div className={styles.top}>
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
                </div>
                {product &&
                    <div className={styles.productContainer}>
                        <ImagesSlider
                            images={images.map(img => ({ src: img }))}
                            currentImgIndex={currentImgIndex}
                            setCurrentImgIndex={setCurrentImgIndex}
                        />
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
                            <MultiSelector
                                list={[
                                    'T-Shirts',
                                    'Home',
                                    'Socks',
                                    'Hoodies',
                                ]}
                                value={categories}
                                label='Categories'
                                onChange={handleCategorySelector}
                            />
                            <Autocomplete
                                multiple
                                options={tagsList}
                                value={tags}
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
                                        onKeyDown={handleTagsKeyDown}
                                        onChange={handleTagsOnChange}
                                    />
                                )}
                            />
                            <Autocomplete
                                multiple
                                options={themes}
                                value={themes}
                                onChange={handleAutoCompleteThemesChange}
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
                                        label="Themes"
                                        placeholder="Theme"
                                        value={newTag}
                                        onKeyDown={handleThemesKeyDown}
                                        onChange={handleThemesOnChange}
                                    />
                                )}
                            />
                            <Autocomplete
                                multiple
                                options={images}
                                value={images}
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
                            <Button
                                variant='contained'
                                onClick={() => saveProduct({
                                    productArg: product,
                                    newProductIdArg: newProductId,
                                    categoriesArg: categories,
                                    tagsArg: tags,
                                    imagesArg: images.map(img => ({ src: img })),
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
                {allProducts && !product &&
                    <div className={styles.block}>
                        {allProducts.map((prod, i) =>
                            <div
                                className={styles.productOption}
                                key={i}
                            >
                                <Button
                                    id={styles.productButton}
                                    variant='outlined'
                                    onClick={() => handleSetProduct(prod)}
                                >
                                    <img
                                        className={styles.productImg}
                                        src={prod.images[0].src}
                                        alt={prod.title}
                                    />
                                    {prod.title}
                                </Button>
                            </div>
                        )}
                    </div>
                }
            </main>
            <footer>
            </footer>
        </div >
    )
}