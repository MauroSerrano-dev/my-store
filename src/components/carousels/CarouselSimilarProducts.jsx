import { useEffect, useState } from 'react';
import { getSimilarProducts } from '../../../frontend/product';
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next'
import CarouselProducts from './CarouselProducts';

export default function CarouselSimilarProducts(props) {
    const {
        product_id,
        limit = 16,
    } = props

    const tToasts = useTranslation('toasts').t

    const [similarityProducts, setSimilarityProducts] = useState()

    useEffect(() => {
        if (product_id) {
            getProductsSimilarity()
        }
    }, [product_id])


    async function getProductsSimilarity() {
        try {
            const products = await getSimilarProducts(product_id, limit)
            setSimilarityProducts(products)
        }
        catch (error) {
            console.error(error)
            showToast({ type: error?.type || 'error', msg: tToasts(error.message) })
        }
    }

    return (
        <CarouselProducts
            products={similarityProducts}
        />
    )
}