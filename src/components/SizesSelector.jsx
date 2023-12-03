import styles from '@/styles/components/SizesSelector.module.css'

export default function SizesSelector(props) {
    const {
        value = [],
        options = [],
        onChange,
        style
    } = props

    return (
        <div
            className={styles.container}
            style={{
                ...style
            }}
        >
            {options.map((option, i) =>
                <button
                    key={i}
                    onClick={() => onChange(value.some(size => option.id === size?.id)
                        ? value.filter(size => option.id !== size?.id)
                        : value.concat(option),
                        i,
                        option
                    )}
                    className={`${styles.button} ${value.some(size => option.id === size?.id) ? styles.buttonActive : ''}`}
                >
                    {option.title}
                </button>
            )}
        </div>
    )
}