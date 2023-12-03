import Footer from '@/components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next';
import styles from '@/styles/pages/privacy-policy.module.css'

export default function TermsOfUse() {

    const tPrivacyPolicy = useTranslation('privacy-policy').t

    return (
        <div className='flex center column fillWidth'>
            <Head>
            </Head>
            <main
                className={styles.main}
            >
                <h1 className={styles.title}>
                    {process.env.NEXT_PUBLIC_STORE_NAME} {tPrivacyPolicy('title0')}
                </h1>
                <div
                    className='flex column'
                    style={{
                        gap: '1rem'
                    }}
                >
                    <div>
                        <h2 className={styles.titles}>
                            1. {tPrivacyPolicy('title1')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph1')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            2. {tPrivacyPolicy('title2')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph1')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            3. {tPrivacyPolicy('title3')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph3.0')}
                        </p>
                        <ul
                            className='flex column'
                            style={{
                                gap: '0.4rem',
                                paddingLeft: '2rem',
                                paddingTop: '0.8rem',
                            }}
                        >
                            <li className={styles.pStyle}>
                                {tPrivacyPolicy('paragraph3.1')}
                            </li>
                            <li className={styles.pStyle}>
                                {tPrivacyPolicy('paragraph3.2')}
                            </li>
                            <li className={styles.pStyle}>
                                {tPrivacyPolicy('paragraph3.3')}
                            </li>
                            <li className={styles.pStyle}>
                                {tPrivacyPolicy('paragraph3.4')}
                            </li>
                            <li className={styles.pStyle}>
                                {tPrivacyPolicy('paragraph3.5')}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            4. {tPrivacyPolicy('title4')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph4')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            5. {tPrivacyPolicy('title5')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph5')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            6. {tPrivacyPolicy('title6')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph6')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            7. {tPrivacyPolicy('title7')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph7')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            8. {tPrivacyPolicy('title8')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph8')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            9. {tPrivacyPolicy('title9')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph9')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            10. {tPrivacyPolicy('title10')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tPrivacyPolicy('paragraph10')} <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>.
                        </p>
                    </div>
                </div>
                <p className={styles.finalPStyle}>
                    {tPrivacyPolicy('paragraph11', { store_name: process.env.NEXT_PUBLIC_STORE_NAME })}
                </p>
            </main >
            <Footer />
        </div >
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'footer', 'privacy-policy', 'toasts']))
        }
    }
}