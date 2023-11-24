import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import styles from '@/styles/components/material-ui/PasswordInput.module.css'
import { motion } from 'framer-motion'

export default function PasswordInput(props) {
    const {
        onChange,
        mobile,
        name = 'password',
        label = 'Password',
        showModalGuide
    } = props

    const [showPassword, setShowPassword] = useState(false)
    const [focus, setFocus] = useState(false)

    const [hasUpper, setHasUpper] = useState(false)
    const [hasLower, setHasLower] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasLength, setHasLength] = useState(false)
    const [password, setPassword] = useState('')

    function handleOnChange(event) {
        onChange(event)
        const pass = event.target.value
        setHasUpper(/[A-Z]+/.test(pass))
        setHasLower(/[a-z]+/.test(pass))
        setHasNumber(/[0-9]+/.test(pass))
        setHasLength(/.{6,}/.test(pass))
        setPassword(pass)
    }

    return (
        <FormControl
            size='small'
            sx={{ width: '100%' }}
            variant="outlined"
        >
            <InputLabel>
                Password
            </InputLabel>
            <OutlinedInput
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                label={label}
                name={name}
                type={showPassword ? 'text' : 'password'}
                onChange={handleOnChange}
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
            {showModalGuide && (focus || (password.length !== 0 && (!hasLower || !hasUpper || !hasNumber || !hasLength))) &&
                <motion.div
                    className={styles.modalContainer}
                    style={{
                        right: mobile ? 'auto' : 0,
                        left: mobile ? 0 : 'auto'
                    }}
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                        }
                    }}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div className={styles.modalBody}>
                        <p className={styles.title}>At least:</p>
                        <div className={styles.checkItems}>
                            <div className={styles.checkItem}>
                                {hasLower ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>1 lower case letter</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasUpper ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>1 upper case letter</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasNumber ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>1 number</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasLength ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>6 characters long</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            }
        </FormControl>
    )
}