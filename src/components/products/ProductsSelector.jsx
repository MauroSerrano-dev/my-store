import { PRODUCTS_TYPES } from '@/consts'
import { useAppContext } from '../contexts/AppContext'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styles from '@/styles/components/products/ProductsSelector.module.css'
import Image from 'next/image'

export default function ProductsSelector(props) {
    const {
        url = ''
    } = props

    const {
    } = useAppContext()

    const tCategories = useTranslation('categories').t

    return (
        <div className={styles.container}>
            {PRODUCTS_TYPES.map((type, i) =>
                <Link
                    className={`${styles.option} noUnderline`}
                    key={i}
                    href={`${url}/${type.id}`}
                >
                    <div className={styles.imageContainer}>
                        <Image
                            alt={type.id}
                            src={type.icon}
                            fill
                            sizes='300px'
                            quality={100}
                            priority
                        />
                    </div>
                    <p>
                        {tCategories(type.family_id).concat(type.id === 'mug-c' ? '-C' : '')}
                    </p>
                </Link>
            )}
        </div>
    )
}