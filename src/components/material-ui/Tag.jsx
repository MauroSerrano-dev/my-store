import { Autocomplete, Chip } from '@mui/material';
import TextInput from './TextInput';

export default function Tag(props) {
    const {
        label = 'Label',
        dark,
        colorTagBg = dark ? '#363a3d' : '#363a3d',
        colorTagText = dark ? '#000000' : '#ffffff',
        colorDelete = dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
        colorDeleteHover = dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        onDelete,
        style,
        supportsHoverAndPointer,
    } = props

    return (
        <Chip
            onDelete={onDelete}
            label={label}
            sx={{
                backgroundColor: colorTagBg,
                '--text-color': colorTagText,
                transition: 'all ease-in-out 200ms',

                '.MuiChip-deleteIcon': {
                    color: `${colorDelete} !important`,
                    transition: 'all ease-in-out 200ms'
                },
                '.MuiChip-deleteIcon:hover': {
                    color: `${colorDeleteHover} !important`,
                    transition: 'all ease-in-out 200ms'
                },
                ...style
            }}
        />
    )
}