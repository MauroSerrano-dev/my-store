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
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { isAdmin } from '@/utils/validations'
import { useAppContext } from '../contexts/AppContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import GoogleButton from '../buttons/GoogleButton'
import MyButton from '@/components/material-ui/MyButton'

export default function AvatarMenu() {
  const {
    auth,
    router,
    supportsHoverAndPointer,
    logout,
    isUser
  } = useAppContext()

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
          href={isUser ? '/profile' : '/login'}
          className={`${styles.iconContainer} flex center noUnderline`}
        >
          {isUser
            ? <PersonOutlineOutlinedIcon
              style={{
                fontSize: 'calc(var(--navbar-height) * 0.43)',
                color: 'var(--global-white)'
              }}
            />
            : <LoginOutlinedIcon
              style={{
                fontSize: 'calc(var(--navbar-height) * 0.35)',
                color: 'var(--global-white)',
                transform: 'translateX(-3px)'
              }}
            />
          }
        </Link>
        : <div
          className={`${styles.iconContainer} flex center`}
        >
          {isUser
            ? <PersonOutlineOutlinedIcon
              style={{
                fontSize: 'calc(var(--navbar-height) * 0.43)',
                color: 'var(--global-white)'
              }}
            />
            : <LoginOutlinedIcon
              style={{
                fontSize: 'calc(var(--navbar-height) * 0.35)',
                color: 'var(--global-white)',
                transform: 'translateX(-3px)'
              }}
            />
          }
        </div>
      }
      {open && isUser !== undefined &&
        <motion.div
          className={styles.contentContainer}
          style={{
            left: !isUser
              ? -283.5
              : i18n.language === 'es'
                ? -147
                : i18n.language === 'pt-BR'
                  ? -150.5
                  : i18n.language === 'pt'
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
          {isUser
            ? <div
              className={styles.session}
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
                href={'/wishlist'}
                className='noUnderline'
              >
                <MenuItem>
                  <ListItemIcon>
                    <FavoriteBorderRoundedIcon fontSize="medium" />
                  </ListItemIcon>
                  {tNavbar('Wishlist')}
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
              <GoogleButton
                className='buttonShadow'
                text={tNavbar('google_button')}
                style={{
                  height: 38,
                  zIndex: 10,
                  boxShadow: 0
                }}
              />
              <Link
                href={'/login'}
                className='noUnderline fillWidth'
              >
                <MyButton
                  className='buttonShadow'
                  variant='outlined'
                  style={{
                    width: '100%',
                    height: 38,
                    fontWeight: '700',
                    zIndex: 10,
                  }}
                >
                  {tNavbar('log_in')}
                </MyButton>
              </Link>
              <Link
                href={'/signin'}
                className='noUnderline fillWidth'
              >
                <MyButton
                  style={{
                    width: '100%',
                    height: 38,
                    fontWeight: '700',
                    zIndex: 10,
                  }}
                >
                  {tNavbar('sign_up')}
                </MyButton>
              </Link>
            </div>
          }
        </motion.div>
      }
    </div >
  )
}