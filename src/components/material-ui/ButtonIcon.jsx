import { IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ButtonIcon(props) {
    const {
        dark,
        onClick,
        icon,
        width = '40px',
        height = '40px',
        iconColor = dark ? '#000000' : '#ffffff',
        iconColorHover = dark ? '#000000' : '#ffffff',
        backgroundColor = dark ? 'transparent' : 'transparent',
        backgroundColorHover = dark ? '#00000020' : '#ffffff20',
    } = props

    const [hover, setHover] = useState(false)
    const [supportsHoverAndPointer, setSupportsHoverAndPointer] = useState(false)

    useEffect(() => {
        setSupportsHoverAndPointer(
            window.matchMedia('(hover: hover)').matches &&
            window.matchMedia('(pointer: fine)').matches
        )
    }, [])

    return (
        <IconButton
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                width: width,
                height: height,
                color: `${hover || !supportsHoverAndPointer
                    ? iconColorHover
                    : iconColor
                    } !important`,
                backgroundColor: `${hover || !supportsHoverAndPointer
                    ? backgroundColorHover
                    : backgroundColor
                    } !important`,
            }}
        >
            {icon}
        </IconButton>
    )
}