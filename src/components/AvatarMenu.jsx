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
import styles from '@/styles/components/AvatarMenu.module.css'
import { Button } from '@mui/material'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

export default function AvatarMenu(props) {
  const { logout, session, supportsHoverAndPointer } = props

  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    setOpen(false)
  }

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {supportsHoverAndPointer
        ? <Link legacyBehavior href={'/login'}>
          <a
            className={`${styles.iconContainer} flex center noUnderline`}
            aria-label='Login'
          >
            <PersonOutlineOutlinedIcon
              style={{
                fontSize: 'calc(var(--bar-height) * 0.43)',
                color: 'var(--global-white)'
              }}
            />
          </a>
        </Link>
        : <div
          className={`${styles.iconContainer} flex center`}
        >
          <PersonOutlineOutlinedIcon
            style={{
              fontSize: 'calc(var(--bar-height) * 0.43)',
              color: 'var(--global-white)'
            }}
          />
        </div>
      }

      {
        open &&
        <div
          className={styles.contentContainer}
          style={{
            left: session
              ? '-98.5px'
              : '-203.5px'
          }}
        >
          <div className={styles.pointer}>
          </div>
          {session
            ? <div
              className={styles.session}
            >
              <Link legacyBehavior href={`/profile/${session?.id}`}>
                <a
                  className='noUnderline'
                  onClick={() => setOpen(false)}
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
              <Link legacyBehavior href={'/orders'}>
                <a
                  className='noUnderline'
                  onClick={() => setOpen(false)}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <ReceiptLongRoundedIcon fontSize="medium" />
                    </ListItemIcon>
                    My Orders
                  </MenuItem>
                </a>
              </Link>
              <Link legacyBehavior href={'/settings'}>
                <a
                  className='noUnderline'
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
            : <div className={styles.noSession}>
              <Link legacyBehavior href={'/login'}><a onClick={() => setOpen(false)} className='noUnderline fillWidth'>
                <Button
                  variant='contained'
                  sx={{
                    width: '100%',
                    height: '38px',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    zIndex: 10,
                  }}
                >
                  Log In
                </Button>
              </a>
              </Link>
              <p>
                Don't have an account yet? <Link legacyBehavior href={'/signin'}><a onClick={() => setOpen(false)} className='noUnderline'>Sign up</a></Link>
              </p>
            </div>
          }
        </div>
      }
    </div >
  )
}