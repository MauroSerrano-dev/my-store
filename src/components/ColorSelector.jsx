import ColorButton from './ColorButton';

export default function ColorSelector(props) {
    const {
        options = [],
        onChange,
        value = [],
        style,
        styleButton,
        supportsHoverAndPointer,
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
                    supportsHoverAndPointer={supportsHoverAndPointer}
                    selected={value.some(color => option.id === color?.id)}
                    onClick={(event) => onChange(value.some(color => option.id === color?.id)
                        ? value.filter(color => option.id !== color?.id)
                        : value.concat(option),
                        i,
                        option,
                        event
                    )}
                    color={option}
                    style={{
                        ...styleButton
                    }}
                />
            )}
        </div>
    )
}