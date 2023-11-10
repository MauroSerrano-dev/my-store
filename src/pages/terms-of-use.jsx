import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'

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

const finalPStyle = {
    textAlign: 'justify',
    fontWeight: 400,
    fontSize: 13,
}

export default function TermsOfUse() {

    return (
        <div className='flex center'>
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
                        {process.env.NEXT_PUBLIC_STORE_NAME} Terms of Use
                    </h1>
                    <div
                        className='flex column'
                        style={{
                            gap: '1rem'
                        }}
                    >
                        <div>
                            <h2 style={titleStyle}>
                                1. Acceptance of Terms of Use
                            </h2>
                            <p style={pStyle}>
                                By accessing and using this app, you agree to comply with and be bound by the following Terms of Use. If you do not agree to these terms, you should not use the app.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                2. Use of the App
                            </h2>
                            <p style={pStyle}>
                                You agree to use the app only for lawful purposes and in accordance with all applicable laws and regulations, including laws specific to your country or region. You must not use the app in any way that could impair, disable, overburden, or damage the app's operation or interfere with the use and enjoyment of other users.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                3. Changes to the Terms of Use
                            </h2>
                            <p style={pStyle}>
                                We reserve the right to modify or update these Terms of Use at any time, with or without notice. We recommend that you periodically check the terms to stay informed about any changes. Your continued use of the app after the posting of changes constitutes your acceptance of those changes.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                4. Privacy
                            </h2>
                            <p style={pStyle}>
                                The collection and use of your personal information are subject to our Privacy Policy, which is incorporated into these Terms of Use by reference. You agree to provide accurate, complete, and up-to-date information.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                5. User Content
                            </h2>
                            <p style={pStyle}>
                                You are solely responsible for any content you submit, display, or transmit through the app. You agree that your content will not infringe on third-party rights, including copyrights, trademarks, privacy, or other personal rights.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                6. Intellectual Property
                            </h2>
                            <p style={pStyle}>
                                This app and its content (excluding user content) are protected by copyright, trademarks, and other intellectual property laws. You agree to respect all copyrights and other proprietary rights in the content.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                7. Limitations of Liability
                            </h2>
                            <p style={pStyle}>
                                The use of this app is at your own risk. The app is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the app will be error-free or uninterrupted.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                8. International Users
                            </h2>
                            <p style={pStyle}>
                                This app is accessible worldwide, and we welcome users from around the globe. However, users from different countries and regions must comply with their local laws and regulations when using the app. We make no claims that the app or its content is appropriate or available in all locations. Accessing the app from territories where its content is illegal is prohibited.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                9. Applicable Law
                            </h2>
                            <p style={pStyle}>
                                These Terms of Use are governed by the laws of [Your Home Country or a Neutral Jurisdiction], without regard to conflict of law principles. If there are disputes, they should be resolved through arbitration or other dispute resolution mechanisms, as specified in your terms.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                10. Contact Us
                            </h2>
                            <p style={pStyle}>
                                If you have any questions or concerns about these Terms of Use, please contact us at <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar']))
        }
    }
}