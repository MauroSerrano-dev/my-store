import styles from '@/styles/components/ImagesSlider.module.css'
import { useState } from 'react'

export default function ImagesSlider(props) {
    const {
        images
    } = props

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    return (
        <div
            className={styles.container}
        >
            <div className={styles.view}>
                <img
                    className={styles.imgView}
                    src={images[currentImgIndex].src}
                />
            </div>
            <div
                className={styles.options}
            >
                {images.map((img, i) =>
                    <div
                        className={styles.imgOptionContainer}
                        key={i}
                        onClick={() => setCurrentImgIndex(i)}
                    >
                        <div
                            className={styles.optionShadow}
                            style={{
                                opacity: currentImgIndex === i
                                    ? 0
                                    : undefined
                            }}
                        >
                        </div>
                        <img
                            className={styles.imgOption}
                            src={img.src}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
