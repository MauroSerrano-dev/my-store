import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/edit-product.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export default function EditProduct(props) {

    const [productIdInput, setProductIdInput] = useState('')



    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <TextInput
                    label='Product ID'
                    value={productIdInput}
                    onChange={e => setProductIdInput(e.target.value)}
                />
                <Link
                    legacyBehavior
                    href={`/admin/edit-product/${productIdInput}`}
                >
                    <a
                        className={'noUnderline'}
                        aria-label='Search'
                    >
                        <Button>
                            Search
                        </Button>
                    </a>
                </Link>
            </main>
        </div>
    )
}