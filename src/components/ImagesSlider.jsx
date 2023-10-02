import styles from '@/styles/components/ImagesSlider.module.css'
import { useState } from 'react'

export default function ImagesSlider(props) {
    const {
        images,
        style,
        width = 450,
        height = width * 10 / 9,
        index,
        onChange
    } = props

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    return (
        <div
            className={styles.container}
            style={{
                ...style,
            }}
        >
            <div>

            </div>
            <div
                className={styles.view}
                style={{
                    width: width,
                    height: height,
                }}
            >
                <div
                    className={styles.viewImages}
                    style={{
                        transform: `translateX(${width * (index ? index : currentImgIndex) * (-1)}px)`
                    }}
                >
                    {images.map((img, i) =>
                        <div
                            className={styles.imgViewContainer}
                            key={i}
                        >
                            <img
                                className={styles.imgView}
                                src={img.src}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div
                className={styles.options}
                style={{
                    gap: width * 0.025,
                    paddingTop: width * 0.025,
                    maxWidth: '100%',
                    height: height * 0.23,
                }}
            >
                {images.map((img, i) =>
                    <div
                        className={styles.imgOptionContainer}
                        key={i}
                        onClick={() => onChange ? onChange(i) : setCurrentImgIndex(i)}
                    >
                        <div
                            className={styles.optionShadow}
                            style={{
                                opacity: (index ? index : currentImgIndex) === i
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
        </div >
    )
}
