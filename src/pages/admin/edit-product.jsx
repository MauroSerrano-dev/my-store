import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/edit-product.module.css'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

export default function EditProduct(props) {

    const [productIdInput, setProductIdInput] = useState('')



    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <Link
                    legacyBehavior
                    href={'/admin'}
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