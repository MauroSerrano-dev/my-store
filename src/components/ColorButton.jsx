import MyTooltip from './MyTooltip';

export default function ColorButton(props) {
    const {
        onChange,
        selected,
        style,
        option,
    } = props

    return (
        <MyTooltip
            title={option.title}
            arrow
            backgroundColor='#000000'
            titleColor='#ffffff'
            content={
                <button
                    onClick={event => onChange(event, option)}
                    style={{
                        borderRadius: '100%',
                        height: 40,
                        width: 40,
                        border: 'none',
                        backgroundColor: option.colors[0],
                        opacity: selected ? 1 : 0.7,
                        outline: selected ? '2px solid var(--primary)' : '1px solid black',
                        ...style,
                    }}
                >
                </button>
            }
        >
        </MyTooltip>
    )
}