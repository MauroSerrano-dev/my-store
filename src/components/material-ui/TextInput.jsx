import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { showToast } from '../../../utils/toasts';
import { useTranslation } from 'next-i18next'
import { LIMITS } from '../../../consts';

export default function TextInput(props) {
    const {
        label,
        dark,
        colorBorderHover = dark ? '#000000' : '#ffffff',
        colorBorder = dark ? '#00000070' : '#ffffff90',
        colorBorderFocus = 'var(--primary)',
        colorLabelHover = dark ? '#000000' : '#ffffff',
        colorLabel = dark ? '#000000' : '#ffffff',
        colorLabelFocus = 'var(--primary)',
        colorText = dark ? '#000000' : '#ffffff',
        onChange,
        style,
        styleInput,
        variant = 'outlined',
        autoComplete = 'off',
        name,
        params,
        placeholder,
        value,
        defaultValue,
        supportsHoverAndPointer,
        disabled
    } = props

    const tToasts = useTranslation('toasts').t

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)
    const [toastActive, setToastActive] = useState(false)

    function handleOnChange(event) {
        if (onChange) {
            if (event.target.value.length <= LIMITS.input_search_bar)
                onChange(event)
            else if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
        }
    }

    useEffect(() => {
        if (params && !toastActive && params.inputProps.value.length > LIMITS.input_country) {
            setToastActive(true)
            showToast({ msg: tToasts('input_limit') })
            setTimeout(() => {
                setToastActive(false)
            }, 3000)
        }
    }, [params])

    return (
        <TextField
            {...params}
            inputProps={{ ...params.inputProps, value: params.inputProps.value.slice(0, LIMITS.input_country) }}
            variant={variant}
            label={label}
            name={name}
            autoComplete={autoComplete}
            onChange={handleOnChange}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
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
                '.MuiInputLabel-outlined': {
                    color: `${focus
                        ? colorLabelFocus
                        : hover || !supportsHoverAndPointer
                            ? colorLabelHover
                            : colorLabel
                        } !important`,
                    transition: 'all ease-in-out 200ms',
                },
                '.MuiInputBase-input': {
                    WebkitTextFillColor: `${colorText} !important`,
                    color: `${colorText} !important`,
                    transition: 'all ease-in-out 200ms',
                    ...styleInput,
                },
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        />
    )
}