import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Contact() {

    return (
        <div>
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}