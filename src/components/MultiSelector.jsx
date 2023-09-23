import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    disableScrollLock: true
}

export default function MultiSelector(props) {
    const { list, label, onChange, value, supportsHoverAndPointer } = props
    const [hover, setHover] = React.useState(false)
    const [focus, setFocus] = React.useState(false)

    return (
        <FormControl
            sx={{
                m: 1,
                width: '100%'
            }}
        >
            <InputLabel
                sx={{
                    color: 'var(--text-white)'
                }}
            >
                {label}
            </InputLabel>
            <Select
                sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: `${focus
                            ? 'var(--primary)' :
                            hover || !supportsHoverAndPointer
                                ? '#ffffff'
                                : '#ffffff90'} !important`,
                        transition: 'all ease-in-out 200ms'
                    },
                    '.MuiSelect-iconOutlined': {
                        color: 'var(--global-white)'
                    },
                    '.MuiChip-root': {
                        backgroundColor: '#363a3d',
                        '--text-color': 'var(--global-white)',
                    },
                }}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setHover(false)}
                multiple
                value={value}
                onChange={onChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {list.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}