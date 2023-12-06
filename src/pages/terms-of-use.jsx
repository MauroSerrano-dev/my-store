import Footer from '@/components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next';
import styles from '@/styles/pages/terms-of-use.module.css'
import { COMMON_TRANSLATES } from '@/consts';

export default function TermsOfUse() {

    const tTermsOfUse = useTranslation('terms-of-use').t

    return (
        <div className='flex center column fillWidth'>
            <Head>
            </Head>
            <main
                className={styles.main}
            >
                <h1 className={styles.title}>
                    {process.env.NEXT_PUBLIC_STORE_NAME} {tTermsOfUse('title0')}
                </h1>
                <div
                    className='flex column'
                    style={{
                        gap: '1rem'
                    }}
                >
                    <div>
                        <h2 className={styles.titles}>
                            1. {tTermsOfUse('title1')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph1')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            2. {tTermsOfUse('title2')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph2')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            3. {tTermsOfUse('title3')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph3')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            4. {tTermsOfUse('title4')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph4')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            5. {tTermsOfUse('title5')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph5')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            6. {tTermsOfUse('title6')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph6')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            7. {tTermsOfUse('title7')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph7')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            8. {tTermsOfUse('title8')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph8')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            9. {tTermsOfUse('title9')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph9')}
                        </p>
                    </div>
                    <div>
                        <h2 className={styles.titles}>
                            10. {tTermsOfUse('title10')}
                        </h2>
                        <p className={styles.pStyle}>
                            {tTermsOfUse('paragraph10')} <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>.
                        </p>
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
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer', 'terms-of-use'])))
        }
    }
}