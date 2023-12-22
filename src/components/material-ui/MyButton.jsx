import { Button } from '@mui/material';
import React from 'react';

/**
 * MyButton is a custom button component based on Material-UI's Button.
 * It allows additional customization and passing content as children.
 *
 * @param {object} props - The properties of the component.
 * @param {object} [props.style] - Custom styles to apply to the button. `Default: {}`
 * @param {'small' | 'medium' | 'large'} [props.size] - Defines the size of the button. `Default: 'medium'`
 * @param {function} [props.onClick] - Function to be called when the button is clicked. `Default: null`
 * @param {React.ReactNode} props.children - Content to be displayed inside the button.
 * @param {'text' | 'outlined' | 'contained'} [props.variant] - The visual variant of the button. `Default: 'contained'`
 * @param {string} [props.className] - Additional class names for styling the button. `Default: null` 
 * @param {'default' | 'inherit' | 'primary' | 'secondary'} [props.color] - The color of the button. `Default: 'default'`
 * @param {boolean} [props.disabled] - If true, the button will be disabled. `Default: false`
*/

export default function MyButton(props) {
    const {
        style,
        size = 'medium',
        onClick,
        children,
        variant = 'contained',
        className,
        color,
        disabled,
    } = props

    return (
        <Button
            disabled={disabled}
            className={className}
            variant={variant}
            onClick={onClick}
            size={size}
            color={color}
            sx={{
                textTransform: 'none',
                ...style,
            }}
        >
            {children}
        </Button>
    )
}