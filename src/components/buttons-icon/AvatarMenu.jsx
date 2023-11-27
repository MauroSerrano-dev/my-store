import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import Logout from '@mui/icons-material/Logout'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import styles from '@/styles/components/buttons-icon/AvatarMenu.module.css'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { isAdmin } from '@/utils/validations'

export default function AvatarMenu(props) {
  const {
    logout,
    session,
    router,
    supportsHoverAndPointer,
    auth
  } = props

  const [open, setOpen] = useState(false)
  const { i18n } = useTranslation()
  const tNavbar = useTranslation('navbar').t

  function handleLogout() {
    logout()
    setOpen(false)
  }

  function handleMouseEnter() {
    if (supportsHoverAndPointer) {
      setOpen(true)
    }
  }

  function handleMouseLeave() {
    setOpen(false)
  }

  function handleOnClick() {
    if (!supportsHoverAndPointer) {
      setOpen(prev => !prev)
    }
  }

  useEffect(() => {
    setOpen(false)
  }, [router])

  useEffect(() => {
    function handleCloseMenuOnScroll() {
      setOpen(false)
    }

    if (!supportsHoverAndPointer) {
      window.addEventListener('scroll', handleCloseMenuOnScroll);
    }

    return () => {
      if (!supportsHoverAndPointer) {
        window.removeEventListener('scroll', handleCloseMenuOnScroll);
      }
    }
  }, [supportsHoverAndPointer])

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
      style={{
        backgroundColor: open ? 'rgba(0, 0, 0, 0.15)' : 'transparent'
      }}
    >
      {supportsHoverAndPointer
        ? <Link
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
      {open && session !== undefined &&
        <motion.div
          className={styles.contentContainer}
          style={{
            left: !session
              ? -223.5
              : ['pt-BR', 'pt-PT'].includes(i18n.language)
                ? -135.5
                : -118.5
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
          {session
            ? <div
              className={styles.session}
              style={{
                minWidth: ['pt-BR', 'pt-PT'].includes(i18n.language) ? 182 : 165,
              }}
            >
              <Link
                href={'/profile'}
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <AccountCircleRoundedIcon fontSize="medium" />
                  </ListItemIcon>
                  {tNavbar('Profile')}
                </MenuItem>
              </Link>
              <Divider />
              <Link
                href={'/orders'}
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <ShoppingBagOutlinedIcon fontSize="medium" />
                  </ListItemIcon>
                  {tNavbar('My Orders')}
                </MenuItem>
              </Link>
              <Link
                href={'/support'}
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <SupportAgentIcon fontSize="medium" />
                  </ListItemIcon>
                  {tNavbar('Support')}
                </MenuItem>
              </Link>
              {isAdmin(auth) &&
                <Link
                  href={'/admin'}
                  className='noUnderline'
                >
                  <MenuItem>
                    <ListItemIcon>
                      <AdminPanelSettingsRoundedIcon fontSize="medium" />
                    </ListItemIcon>
                    {tNavbar('Admin')}
                  </MenuItem>
                </Link>
              }
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="medium" />
                </ListItemIcon>
                {tNavbar('Logout')}
              </MenuItem>
            </div>
            : <div className={styles.noSession}>
              <Link
                href={'/login'}
                className='noUnderline fillWidth'
              >
                <Button
                  variant='outlined'
                  sx={{
                    width: '100%',
                    height: '38px',
                    fontWeight: '700',
                    zIndex: 10,
                  }}
                >
                  {tNavbar('LOG_IN')}
                </Button>
              </Link>
              <Link
                href={'/signin'}
                className='noUnderline fillWidth'
              >
                <Button
                  variant='contained'
                  sx={{
                    width: '100%',
                    height: '38px',
                    fontWeight: '700',
                    zIndex: 10,
                  }}
                >
                  {tNavbar('SIGN_UP')}
                </Button>
              </Link>
            </div>
          }
        </motion.div>
      }
    </div>
  )
}