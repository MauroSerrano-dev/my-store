import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useState } from 'react';

export default function PasswordInput(props) {
    const {
        onChange
    } = props

    const [showPassword, setShowPassword] = useState(false)

    return (
        <FormControl size='small' sx={{ width: '100%' }} variant="outlined">
            <InputLabel>
                Password
            </InputLabel>
            <OutlinedInput
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                onChange={onChange}
                autoComplete='off'
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(prev => !prev)}
                            edge="end"
                            size='small'
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}