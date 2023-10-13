import MyTooltip from './MyTooltip';

export default function ColorButton(props) {
    const {
        onClick,
        onMouseUp,
        selected,
        style,
        color,
        supportsHoverAndPointer,
    } = props

    const buttonStyle = {
        borderRadius: '100%',
        height: 40,
        width: 40,
        border: 'none',
        backgroundColor: color.colors.length === 1 ? color.colors[0] : 'transparent',
        outline: selected ? '2px solid var(--primary)' : '0.5px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.2), 0px 3px 6px 0px rgba(0, 0, 0, 0.14), 0px 1px 11px 0px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        ...style,
    }

    return (
        supportsHoverAndPointer
            ? <MyTooltip
                title={color.title}
                arrow
                backgroundColor='#000000'
                titleColor='#ffffff'
                content={
                    <button
                        onClick={event => { if (onClick) onClick(event, color) }}
                        onMouseUp={event => { if (onMouseUp) onMouseUp(event, color) }}
                        style={buttonStyle}
                    >
                        {color.colors.length > 1 &&
                            <div className='flex' style={{ height: '100%', width: '100%' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: '50%',
                                        backgroundColor: color.colors[0]
                                    }}
                                >
                                </div>
                                <div
                                    style={{
                                        height: '100%',
                                        width: '50%',
                                        backgroundColor: color.colors[1]
                                    }}
                                >
                                </div>
                            </div>
                        }
                    </button>
                }
            />
            : <button
                onClick={event => { if (onClick) onClick(event, color) }}
                onMouseUp={event => { if (onMouseUp) onMouseUp(event, color) }}
                style={buttonStyle}
            >
                {color.colors.length > 1 &&
                    <div className='flex' style={{ height: '100%', width: '100%' }}>
                        <div
                            style={{
                                height: '100%',
                                width: '50%',
                                backgroundColor: color.colors[0]
                            }}
                        >
                        </div>
                        <div
                            style={{
                                height: '100%',
                                width: '50%',
                                backgroundColor: color.colors[1]
                            }}
                        >
                        </div>
                    </div>
                }
            </button>
    )
}