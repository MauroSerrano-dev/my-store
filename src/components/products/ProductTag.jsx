import { PRODUCTS_TYPES } from '@/consts';
import { useTranslation } from 'next-i18next'

export default function ProductTag(props) {
    const {
        style,
        product,
        promotion,
    } = props

    const tCommon = useTranslation('common').t

    return (
        <div
            style={{
                padding: '0.1rem 0.5rem',
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '30rem',
                backgroundColor: promotion ? 'var(--promotion-color)' : PRODUCTS_TYPES[product.type_id].color,
                whiteSpace: 'nowrap',
                '--text-color': 'var(--text-white)',
                ...style,
            }}
        >
            <p>{promotion ? `${promotion.percentage * 100}% OFF` : tCommon(product.type_id)}</p>
        </div>
    )
}