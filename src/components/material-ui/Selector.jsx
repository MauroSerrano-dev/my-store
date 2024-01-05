import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

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
        name = 'name',
        style,
        styleLabel,
        size = 'small',
        styleForm,
    } = props

    const {
        supportsHoverAndPointer,
    } = useAppContext()

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)

    return (
        <FormControl
            sx={{
                width: width ? width : '100%',
                ...styleForm
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
                size={size}
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
                            value={option.value === undefined ? option : option.value}
                            key={i}
                            sx={{
                                ...styleOption
                            }}
                        >
                            {option.name === undefined ? option : option.name}
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>
    )
}