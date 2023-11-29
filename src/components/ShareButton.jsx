import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import styles from '@/styles/components/ShareButton.module.css'
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import { BsWhatsapp } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { ImFacebook2 } from "react-icons/im";
import { useAppContext } from './contexts/AppContext';

export default function ShareButton(props) {
    const {
        link,
        wppMsg,
        style,
    } = props

    const {
        mobile,
        supportsHoverAndPointer,
    } = useAppContext()

    const link_replace = link.replaceAll('+', '%2B').replaceAll('&', '%26')

    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    function handleCopy() {
        console.log(link)
        navigator.clipboard.writeText(link)
        setCopied(true)
    }

    function closeModal() {
        setOpen(false)
        setCopied(false)
    }

    function openModal() {
        setOpen(true)
    }

    function openFacebookWindow() {
        const width = 600;
        const height = 400;

        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${link_replace}`, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
        closeModal();
    }

    function handleMouseEnter() {
        if (supportsHoverAndPointer) {
            openModal()
        }
    }

    function handleMouseLeave() {
        closeModal()
    }

    function handleOnClick() {
        if (!supportsHoverAndPointer) {
            if (open)
                closeModal()
            else
                openModal()
        }
    }

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
                ...style,
                backgroundColor: open ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)'
            }}
        >
            <div className={styles.iconContainer}>
                <IosShareRoundedIcon
                    style={{
                        color: 'var(--global-black)'
                    }}
                />
            </div>
            {
                open &&
                <div
                    className={styles.contentContainer}
                >
                    <div className={styles.pointer}>
                    </div>
                    <div
                        className={styles.session}
                    >
                        <a
                            href={`https://${mobile ? 'api' : 'web'}.whatsapp.com/send?text=${wppMsg}: ${link_replace}`}
                            className='noUnderline'
                            onClick={closeModal}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <BsWhatsapp size={23} />
                                </ListItemIcon>
                                WhatsApp
                            </MenuItem>
                        </a>
                        <a
                            className='noUnderline'
                            onClick={openFacebookWindow}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <ImFacebook2 size={23} />
                                </ListItemIcon>
                                Facebook
                            </MenuItem>
                        </a>
                        <MenuItem onClick={handleCopy}>
                            <ListItemIcon>
                                <MdOutlineContentCopy size={23} />
                            </ListItemIcon>
                            {copied ? 'Link Copied!' : 'Copy Link'}
                        </MenuItem>
                    </div>
                </div>
            }
        </div >
    )
}