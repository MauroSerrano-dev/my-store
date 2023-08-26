import { CustomTextField } from '@/components/CustomTextField'
import ImagesSlider from '@/components/ImagesSlider'
import styles from '@/styles/admin/new-product.module.css'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'

export default function NewProduct() {

    const [productIdInput, setProductIdInput] = useState()
    const [product, setProduct] = useState()
    const [allProducts, setAllProducts] = useState()
    const [newProductId, setNewProductId] = useState()

    useEffect(() => {
        getAllProducts()
    }, [])

    useEffect(() => {
        console.log(allProducts)
    }, [allProducts])

    async function getAllProducts() {
        const options = {
            method: 'GET',
            headers: { id: productIdInput },
        }
        await fetch("/api/printify-all-products", options)
            .then(response => response.json())
            .then(response => setAllProducts(response.data))
            .catch(err => console.error(err))
    }

    async function getProduct() {
        const options = {
            method: 'GET',
            headers: { id: productIdInput },
        }
        await fetch("/api/printify-product", options)
            .then(response => response.json())
            .then(response => setProduct(response))
            .catch(err => console.error(err))
    }

    async function saveProduct(product, newProductId) {
        product.id_printify = product.id
        product.id = newProductId
        console.log(product)
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

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                {product &&
                    <div className={styles.productContainer}>
                        <ImagesSlider
                            images={product.images}
                        />
                        <CustomTextField
                            label='New Product ID'
                            size='small'
                            autoComplete='off'
                            spellCheck={false}
                            onChange={(e) => setNewProductId(e.target.value)}
                        />
                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => saveProduct(product, newProductId)}
                        >
                            Save Product
                        </Button>
                    </div>
                }
                {allProducts && !product &&
                    <div className={styles.block}>
                        {allProducts.map((prod, i) =>
                            <div className={styles.productOption} key={i}>
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