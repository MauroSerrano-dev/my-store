import React from "react"
import Link from 'next/link'
import styles from '@/styles/components/NavItem.module.css'

const NavItem = ({ href, text, active }) => {
    return (
        <Link
            href={href}
            id={styles.nav_link}
        >
            {text}
        </Link>
    )
}

export default NavItem