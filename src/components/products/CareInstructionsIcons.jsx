import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styles from '@/styles/components/products/CareInstructions.module.css'

export default function CareInstructionsIcons(props) {

    const {
        options,
    } = props

    const tCareInstructions = useTranslation('care-instructions').t

    return (
        <div
            className={styles.container}
        >
            {options.map((option, i) =>
                <div
                    className={styles.option}
                    key={i}
                >
                    <div
                        className={styles.imageContainer}
                    >
                        <Image
                            alt={option}
                            src={`/svgs/care-instructions/${option}.svg`}
                            fill
                            sizes='55px'
                            quality={100}
                        />
                    </div>
                    {tCareInstructions(option).split('\n').map((line, i) => (
                        <p key={i} style={{ fontSize: 13 }}>
                            {line}
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}