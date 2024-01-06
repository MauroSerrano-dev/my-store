import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export default function MyTooltip(props) {
    const {
        backgroundColor = '#000000',
        title = 'Tooltip',
        children,
        arrow = true,
        titleColor = '#ffffff',
        style
    } = props

    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow={arrow} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: backgroundColor,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: backgroundColor,
            color: titleColor,
        },
        ...style,
    }))

    return (
        <CustomTooltip title={title}>
            {children}
        </CustomTooltip>
    )
}