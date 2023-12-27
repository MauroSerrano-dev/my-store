import { PRODUCTS_TYPES } from '@/consts';
import { useTranslation } from 'next-i18next'

export default function ProductTag(props) {
    const {
        style,
        product
    } = props

    const tCommon = useTranslation('common').t

    return (
        <div
            style={{
                padding: '0.1rem 0.5rem',
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '30rem',
                backgroundColor: PRODUCTS_TYPES.find(type => type.id === product.type_id).color,
                whiteSpace: 'nowrap',
                ...style,
            }}
        >
            <p>{tCommon(product.type_id)}</p>
        </div>
    )
}