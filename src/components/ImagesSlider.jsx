import styles from '@/styles/components/ImagesSlider.module.css'

export default function ImagesSlider(props) {
    const {
        images,
        currentImgIndex,
        setCurrentImgIndex,
    } = props

    return (
        <div
            className={styles.container}
        >
            <div
                className={styles.view}
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
