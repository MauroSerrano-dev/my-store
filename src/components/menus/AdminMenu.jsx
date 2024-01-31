import styles from '@/styles/components/menus/AdminMenu.module.css'
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined'
import { IoShirt } from "react-icons/io5"
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import { useState } from 'react'

const OPTIONS = [
    { title: 'Dashboard', type: 'link', href: '/admin', icon: <EqualizerOutlinedIcon /> },
    { title: 'Products', type: 'link', href: '/admin/products', icon: <IoShirt size={20} /> },
    { title: 'Revenue', type: 'link', href: '/admin/revenue', icon: <PaymentsOutlinedIcon /> },
    { title: 'Sales', type: 'link', href: '/admin/sales', icon: <ShoppingBagOutlinedIcon /> },
    { title: 'Providers', type: 'link', href: '/admin/providers', icon: <LocalShippingOutlinedIcon /> },
    { title: 'Customers', type: 'link', href: '/admin/customers', icon: <GroupOutlinedIcon /> },
    { title: 'Admins', type: 'link', href: '/admin/admins', icon: <AdminPanelSettingsOutlinedIcon /> },
    { title: 'Tags', type: 'link', href: '/admin/tags', icon: <StyleOutlinedIcon /> },
    { title: 'Tickets', type: 'link', href: '/admin/tickets', icon: <ConfirmationNumberOutlinedIcon /> },
    { title: 'Quests', type: 'link', href: '/admin/quests', icon: <LiveHelpOutlinedIcon /> },
]

export default function AdminMenu(props) {
    const {
        open,
    } = props

    const {
        router,
    } = useAppContext()

    const [hover, setHover] = useState(false)

    return (
        <motion.div
            className={styles.container}
            initial='close'
            animate={(open || hover) ? 'open' : 'close'}
            variants={{
                open: {
                    width: 'var(--admin-menu-width-open)',
                },
                close: {
                    width: 'var(--admin-menu-width-close)',
                }
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={styles.options}>
                {OPTIONS.map((option, i) =>
                    <Link
                        className={`${styles.option} ${(router.pathname.split('/')[2] || router.pathname) === (option.href.split('/')[2] || option.href) ? styles.activeOption : ''} noUnderline`}
                        href={option.href}
                        key={i}
                    >
                        <p>
                            {option.icon}
                        </p>
                        <p
                            style={{
                                color: (open || hover) ? undefined : 'transparent',
                                transition: 'color ease-in-out 200ms'
                            }}
                        >
                            {option.title}
                        </p>
                    </Link>
                )}
            </div>
        </motion.div>
    )
}