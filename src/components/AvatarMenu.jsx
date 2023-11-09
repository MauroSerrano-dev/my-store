import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Logout from '@mui/icons-material/Logout'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Link from 'next/link'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import styles from '@/styles/components/AvatarMenu.module.css'
import { Button } from '@mui/material'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

export default function AvatarMenu(props) {
  const {
    logout,
    session,
    supportsHoverAndPointer
  } = props

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
        ? <Link
          onClick={() => console.log('clicou')}
          href={session ? '/profile' : '/login'}
          className={`${styles.iconContainer} flex center noUnderline`}
        >
          <PersonOutlineOutlinedIcon
            style={{
              fontSize: 'calc(var(--bar-height) * 0.43)',
              color: 'var(--global-white)'
            }}
          />
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
        open && session !== undefined &&
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
              <Link
                href={'/profile'}
                className='noUnderline'
                onClick={() => setOpen(false)}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AccountCircleRoundedIcon fontSize="medium" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              </Link>
              <Divider />
              <Link
                href={'/orders'}
                className='noUnderline'
                onClick={() => setOpen(false)}
              >
                <MenuItem>
                  <ListItemIcon>
                    <ReceiptLongRoundedIcon fontSize="medium" />
                  </ListItemIcon>
                  My Orders
                </MenuItem>
              </Link>
              <Link
                href={'/support'}
                className='noUnderline'
                onClick={() => setOpen(false)}
              >
                <MenuItem>
                  <ListItemIcon>
                    <SupportAgentIcon fontSize="medium" />
                  </ListItemIcon>
                  Support
                </MenuItem>
              </Link>
              {process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS.includes(session.email) &&
                <Link
                  href={'/admin'}
                  className='noUnderline'
                  onClick={() => setOpen(false)}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <AdminPanelSettingsRoundedIcon fontSize="medium" />
                    </ListItemIcon>
                    Admin
                  </MenuItem>
                </Link>
              }
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="medium" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </div>
            : <div className={styles.noSession}>
              <Link
                href={'/login'}
                onClick={() => setOpen(false)}
                className='noUnderline fillWidth'
              >
                <Button
                  variant='contained'
                  sx={{
                    width: '100%',
                    height: '38px',
                    color: '#ffffff',
                    fontWeight: '700',
                    zIndex: 10,
                  }}
                >
                  Log In
                </Button>
              </Link>
              <p>
                Don't have an account yet? <Link onClick={() => setOpen(false)} className='noUnderline' href={'/signin'}>Sign up</Link>
              </p>
            </div>
          }
        </div>
      }
    </div>
  )
}