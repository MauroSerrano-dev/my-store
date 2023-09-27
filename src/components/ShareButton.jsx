import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Link from 'next/link'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import styles from '@/styles/components/ShareButton.module.css'
import { Button } from '@mui/material'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useRouter } from 'next/router'

export default function ShareButton(props) {
    const {
        wpp,
        supportsHoverAndPointer,
        style
    } = props
    const router = useRouter()

    const [open, setOpen] = useState(false)

    function handleLogout() {
        setOpen(false)
    }

    return (
        <div
            className={styles.container}
            style={style}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <PersonOutlineOutlinedIcon
                style={{
                    fontSize: 'calc(var(--bar-height) * 0.43)',
                    color: 'var(--global-black)'
                }}
            />
            {
                open &&
                <div
                    className={styles.contentContainer}
                    style={{
                        left: '-98.5px'
                    }}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div
                        className={styles.session}
                    >
                        <a
                            href={wpp}
                            className='noUnderline'
                            onClick={() => setOpen(false)}
                            target='_blank'
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <AccountCircleRoundedIcon fontSize="medium" />
                                </ListItemIcon>
                                WhatsApp
                            </MenuItem>
                        </a>
                        <MenuItem>
                            <ListItemIcon>
                                <SupportAgentIcon fontSize="medium" />
                            </ListItemIcon>
                            Copy Link
                        </MenuItem>
                    </div>
                </div>
            }
        </div >
    )
}