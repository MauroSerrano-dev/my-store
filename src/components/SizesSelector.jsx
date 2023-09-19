import styles from '../styles/components/SizesSelector.module.css'

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
                    onClick={() => onChange(value.some(color => option.id === color?.id)
                        ? value.filter(color => option.id !== color?.id)
                        : value.concat(option),
                        i,
                        option.id
                    )}
                    className={styles.button}
                    style={{
                        opacity: value.some(color => option.id === color?.id) ? 1 : 0.7,
                        outline: value.some(color => option.id === color?.id) ? '2px solid var(--primary)' : '1px solid black',
                    }}
                >
                    {option.title}
                </button>
            )}
        </div>
    )
}