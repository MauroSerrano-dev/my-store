import { TextField } from '@mui/material';
import { useState } from 'react';

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

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)

    return (
        <TextField
            {...params}
            variant={variant}
            label={label}
            name={name}
            autoComplete={autoComplete}
            onChange={onChange}
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