import styles from '@/styles/components/TagsInput.module.css'
import { useEffect, useRef, useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function TagsInput(props) {
    const {
        tags,
        setTags
    } = props

    const [focus, setFocus] = useState()
    const [value, setValue] = useState('')
    const inputTextRef = useRef(null)

    function handleInput(event) {
        console.log(event.target.innerHTML)
        if (event.target.innerHTML.includes('<div><br></div>')) {
            createTag(value)
            setValue('')
            inputTextRef.current.innerText = ''
        }
        else
            setValue(event.target.innerText)
    }

    function createTag(newTag) {
        setTags(prev => [...prev, newTag.toLowerCase()])
    }

    useEffect(() => {
        console.log('tags', tags)
    }, [tags])

    function handleDeleteTag(index) {
        setTags(prev => prev.filter((tag, i) => index !== i))
    }

    return (
        <div
            className={styles.container}
            style={{
                outline: focus
                    ? '1px var(--primary) solid'
                    : undefined,
                border: focus
                    ? '1px var(--primary) solid'
                    : '1px transparent solid',
                '--text-color': focus
                    ? 'var(--primary)'
                    : 'var(--global-white)'
            }}
        >
            {tags.length > 0 &&
                <div className={styles.tags}>
                    {tags.map((tag, i) =>
                        <div
                            key={i}
                            className={styles.tag}
                            style={{
                                '--text-color': focus
                                    ? 'var(--text-black)'
                                    : 'var(--text-white)',
                                backgroundColor: focus
                                    ? 'var(--global-white)'
                                    : 'rgb(100, 100, 100)',
                            }}
                        >
                            {tag}
                            <CloseRoundedIcon
                                onClick={() => handleDeleteTag(i)}
                                style={{
                                    fontSize: '14px',
                                    backgroundColor: 'rgb(35, 35, 35)',
                                    borderRadius: '10rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-white)',
                                }}
                            />
                        </div>
                    )}
                </div>
            }
            <div
                ref={inputTextRef}
                onInput={handleInput}
                contentEditable
                className={styles.input}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{
                    borderTop: tags.length === 0
                        ? 'none'
                        : focus
                            ? '1px var(--primary) solid'
                            : undefined,
                }}
            >
            </div>
            <div
                className={styles.label}
                style={{
                    top: focus || value !== '' || tags.length > 0
                        ? '-50%'
                        : '0'
                }}
            >
                <p>
                    Tags
                </p>
            </div>
        </div >
    )
}
