import Image from 'next/image'
import styles from '@/styles/components/Footer.module.css'
import { BsShieldLockFill } from "react-icons/bs";
import Link from 'next/link';
import SocialButtons from './SocialButtons';
import { useTranslation } from 'next-i18next'
import LanguageSelectorText from './buttons-icon/LanguageSelectorText';

export default function Footer() {

    const tFooter = useTranslation('footer').t

    const PAYMENTS_METHODS = [
        { alt: 'visa', img: '/payments/visa.webp' },
        { alt: 'mastercard', img: '/payments/mastercard.webp' },
        { alt: 'amex', img: '/payments/amex.webp' },
        { alt: 'jcb', img: '/payments/jcb.webp' },
        { alt: 'discover', img: '/payments/discover.webp' },
        { alt: 'diners-club', img: '/payments/diners-club.webp' },
        { alt: 'union-pay', img: '/payments/union-pay.webp' },
    ]

    return (
        <footer
            className={styles.container}
        >
            <div className={styles.top}>
                <LanguageSelectorText />
                <SocialButtons />
            </div>
            <div className={styles.middle}>
                <div className={styles.middleLeft}>
                    <div className={styles.column}>
                        <h3>
                            {tFooter('Support')}
                        </h3>
                        <div>
                            <Link href='/support'>
                                {tFooter('help')}
                            </Link>
                        </div>
                        <div>
                            <Link href='/contact'>
                                {tFooter('Contact us')}
                            </Link>
                        </div>
                        <div>
                            <Link href='/order-status'>
                                {tFooter('Check order status')}
                            </Link>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <h3 className="text-start">{tFooter('About us')}</h3>
                        <div>
                            <Link href='/privacy-policy'>
                                {tFooter('Privacy policy')}
                            </Link>
                        </div>
                        <div>
                            <Link href='/terms-of-use'>
                                {tFooter('Terms of use')}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.middleRight}>
                    <div
                        className={styles.stripeContainer}
                    >
                        <div className='flex row center' style={{ gap: '0.5rem' }}>
                            <BsShieldLockFill
                                size={20}
                            />
                            <p
                                style={{
                                    textAlign: 'start',
                                    fontSize: 14
                                }}
                            >
                                {tFooter('guaranteed_start')}<b>{tFooter('guaranteed_middle')}</b>{tFooter('guaranteed_end')}
                            </p>
                        </div>
                        <Link
                            href='https://stripe.com'
                            target='_blank'
                            className='noUnderline'
                            style={{
                                position: 'relative',
                                width: 120,
                                height: 33,
                            }}
                        >
                            <img
                                src='/payments/stripe.webp'
                                alt='stripe'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Link>
                    </div>
                    <div
                        className='flex row center'
                        style={{
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                    >
                        {PAYMENTS_METHODS.map((method, i) =>
                            <div
                                key={i}
                                className={styles.paymentMethod}
                            >
                                <img
                                    src={method.img}
                                    alt={method.alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>
                    {tFooter('copyright', { year: new Date().getFullYear(), store_name: process.env.NEXT_PUBLIC_STORE_NAME })}
                </p>
            </div>
        </footer >
    )
}
