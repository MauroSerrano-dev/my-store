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
                        outline: selected ? '2px solid var(--primary)' : '0.5px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.2), 0px 3px 6px 0px rgba(0, 0, 0, 0.14), 0px 1px 11px 0px rgba(0, 0, 0, 0.12)',
                        ...style,
                    }}
                >
                </button >
            }
        >
        </MyTooltip >
    )
}