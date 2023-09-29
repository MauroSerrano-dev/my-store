import TagsSelector from '@/components/material-ui/Autocomplete';
import TextInput from '@/components/material-ui/TextInput';
import styles from '@/styles/admin/edit-product.module.css'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { TAGS_POOL, TYPES_POOL } from '../../../../consts';
import ColorSelector from '@/components/ColorSelector';
import SizesSelector from '@/components/SizesSelector';
import { Checkbox, FormControlLabel } from '@mui/material';

export default withRouter(props => {

    const {
        router,
        supportsHoverAndPointer,
    } = props;

    const [product, setProduct] = useState()

    useEffect(() => {
        if (router.isReady) {
            getProductById(router.query.id)
        }
    }, [router])

    async function getProductById(id) {
        const options = {
            method: 'GET',
            headers: {
                id: id,
            }
        }
        const product = await fetch("/api/product", options)
            .then(response => response.json())
            .then(response => response.product)
            .catch(err => console.error(err))

        setProduct(product)
    }

    return (
        <div className={styles.container}>
            <header>
            </header>
            {product &&
                <main className={styles.main}>
                    <TextInput
                        label='Title'
                        value={product.title}
                    />
                    <TextInput
                        label='Description'
                        value={product.description}
                    />
                    <TagsSelector
                        supportsHoverAndPointer={supportsHoverAndPointer}
                        options={TAGS_POOL}
                        label='Tags'
                        value={product.tags}
                        onChange={(event, value) => { }}
                    />
                    <ColorSelector
                        value={[product.colors[0]]}
                        options={product.colors}
                    />
                    <SizesSelector
                        value={product.sizes}
                        options={TYPES_POOL.find(t => t.id === product.type).sizes}
                        onChange={() => { }}
                    />
                    <FormControlLabel
                        label='Sold Out'
                        sx={{
                            '--text-color': '#ffffff',
                            marginTop: '-0.8',
                            marginBottom: '-0.8',
                        }}
                        control={
                            <Checkbox
                                checked={product.soldOut}
                                onChange={e => { }}
                                sx={{
                                    color: '#ffffff'
                                }}
                            />
                        }
                    />
                </main>
            }
            {product === null &&
                <main className={styles.main}>
                    <h1>Product not exist</h1>
                </main>
            }
            {product === undefined &&
                <main className={styles.main}>
                </main>
            }
        </div>
    )
})