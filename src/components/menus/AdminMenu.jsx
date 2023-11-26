import styles from '@/styles/components/menus/AdminMenu.module.css'
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined'
import { IoShirt } from "react-icons/io5"
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined'

const OPTIONS = [
    { title: 'Dashboard', type: 'link', href: '/admin', icon: <EqualizerOutlinedIcon /> },
    { title: 'Products', type: 'link', href: '/admin/products', icon: <IoShirt size={20} /> },
    { title: 'Revenue', type: 'link', href: '/admin/revenue', icon: <PaymentsOutlinedIcon /> },
    { title: 'Promotions', type: 'link', href: '/admin/promotions', icon: <SellOutlinedIcon /> },
    { title: 'Sales', type: 'link', href: '/admin/sales', icon: <ShoppingBagOutlinedIcon /> },
    { title: 'Providers', type: 'link', href: '/admin/providers', icon: <LocalShippingOutlinedIcon /> },
    { title: 'Customers', type: 'link', href: '/admin/customers', icon: <GroupOutlinedIcon /> },
    { title: 'Admins', type: 'link', href: '/admin/admins', icon: <AdminPanelSettingsOutlinedIcon /> },
    { title: 'Tags', type: 'link', href: '/admin/tags', icon: <StyleOutlinedIcon /> },
    { title: 'Tickets', type: 'link', href: '/admin/tickets', icon: <ConfirmationNumberOutlinedIcon /> },
    { title: 'Visual Identity', type: 'link', href: '/admin/visual-identity', icon: <ColorLensOutlinedIcon /> },
    { title: 'Global Report', type: 'link', href: '/admin/global-report', icon: <ReportProblemOutlinedIcon /> },
]

export default function AdminMenu(props) {
    const {
        router,
        open,
        setOpen
    } = props

    return (
        <motion.div
            className={styles.container}
            initial='close'
            animate={open ? 'open' : 'close'}
            variants={{
                open: {
                    transform: 'translateX(0%)'
                },
                close: {
                    transform: 'translateX(-100%)'
                }
            }}
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
                        <p>
                            {option.title}
                        </p>
                    </Link>
                )}
            </div>
            <button
                className={styles.buttonOpenClose}
                onClick={() => setOpen(prev => !prev)}
            >
                <ArrowForwardIosOutlinedIcon
                    sx={{
                        fontSize: 14,
                        transform: open ? 'rotateZ(-180deg)' : 'none',
                        transition: 'transform ease-in-out 200ms 200ms',
                    }}
                />
            </button>
        </motion.div>
    )
}