import styles from '@/styles/admin/products/index.module.css'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Link from 'next/link'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isAdmin } from '../../../../utils/validations';

export default function Products(props) {
    const {
        session,
        auth,
        router,
        loading
    } = props

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin(auth)
                ? <NoFound404
                    autoRedirect
                    router={router}
                    loading={loading}
                />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.block}>
                            <div className={styles.blockTitle}>
                                <h2>Manage Product</h2>
                            </div>
                            <div className={styles.optionsBlock}>
                                <div>
                                    <Link
                                        href='/admin/products/new'
                                        className='noUnderline fillWidth'
                                    >
                                        <button
                                            className={styles.buttonOption}
                                        >
                                            <AddCircleOutlineRoundedIcon />
                                            Add New Product
                                        </button>
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        href='/admin/products/edit'
                                        className='noUnderline fillWidth'
                                    >
                                        <button
                                            className={styles.buttonOption}
                                        >
                                            <EditNoteRoundedIcon />
                                            Edit Product
                                        </button>
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        href='/admin/consult-product'
                                        className='noUnderline fillWidth'
                                    >
                                        <button
                                            className={styles.buttonOption}
                                        >
                                            <FormatListBulletedRoundedIcon />
                                            Consult Product
                                        </button>
                                    </Link>
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
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'toasts']))
        }
    }
}