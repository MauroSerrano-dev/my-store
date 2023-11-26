import Image from 'next/image'
import styles from '@/styles/components/Footer.module.css'
import { BsShieldLockFill } from "react-icons/bs";
import Link from 'next/link';
import SocialButtons from './SocialButtons';
import { useTranslation } from 'next-i18next'

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
                <div className={styles.left}>
                    <div className={styles.column}>
                        <h3>
                            {tFooter('Support')}
                        </h3>
                        <div>
                            <a>
                                {tFooter('Check order status')}
                            </a>
                        </div>
                        <div>
                            <a>
                                {tFooter('Help/FAQ')}
                            </a>
                        </div>
                        <div>
                            <a>
                                {tFooter('Contact us')}
                            </a>
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
                <div className={styles.right}>
                    <SocialButtons />
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
                            <Image
                                src='/payments/stripe.webp'
                                fill
                                quality={100}
                                alt='stripe'
                                sizes='100%'
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
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
                                <Image
                                    src={method.img}
                                    fill
                                    quality={100}
                                    alt={method.alt}
                                    sizes='100%'
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
        </footer>
    )
}
