import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import styles from '@/styles/components/material-ui/PasswordInput.module.css'
import { motion } from 'framer-motion'
import { showToast } from '@/utils/toasts';
import { useTranslation } from 'next-i18next'
import { LIMITS } from '../../../consts';

export default function PasswordInput(props) {
    const {
        onChange,
        mobile,
        name = 'password',
        label = 'Password',
        showModalGuide,
        setShowModalGuide,
        value,
        style,
        autoComplete = 'off',
        supportsHoverAndPointer,
        dark,
        colorBorderHover = dark ? '#000000' : '#ffffff',
        colorBorder = dark ? '#00000070' : '#ffffff90',
        colorBorderFocus = 'var(--primary)',
        colorLabelHover = dark ? '#000000' : '#ffffff',
        colorLabel = dark ? '#000000' : '#ffffff',
        colorLabelFocus = 'var(--primary)',
        colorText = dark ? '#000000' : '#ffffff',
        limit = LIMITS.input_password,
    } = props

    const [showPassword, setShowPassword] = useState(false)
    const [focus, setFocus] = useState(false)
    const [hover, setHover] = useState(false)
    const [toastActive, setToastActive] = useState(false)

    const [hasUpper, setHasUpper] = useState(false)
    const [hasLower, setHasLower] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasLength, setHasLength] = useState(false)

    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    function handleOnChange(event) {
        if (onChange) {
            if (event.target.value.length <= limit) {
                onChange(event)
                const pass = event.target.value
                setHasUpper(/[A-Z]+/.test(pass))
                setHasLower(/[a-z]+/.test(pass))
                setHasNumber(/[0-9]+/.test(pass))
                setHasLength(/.{6,}/.test(pass))
            }
            else if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
        }
    }

    function handleFocus() {
        setFocus(true)
    }

    function handleBlur() {
        setFocus(false)
        if (setShowModalGuide)
            setShowModalGuide(false)
    }

    return (
        <FormControl
            size='small'
            sx={{ width: '100%' }}
            variant="outlined"
        >
            <InputLabel
                sx={{
                    color: `${focus
                        ? colorLabelFocus
                        : hover || !supportsHoverAndPointer
                            ? colorLabelHover
                            : colorLabel
                        } !important`,
                    transition: 'all ease-in-out 200ms',
                }}
            >
                {label}
            </InputLabel>
            <OutlinedInput
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                label={label}
                name={name}
                autoComplete={autoComplete}
                value={value}
                type={showPassword ? 'text' : 'password'}
                onChange={handleOnChange}
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
                    '.MuiInputBase-input': {
                        WebkitTextFillColor: `${colorText} !important`,
                        color: `${colorText} !important`,
                        transition: 'all ease-in-out 200ms',
                    },
                    borderRadius: '4px',
                    boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
                }}
            />
            {(showModalGuide || focus) &&
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
                        <p className={styles.title}>{tCommon('at_least')}:</p>
                        <div className={styles.checkItems}>
                            <div className={styles.checkItem}>
                                {hasLower ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>{tCommon('at_least_lower_case')}</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasUpper ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>{tCommon('at_least_upper_case')}</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasNumber ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>{tCommon('at_least_number')}</p>
                            </div>
                            <div className={styles.checkItem}>
                                {hasLength ? <CheckRoundedIcon className={styles.success} /> : <CloseRoundedIcon className={styles.error} />}<p className={styles.itemText}>{tCommon('at_least_characters_long')}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            }
        </FormControl>
    )
}