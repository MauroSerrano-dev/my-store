import styles from '@/styles/admin/index.module.css'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Link from 'next/link'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Admin(props) {
    const {
        session
    } = props

    return (
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
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
                                        href='/admin/new-product'
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
                                        href='/admin/edit-product'
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