import { PRODUCTS_TYPES_ORDERED } from '@/consts'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styles from '@/styles/components/products/ProductsSelector.module.css'
import Image from 'next/image'

export default function ProductsSelector(props) {
    const {
        url = '',
        showAll
    } = props

    const tCommon = useTranslation('common').t

    return (
        <div className={styles.container}>
            {showAll &&
                <Link
                    className={`${styles.option} ${styles.optionAll} noUnderline`}
                    href={`${url}/all`}
                >
                    <p>
                        All
                    </p>
                </Link>
            }
            {PRODUCTS_TYPES_ORDERED.map((type, i) =>
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
                        {tCommon(type.id)}
                    </p>
                </Link>
            )}
        </div>
    )
}