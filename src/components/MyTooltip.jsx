import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export default function MyTooltip(props) {
    const { backgroundColor, title, content, arrow, titleColor } = props

    const MyTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow={arrow} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: backgroundColor,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: backgroundColor,
            color: titleColor,
        },
    }))

    return (
        <MyTooltip title={title}>
            {content}
        </MyTooltip>
    )
}