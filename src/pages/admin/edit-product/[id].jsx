import TagsSelector from '@/components/material-ui/Autocomplete';
import TextInput from '@/components/material-ui/TextInput';
import styles from '@/styles/admin/edit-product/id.module.css'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { TAGS_POOL, TYPES_POOL } from '../../../../consts';
import ColorSelector from '@/components/ColorSelector';
import SizesSelector from '@/components/SizesSelector';
import { Button, Checkbox, FormControlLabel, Slider } from '@mui/material';
import Link from 'next/link';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import NoFound404 from '@/pages/404';

export default withRouter(props => {

    const {
        router,
        supportsHoverAndPointer,
        session,
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
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div>
                            <Link
                                href='/admin/edit-product'
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
                            </Link>
                        </div>
                        {product &&
                            <div className={styles.productContainer}>
                                <div className={styles.productLeft}>
                                    <SizesSelector
                                        value={product.sizes}
                                        options={TYPES_POOL.find(t => t.id === product.type).sizes}
                                        onChange={() => { }}
                                    />
                                </div>
                                <div className={styles.productRight}>
                                    <TextInput
                                        label='Title'
                                        value={product.title}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                    <TextInput
                                        label='Description'
                                        value={product.description}
                                        supportsHoverAndPointer={supportsHoverAndPointer}
                                    />
                                    <TextInput
                                        label='Type'
                                        value={product.type}
                                        disabled
                                        supportsHoverAndPointer={supportsHoverAndPointer}
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
                                    <h3>
                                        Price (USD)
                                    </h3>
                                    {product.sizes.map((size, i) =>
                                        <div
                                            className='flex center'
                                            style={{
                                                gap: '1rem'
                                            }}
                                            key={i}
                                        >
                                            <TextInput
                                                supportsHoverAndPointer={supportsHoverAndPointer}
                                                label={`${size.title}`}
                                                onChange={event => { }}
                                                value={product.variants.find(vari => vari.size_id === size.id).price}
                                                style={{
                                                    width: '80px',
                                                }}
                                            />
                                            <Slider
                                                value={product.variants.find(vari => vari.size_id === size.id).price}
                                                min={product.variants.find(vari => vari.size_id === size.id).cost}
                                                max={product.variants.find(vari => vari.size_id === size.id).cost * 4}
                                                valueLabelDisplay="auto"
                                                onChange={event => { }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        {product === null &&
                            <div>
                                <h1>Product not exist</h1>
                            </div>
                        }
                        {product === undefined &&
                            <div>

                            </div>
                        }
                    </main>
                </div>
    )
})