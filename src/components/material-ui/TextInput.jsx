import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export default function TextInput(props) {
    const {
        label = 'Label',
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
        variant = 'outlined',
        autoComplete = 'off',
        name,
        params,
        placeholder,
        value,
        defaultValue,
        supportsHoverAndPointer,
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
                    color: colorText,
                    transition: 'all ease-in-out 200ms',
                },
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        />
    )
}