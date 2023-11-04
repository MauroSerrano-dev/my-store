import Image from 'next/image'
import styles from '../styles/components/Footer.module.css'
import { BsShieldLockFill } from "react-icons/bs";
import Link from 'next/link';
import SocialButtons from './SocialButtons';

export default function Footer() {

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
                            Support
                        </h3>
                        <div>
                            <a>
                                Check order status
                            </a>
                        </div>
                        <div>
                            <a>
                                Help/FAQ
                            </a>
                        </div>
                        <div>
                            <a>
                                Contact us
                            </a>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <h3 className="text-start">About us</h3>
                        <div>
                            <Link href='/privacy-policy'>
                                Privacy policy
                            </Link>
                        </div>
                        <div>
                            <Link href='/terms-of-use'>
                                Terms of use
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
                                Guaranteed <b>safe & secure</b> checkout
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
                    Copyright © {new Date().getFullYear()}, {process.env.NEXT_PUBLIC_STORE_NAME}. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
