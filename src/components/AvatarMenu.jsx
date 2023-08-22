import * as React from 'react'
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
import Router from "next/router";
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Link from 'next/link'

export default function AvatarMenu(props) {
  const { signOut, session } = props

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }
  // Substituído onClick para link behave
  /* function handleChange(targetPage) {
    setAnchorEl(null)
    Router.push(`/${targetPage}`)
  } */

  const handleLogout = () => {
    setAnchorEl(null)
    signOut()
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Menu">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={session.user.image} alt="Avatar" sx={{ width: 50, height: 50 }}>{!session.user.image && session.user.name[0]}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.30))',
            mt: 1.1,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        sx={{ left: '-10px' }}
        disableScrollLock={true}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link legacyBehavior href={`/profile?id=${session.user.id}`}>
          <a>
            <MenuItem>
              <ListItemIcon>
                <AccountCircleRoundedIcon fontSize="medium" />
              </ListItemIcon>
              Perfil
            </MenuItem>
          </a>
        </Link>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ContactSupportIcon fontSize="medium" />
          </ListItemIcon>
          Meus Quizzes
        </MenuItem>
        <Divider />
        <Link legacyBehavior href={'/settings'}>
          <a>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="medium" />
              </ListItemIcon>
              Configurações
            </MenuItem>
          </a>
        </Link>
        <Link legacyBehavior href={'/support'}>
          <a>
            <MenuItem>
              <ListItemIcon>
                <SupportAgentIcon fontSize="medium" />
              </ListItemIcon>
              Suporte
            </MenuItem>
          </a>
        </Link>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}