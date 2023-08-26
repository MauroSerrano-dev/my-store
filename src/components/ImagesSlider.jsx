import styles from '@/styles/components/ImagesSlider.module.css'
import { useState } from 'react'

export default function ImagesSlider(props) {
    const {
        images,
        imagesIndexSelect,
        setImagesIndexSelect
    } = props

    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    function handleViewClick(index) {
        imagesIndexSelect.includes(index)
            ? setImagesIndexSelect(prev => prev.filter(i => i !== index))
            : setImagesIndexSelect(prev => [...prev, index])
    }

    return (
        <div
            className={styles.container}
        >
            <div
                className={styles.view}
                onClick={() => handleViewClick(currentImgIndex)}
            >
                <div
                    className={styles.viewImages}
                    style={{
                        transform: `translateX(${480 * currentImgIndex * (-1)}px)`
                    }}
                >
                    {images.map((img, i) =>
                        <div
                            className={styles.imgViewContainer}
                            key={i}
                        >
                            {imagesIndexSelect && imagesIndexSelect.includes(i) &&
                                <div className={styles.select}>
                                    <div className={styles.circle}>
                                        {imagesIndexSelect.findIndex(ele => ele === i) + 1}
                                    </div>
                                </div>
                            }
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
                        {imagesIndexSelect && imagesIndexSelect.includes(i) &&
                            <div className={styles.select}>
                                <div className={styles.miniCircle}>
                                    {imagesIndexSelect.findIndex(ele => ele === i) + 1}
                                </div>
                            </div>
                        }
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
