import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { withRouter } from 'next/router'

export default withRouter(() => {

    return (
        <div>
        </div>
    )
})

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}