import Footer from '@/components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next';

const titleStyle = {
    textAlign: 'justify',
    fontWeight: 700,
    fontSize: 22,
}

const pStyle = {
    textAlign: 'justify',
    fontWeight: 400,
    fontSize: 16,
}

export default function TermsOfUse() {

    const tTermsOfUse = useTranslation('terms-of-use').t

    return (
        <div className='flex center column'>
            <Head>
            </Head>
            <main
                style={{
                    width: '80%'
                }}
            >
                <div
                    className='flex column'
                    style={{
                        '--text-color': 'var(--text-white)',
                        gap: '2rem',
                        padding: '2rem 0rem',
                    }}
                >
                    <h1>
                        {process.env.NEXT_PUBLIC_STORE_NAME} {tTermsOfUse('title0')}
                    </h1>
                    <div
                        className='flex column'
                        style={{
                            gap: '1rem'
                        }}
                    >
                        <div>
                            <h2 style={titleStyle}>
                                1. {tTermsOfUse('title1')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph1')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                2. {tTermsOfUse('title2')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph2')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                3. {tTermsOfUse('title3')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph3')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                4. {tTermsOfUse('title4')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph4')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                5. {tTermsOfUse('title5')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph5')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                6. {tTermsOfUse('title6')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph6')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                7. {tTermsOfUse('title7')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph7')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                8. {tTermsOfUse('title8')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph8')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                9. {tTermsOfUse('title9')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph9')}
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                10. {tTermsOfUse('title10')}
                            </h2>
                            <p style={pStyle}>
                                {tTermsOfUse('paragraph10')} <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>.
                            </p>
                        </div>
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
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'footer', 'terms-of-use']))
        }
    }
}