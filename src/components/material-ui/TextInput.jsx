import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next'
import { useAppContext } from '../contexts/AppContext';

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
        disabled,
        limit = 300,
        size,
        type,
        multiline,
        minRows
    } = props

    const {
        supportsHoverAndPointer,
    } = useAppContext()

    const tToasts = useTranslation('toasts').t

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)
    const [toastActive, setToastActive] = useState(false)

    function handleOnChange(event) {
        if (onChange) {
            if (event.target.value.length <= limit)
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
        if (params && !toastActive && params.inputProps.value.length > limit) {
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
            multiline={multiline}
            inputProps={params ? { ...params.inputProps, value: params.inputProps.value.slice(0, limit) } : undefined}
            type={type}
            minRows={minRows}
            variant={variant}
            label={label}
            name={name}
            autoComplete={autoComplete}
            onChange={handleOnChange}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            size={size}
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
                borderRadius: '4px',
                boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        />
    )
}