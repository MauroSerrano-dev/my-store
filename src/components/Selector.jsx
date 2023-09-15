import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Selector(props) {
    const {
        label = 'Label',
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
        height
    } = props

    const [hover, setHover] = useState(false)
    const [focus, setFocus] = useState(false)
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState(false)

    useEffect(() => {
        setSupportsHoverAndPointer(
            window.matchMedia('(hover: hover)').matches &&
            window.matchMedia('(pointer: fine)').matches
        )
    }, [])

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
                    transition: 'all ease-in-out 200ms'
                }}
            >
                {label}
            </InputLabel>
            <Select
                label={label}
                value={value}
                MenuProps={{ disableScrollLock: true }}
                size='small'
                sx={{
                    color: colorText,
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: `${focus
                            ? colorBorderFocus
                            : hover || !supportsHoverAndPointer
                                ? colorBorderHover
                                : colorBorder} !important`,
                        transition: 'all ease-in-out 200ms'
                    },
                    '.MuiSelect-iconOutlined': {
                        color: colorIcon
                    },
                    '.css-g3hgs1-MuiBackdrop-root-MuiModal-backdrop': {
                        backgroundColor: 'red !important'
                    }
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
                            value={option.value}
                            key={i}
                            sx={{
                                ...styleOption
                            }}
                        >
                            {option.name}
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>
    )
}