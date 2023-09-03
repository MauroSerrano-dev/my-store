import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Link from 'next/link'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import styles from '@/styles/components/AvatarMenu.module.css'

export default function AvatarMenu(props) {
  const { signOut, session } = props

  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    signOut()
  }

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <PersonOutlineOutlinedIcon
        style={{
          fontSize: 'calc(var(--bar-height) * 0.43)',
          color: 'var(--global-white)'
        }}
      />
      {open &&
        <div className={styles.optionsContainerInvisible}>
          <div className={styles.pointer}>
          </div>
          <div
            className={styles.optionsContainer}
          >
            <Link legacyBehavior href={`/profile?id=${session?.user.id}`}>
              <a
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <AccountCircleRoundedIcon fontSize="medium" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              </a>
            </Link>
            <Divider />
            <Link legacyBehavior href={'/settings'}>
              <a
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize="medium" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
              </a>
            </Link>
            <Link legacyBehavior href={'/support'}>
              <a
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <SupportAgentIcon fontSize="medium" />
                  </ListItemIcon>
                  Support
                </MenuItem>
              </a>
            </Link>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="medium" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </div>
        </div>
      }
    </div>
  )
}