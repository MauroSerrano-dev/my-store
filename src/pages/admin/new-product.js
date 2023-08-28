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
    const [imagesIndexSelect, setImagesIndexSelect] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [tags, setTags] = useState([])
    const [categories, setCategories] = useState([])
    const [newTag, setNewTag] = useState('')
    const [currentImgIndex, setCurrentImgIndex] = useState(0)
    const [mainImgIndex, setMainImgIndex] = useState()
    const [hoverImgIndex, setHoverImgIndex] = useState()

    useEffect(() => {
        getAllProducts()
    }, [])

    useEffect(() => {
        console.log(allProducts)
    }, [allProducts])

    async function getAllProducts() {
        const options = {
            method: 'GET',
        }
        await fetch("/api/printify-all-products", options)
            .then(response => response.json())
            .then(response => {
                console.log(response),
                    setAllProducts(response.data)
            })
            .catch(err => console.error(err))
    }

    async function saveProduct(props) {
        const {
            productArg,
            newProductIdArg,
            categoriesArg,
            tagsArg,
            imagesIndexSelectArg,
            mainImgIndexArg,
            hoverImgIndexArg,
        } = props

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
                    images: imagesIndexSelectArg.map(index => ({
                        src: productArg.images[index].src,
                        variant_ids: productArg.images[index].variant_ids
                    })),
                    image_showcase: {
                        src: productArg.images[mainImgIndexArg].src,
                    },
                    image_hover: {
                        src: productArg.images[hoverImgIndexArg].src,
                    },
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
        setImagesIndexSelect([])
        setTagsList([])
        setTags([])
        setCurrentImgIndex(0)
        setCategories([])
    }

    function handleSetProduct(product) {
        setProduct(product)
        setTags(product.tags.map(tag => tag.toLowerCase()))
        setTagsList(product.tags.map(tag => tag.toLowerCase()))
    }

    function handleTagsOnChange(event) {
        console.log(event.target.value)
        setNewTag(event.target.value.toLowerCase())
    }

    function handleTagsKeyDown(event) {
        if (event.key === 'Enter') {
            setTagsList(prev => [...prev, newTag])
            setTags(prev => [...prev, newTag])
            setNewTag('')
        }
    }

    function handleAutoCompleteChange(event, value) {
        setTags(value)
    }

    function handleCategorySelector(event, value) {
        const newCategory = value.props.value
        console.log(newCategory)
        setCategories(prev =>
            prev.includes(newCategory)
                ? prev.filter(category => category !== newCategory)
                : [...prev, newCategory]
        )
    }

    function chooseMainImage(mainImgIndexArg) {
        setMainImgIndex(mainImgIndexArg)
    }

    function chooseHoverImage(hoverImgIndexArg) {
        setHoverImgIndex(hoverImgIndexArg)
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
                            images={product.images}
                            imagesIndexSelect={imagesIndexSelect}
                            setImagesIndexSelect={setImagesIndexSelect}
                            currentImgIndex={currentImgIndex}
                            setCurrentImgIndex={setCurrentImgIndex}
                        />
                        <div className={styles.fieldsContainer}>
                            <CustomTextField
                                label='New Product ID'
                                size='small'
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
                                ]}
                                value={categories}
                                label='Categories'
                                onChange={handleCategorySelector}
                            />
                            <Autocomplete
                                multiple
                                options={tagsList}
                                value={tags}
                                onChange={handleAutoCompleteChange}
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
                                        onKeyDown={e => handleTagsKeyDown(e)}
                                        onChange={e => handleTagsOnChange(e)}
                                    />
                                )}
                            />
                            <Button
                                variant='contained'
                                size='small'
                                onClick={() => chooseMainImage(currentImgIndex)}
                            >
                                Tornar Imagem Principal
                            </Button>
                            <Button
                                variant='contained'
                                size='small'
                                onClick={() => chooseHoverImage(currentImgIndex)}
                            >
                                Tornar Imagem de Hover
                            </Button>
                            <Button
                                variant='contained'
                                size='small'
                                onClick={() => saveProduct({
                                    productArg: product,
                                    newProductIdArg: newProductId,
                                    categoriesArg: categories,
                                    tagsArg: tags,
                                    imagesIndexSelectArg: imagesIndexSelect,
                                    mainImgIndexArg: mainImgIndex,
                                    hoverImgIndexArg: hoverImgIndex,
                                })}
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
                                        crossOrigin='anonymous'
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