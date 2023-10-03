import ColorButton from './ColorButton';

export default function ColorSelector(props) {
    const {
        options = [],
        onChange,
        value = [],
        style
    } = props

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0.5rem',
                flexWrap: 'wrap',
                maxWidth: '100%',
                ...style
            }}
        >
            {options.map((option, i) =>
                <ColorButton
                    key={i}
                    selected={value.some(color => option.id === color?.id)}
                    onChange={(event) => onChange(value.some(color => option.id === color?.id)
                        ? value.filter(color => option.id !== color?.id)
                        : value.concat(option),
                        i,
                        option,
                        event
                    )}
                    option={option}
                />
            )}
        </div>
    )
}