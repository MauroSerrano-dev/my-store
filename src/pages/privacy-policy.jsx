import Footer from '@/components/Footer'
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
                        {process.env.NEXT_PUBLIC_STORE_NAME} Privacy Policy
                    </h1>
                    <div
                        className='flex column'
                        style={{
                            gap: '1rem'
                        }}
                    >
                        <div>
                            <h2 style={titleStyle}>
                                1. Introduction
                            </h2>
                            <p style={pStyle}>
                                Protecting your privacy is important to us, and we are committed to safeguarding your personal information. This Privacy Policy explains how we collect, use, and protect your data when you access and use our website. By using the website, you consent to the practices described in this policy.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                2. Information We Collect
                            </h2>
                            <p style={pStyle}>
                                We may collect personal information that you provide directly, such as your name, email address, and shipping address. We also automatically collect certain information when you use the website, including device type, operating system, and browser type.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                3. How We Use Your Information
                            </h2>
                            <p style={pStyle}>
                                We use the collected information for the following purposes:
                            </p>
                            <ul
                                className='flex column'
                                style={{
                                    gap: '0.4rem',
                                    paddingLeft: '2rem',
                                    paddingTop: '0.8rem',
                                }}
                            >
                                <li style={pStyle}>
                                    To process orders and provide customer support.
                                </li>
                                <li style={pStyle}>
                                    To improve our website's functionality, content, and user experience.
                                </li>
                                <li style={pStyle}>
                                    To communicate with you, including responding to your inquiries and sending information about your orders.
                                </li>
                                <li style={pStyle}>
                                    To personalize and enhance your experience on the website.
                                </li>
                                <li style={pStyle}>
                                    To protect the website, its users, and our business from potential fraud or security risks.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                4. Sharing Your Information
                            </h2>
                            <p style={pStyle}>
                                We do not sell your personal information to third parties. However, we may share your information with trusted third parties to provide specific services, such as payment processing, order fulfillment, and shipping. We may also share data for legal compliance, protection of rights, and safety.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                5. Cookies and Tracking Technologies
                            </h2>
                            <p style={pStyle}>
                                We use cookies and similar tracking technologies to improve user experience and website functionality. You may choose to set your browser to refuse cookies or notify you when cookies are being sent. However, this may impact certain features and services of the website.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                6. Data Security
                            </h2>
                            <p style={pStyle}>
                                We employ reasonable security measures to protect your personal information. However, no data transmission over the internet is completely secure. Therefore, while we strive to protect your data, we cannot guarantee its security.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                7. Your Choices
                            </h2>
                            <p style={pStyle}>
                                You can choose not to provide certain information. However, this may limit your ability to use certain features of the website. You may also opt out of certain communications from us, but operational communications (e.g., account-related notices) are necessary for the functioning of the website.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                8. Children's Privacy
                            </h2>
                            <p style={pStyle}>
                                Our website is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us to have it removed.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                9. Changes to This Privacy Policy
                            </h2>
                            <p style={pStyle}>
                                We may update our Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the website or sending you an email. Please review the policy periodically.
                            </p>
                        </div>
                        <div>
                            <h2 style={titleStyle}>
                                10. Contact Us
                            </h2>
                            <p style={pStyle}>
                                If you have any questions or concerns about this Privacy Policy, please contact us at <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</Link>.
                            </p>
                        </div>
                    </div>
                    <p style={finalPStyle}>
                        {process.env.NEXT_PUBLIC_STORE_NAME} respects your privacy and is committed to protecting your personal information. This policy is designed to provide transparency about our data practices. We encourage you to review it and contact us with any questions or concerns.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'footer']))
        }
    }
}