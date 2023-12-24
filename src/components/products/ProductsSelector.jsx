import { PRODUCTS_TYPES } from '@/consts'
import { useAppContext } from '../contexts/AppContext'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styles from '@/styles/components/products/ProductsSelector.module.css'

export default function ProductsSelector(props) {
    const {
        url = ''
    } = props

    const {
    } = useAppContext()

    const tCommon = useTranslation('common').t

    return (
        <div className={styles.container}>
            {PRODUCTS_TYPES.map((type, i) =>
                <Link
                    className={`${styles.option} noUnderline`}
                    key={i}
                    href={`${url}/${type.id}`}
                >
                    <type.icon
                        className={styles.optionIcon}
                    />
                    <p>
                        {tCommon(type.family_id).concat(type.id === 'mug-c' ? '-C' : '')}
                    </p>
                </Link>
            )}
        </div>
    )
}