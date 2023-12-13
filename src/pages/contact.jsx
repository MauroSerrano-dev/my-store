import styles from '@/styles/pages/contact.module.css'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { COMMON_TRANSLATES } from '@/consts'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SocialButtons from '@/components/SocialButtons'

export default function Contact() {
    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div
                    className={styles.left}
                >
                    <div
                        className={styles.leftTitle}
                    >
                        <h2>Contact us</h2>
                    </div>
                    <p>
                        Email: <Link className={styles.email} href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>
                    </p>
                    <div className={styles.socials}>
                        <h3>Socials</h3>
                        <SocialButtons />
                    </div>
                </div>
                <div
                    className={styles.right}
                >
                    <div
                        className={styles.imgRight}
                    >
                        <Image
                            src='/contact_banner.webp'
                            alt='contact banner'
                            priority
                            quality={100}
                            fill
                            sizes='100%'
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                            }}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer'])))
        }
    }
}