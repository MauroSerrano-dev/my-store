import { styled } from '@mui/system';
import { TextField } from '@mui/material';

export const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiFormLabel-root': {
        color: '#ffffff',
        transition: 'all 0.25s ease',
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        },
    },
    '& .MuiFilledInput-root': {
        '& input': {
            color: '#ffffff',
            transition: 'all 0.25s ease',
        },
        '&.Mui-focused': {
            '& input': {
                color: theme.palette.primary.main,
            },
        },
    },
    '& .MuiOutlinedInput-root': {
        '& input': {
            transition: 'all 0.25s ease',
            color: '#ffffff',
        },
        '& fieldset': {
            transition: 'border-color 0.25s ease',
            borderColor: '#ffffff90',
        },
        '&:hover fieldset': {
            borderColor: '#ffffff',
        },
        '&.Mui-focused': {
            '& fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '& input': {
                color: theme.palette.primary.main,
            },
        },
    },
}))