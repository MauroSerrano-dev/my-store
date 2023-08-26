import { CustomTextField } from '@/components/CustomTextField'
import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import Router from "next/router";

export default function NewProduct() {

    const [product, setProduct] = useState()
    const [allProducts, setAllProducts] = useState()
    const [newProductId, setNewProductId] = useState()
    const [imagesIndexSelect, setImagesIndexSelect] = useState([])

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
            .then(response => setAllProducts(response.data))
            .catch(err => console.error(err))
    }

    async function saveProduct(product, newProductId) {
        product.id_printify = product.id
        product.id = newProductId
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: product
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
                            <Button
                                variant='contained'
                                size='small'
                                onClick={() => saveProduct(product, newProductId)}
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
                                    onClick={() => setProduct(prod)}
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