import Footer from '@/components/Footer'
import { COMMON_TRANSLATES } from '@/consts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

export default function Support() {

    return (
        <div className='flex center column'>
            <Head>
            </Head>
            <main>

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