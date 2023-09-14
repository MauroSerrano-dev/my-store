import styles from '../styles/components/ColorSelector.module.css'
import MyTooltip from './MyTooltip';

export default function ColorSelector(props) {
    const { options, onClick, value } = props

    return (
        <div
            className='flex row fillWidth'
            style={{
                gap: '0.5rem',
                flexWrap: 'wrap',
            }}
        >
            {options.map((option, i) =>
                <MyTooltip
                    key={i}
                    title={option.title}
                    arrow
                    backgroundColor='#000000'
                    titleColor='#ffffff'
                    content={
                        <button
                            onClick={() => onClick(option, i)}
                            className={styles.button}
                            style={{
                                backgroundColor: option.colors[0],
                                opacity: value.some(color => option.id === color?.id) ? 1 : 0.7,
                                outline: value.some(color => option.id === color?.id) ? '2px solid var(--primary)' : '1px solid black',
                            }}
                        >
                        </button>
                    }
                >
                </MyTooltip>
            )}
        </div>
    )
}