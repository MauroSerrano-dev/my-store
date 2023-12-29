import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styles from '@/styles/components/products/CareInstructions.module.css'

export default function CareInstructionsIcons(props) {

    const {
        options,
    } = props

    const tCareInstructions = useTranslation('care-instructions').t
    
    const imageStyle = {
        position: 'relative',
        height: 55,
        width: 55
    }

    const OPTIONS = {
        'not-dryclean': {
            icon: '/svgs/care-instructions/not-dryclean.svg',
        },
        'machine-wash-warm': {
            icon: '/svgs/care-instructions/machine-wash-warm.svg',
        },
        'bleach': {
            icon: '/svgs/care-instructions/bleach.svg',
        },
        'not-bleach': {
            icon: '/svgs/care-instructions/not-bleach.svg',
        },
        'tumble-dry-low': {
            icon: '/svgs/care-instructions/tumble-dry-low.svg',
        },
        'tumble-dry-medium': {
            icon: '/svgs/care-instructions/tumble-dry-medium.svg',
        },
        'iron-low': {
            icon: '/svgs/care-instructions/iron-low.svg',
        },
    }

    return (
        <div
            className={styles.container}
        >
            {options.map((option, i) =>
                <div
                    className={styles.option}
                    key={i}
                >
                    <div style={imageStyle}>
                        <Image
                            alt={option}
                            src={OPTIONS[option].icon}
                            fill
                            sizes='55px'
                            quality={100}
                        />
                    </div>
                    <div>{tCareInstructions(option)}</div>
                </div>
            )}
        </div>
    )
}