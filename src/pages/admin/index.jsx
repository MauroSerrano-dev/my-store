import styles from '@/styles/admin/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '@/utils/validations';
import { useAppContext } from '@/components/contexts/AppContext';
import { COMMON_TRANSLATES } from '@/consts';
import { convertTimestampToFormatDateSeconds } from '@/utils';
import { useTranslation } from 'next-i18next';

export default function Admin(props) {
    const {
        data,
    } = props

    const {
        auth,
        session,
    } = useAppContext()

    const { i18n } = useTranslation()

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingLeft: 'calc(var(--admin-menu-width-close) + 2rem)',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        <p>Products active: {data.prods_data.active}</p>
                        <p>Products disabled: {data.prods_data.disabled}</p>
                        <p>Currencies updated at: {convertTimestampToFormatDateSeconds(data.app_data.find(doc => doc.id === 'currencies').updated_at, i18n.language)}</p>
                        <p>Deleted users: {data.app_data.find(doc => doc.id === 'deleted_users').data.length}</p>
                        <p>Clear deleted users executed at: {convertTimestampToFormatDateSeconds(data.app_data.find(doc => doc.id === 'deleted_users').updated_at, i18n.language)}</p>
                    </main>
                </div>
    )
}
export async function getServerSideProps({ locale }) {

    const options = {
        method: 'GET',
        headers: {
            authorization: process.env.NEXT_PUBLIC_APP_TOKEN
        },
    }
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/dashboard`, options)
        .then(response => response.json())
        .then(response => response)
        .catch(err => console.error(err))

    return {
        props: {
            data: data,
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}