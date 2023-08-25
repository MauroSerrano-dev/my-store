import { CustomTextField } from '@/components/CustomTextField'
import styles from '@/styles/admin/new-product.module.css'
import { Button } from '@mui/material'
import { useState } from 'react'

export default function NewProduct() {

    const [productIdInput, setProductIdInput] = useState()
    const [product, setProduct] = useState()
    const [newProductId, setNewProductId] = useState()

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
                <CustomTextField
                    label='Product ID'
                    size='small'
                    autoComplete='off'
                    spellCheck={false}
                    onChange={(e) => setProductIdInput(e.target.value)}
                />
                <Button
                    variant='contained'
                    size='small'
                    onClick={getProduct}
                >
                    Search
                </Button>
                {product &&
                    <div>
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
                        {product.images.map((img, i) =>
                            <img
                                src={img.src}
                                alt={`product-img${i}`}
                                key={i}
                                className={styles.productImg}
                            />
                        )}
                    </div>
                }
            </main>
            <footer>
            </footer>
        </div >
    )
}