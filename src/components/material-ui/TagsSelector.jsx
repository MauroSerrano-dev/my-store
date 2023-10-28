import { Autocomplete } from '@mui/material';
import TextInput from './TextInput';

export default function TagsSelector(props) {
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
        colorTagBg = dark ? '#363a3d' : '#363a3d',
        colorTagText = dark ? '#000000' : '#ffffff',
        colorClear = dark ? '#000000' : '#ffffff',
        colorIndicator = dark ? '#000000' : '#ffffff',
        colorDelete = dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
        colorDeleteHover = dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        onChange,
        style,
        sx,
        variant = 'outlined',
        autoComplete = 'off',
        placeholder,
        options = [],
        name,
        value,
        supportsHoverAndPointer,
    } = props

    return (
        <Autocomplete
            multiple
            options={options}
            onChange={onChange}
            value={value}
            sx={{
                ...sx,
                '.MuiAutocomplete-tag': {
                    backgroundColor: colorTagBg,
                    '--text-color': colorTagText,
                    transition: 'all ease-in-out 200ms',
                },
                '.MuiAutocomplete-clearIndicator': {
                    color: colorClear,
                    transition: 'all ease-in-out 200ms',
                },
                '.MuiAutocomplete-popupIndicator': {
                    color: colorIndicator,
                    transition: 'all ease-in-out 200ms',
                },
                '.MuiChip-deleteIcon': {
                    color: `${colorDelete} !important`,
                    transition: 'all ease-in-out 200ms'
                },
                '.MuiChip-deleteIcon:hover': {
                    color: `${colorDeleteHover} !important`,
                    transition: 'all ease-in-out 200ms'
                },
            }}
            renderInput={(params) => (
                <TextInput
                    supportsHoverAndPointer={supportsHoverAndPointer}
                    style={style}
                    params={params}
                    label={label}
                    dark={dark}
                    variant={variant}
                    colorBorderHover={colorBorderHover}
                    colorBorder={colorBorder}
                    colorBorderFocus={colorBorderFocus}
                    colorLabelHover={colorLabelHover}
                    colorLabel={colorLabel}
                    colorLabelFocus={colorLabelFocus}
                    colorText={colorText}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    name={name}
                />
            )}
        />
    )
}