import { useTranslation } from 'next-i18next'
import styles from '@/styles/components/products/KeyFeatures.module.css'
import Image from 'next/image'

export default function KeyFeatures(props) {

    const {
        options
    } = props

    const tKeyFeatures = useTranslation('key-features').t

    return (
        <div
            className={styles.container}
        >
            {options.map((option, i) =>
                <div
                    className={styles.option}
                    key={i}
                >
                    <div className={styles.imageContainer}>
                        <Image
                            alt={option}
                            src={`/svgs/key-features/${option}.svg`}
                            fill
                            sizes='80px'
                            quality={100}
                        />
                    </div>
                    <p className={styles.title}>{tKeyFeatures(option)}</p>
                    <p>{tKeyFeatures(`${option}_description`)}</p>
                </div>
            )}
        </div>
    )
}