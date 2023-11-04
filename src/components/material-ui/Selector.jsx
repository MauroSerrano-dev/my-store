import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useState } from 'react';

export default function Selector(props) {
    const {
        label,
        options = [],
        value = '',
        dark,
        colorBorderHover = dark ? '#000000' : '#ffffff',
        colorBorder = dark ? '#00000070' : '#ffffff90',
        colorBorderFocus = 'var(--primary)',
        colorLabelHover = dark ? '#000000' : '#ffffff',
        colorLabel = dark ? '#000000' : '#ffffff',
        colorLabelFocus = 'var(--primary)',
        colorText = dark ? '#000000' : '#ffffff',
        colorIcon = dark ? '#000000' : '#ffffff',
        styleOption,
        onChange,
        width,
        supportsHoverAndPointer,
        name = 'name',
        style,
        styleLabel,
    } = props

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)

    return (
        <FormControl
            sx={{
                width: width ? width : '100%',
            }}
        >
            <InputLabel
                sx={{
                    color: `${focus
                        ? colorLabelFocus
                        : hover || !supportsHoverAndPointer
                            ? colorLabelHover
                            : colorLabel} !important`,
                    transition: 'all ease-in-out 200ms',
                    ...styleLabel
                }}
            >
                {label}
            </InputLabel>
            <Select
                name={name}
                label={label}
                value={value}
                MenuProps={{ disableScrollLock: true }}
                size='small'
                sx={{
                    color: colorText,
                    '.MuiSelect-select': {
                        textAlign: 'start',
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: `${focus
                            ? colorBorderFocus
                            : hover || !supportsHoverAndPointer
                                ? colorBorderHover
                                : colorBorder} !important`,
                        transition: 'all ease-in-out 200ms',
                    },
                    '.MuiSelect-iconOutlined': {
                        color: colorIcon,
                        transition: 'all ease-in-out 200ms',
                    },
                    ...style
                }}
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setHover(false)}
            >
                {
                    options.map((option, i) =>
                        <MenuItem
                            value={option.value || option}
                            key={i}
                            sx={{
                                ...styleOption
                            }}
                        >
                            {option.name || option}
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>
    )
}