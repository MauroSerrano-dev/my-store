import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next'
import { useAppContext } from '../contexts/AppContext';

export default function TextOutlinedInput(props) {
    const {
        onChange,
        name,
        label,
        setShowModalGuide,
        value,
        style,
        autoComplete = 'off',
        dark,
        colorBorderHover = dark ? '#000000' : '#ffffff',
        colorBorder = dark ? '#00000070' : '#ffffff90',
        colorBorderFocus = 'var(--primary)',
        colorLabelHover = dark ? '#000000' : '#ffffff',
        colorLabel = dark ? '#000000' : '#ffffff',
        colorLabelFocus = 'var(--primary)',
        colorText = dark ? '#000000' : '#ffffff',
        limit = 300,
        inputAdornment,
        inputAdornmentPosition = 'end',
        size = 'normal',
    } = props

    const {
        supportsHoverAndPointer,
    } = useAppContext()

    const [focus, setFocus] = useState(false)
    const [hover, setHover] = useState(false)
    const [toastActive, setToastActive] = useState(false)

    const tToasts = useTranslation('toasts').t

    function handleOnChange(event) {
        if (onChange) {
            if (event.target.value.length <= limit) {
                onChange(event)
            }
            else if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
        }
    }

    function handleFocus() {
        setFocus(true)
    }

    function handleBlur() {
        setFocus(false)
        if (setShowModalGuide)
            setShowModalGuide(false)
    }

    return (
        <FormControl
            size={size}
            sx={{ width: '100%' }}
            variant="outlined"
        >
            <InputLabel
                sx={{
                    color: `${focus
                        ? colorLabelFocus
                        : hover || !supportsHoverAndPointer
                            ? colorLabelHover
                            : colorLabel
                        } !important`,
                    transition: 'all ease-in-out 200ms',
                }}
            >
                {label}
            </InputLabel>
            <OutlinedInput
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                label={label}
                name={name}
                autoComplete={autoComplete}
                value={value}
                onChange={handleOnChange}
                endAdornment={
                    inputAdornment
                        ? <InputAdornment position={inputAdornmentPosition}>
                            {inputAdornment}
                        </InputAdornment>
                        : undefined
                }
                sx={{
                    ...style,
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: `${focus
                            ? colorBorderFocus
                            : hover || !supportsHoverAndPointer
                                ? colorBorderHover
                                : colorBorder
                            } !important`,
                        transition: 'all ease-in-out 200ms',
                    },
                    '.MuiInputBase-input': {
                        WebkitTextFillColor: `${colorText} !important`,
                        color: `${colorText} !important`,
                        transition: 'all ease-in-out 200ms',
                    },
                    borderRadius: '4px',
                    boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
                }}
            />
        </FormControl>
    )
}