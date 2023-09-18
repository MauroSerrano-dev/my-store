import styles from '@/styles/admin.module.css'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Link from 'next/link'

export default function Admin() {

    return (
        <div className={styles.container}>
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
                                legacyBehavior
                                href='/admin/new-product'
                            >
                                <a
                                    className='noUnderline fillWidth'
                                >
                                    <button
                                        className={styles.buttonOption}
                                    >
                                        <AddCircleOutlineRoundedIcon />
                                        Add New Product
                                    </button>
                                </a>
                            </Link>
                        </div>
                        <div>
                            <Link
                                legacyBehavior
                                href='/admin/edit-product'
                            >
                                <a
                                    className='noUnderline fillWidth'
                                >
                                    <button
                                        className={styles.buttonOption}
                                    >
                                        <EditNoteRoundedIcon />
                                        Edit Product
                                    </button>
                                </a>
                            </Link>
                        </div>
                        <div>
                            <Link
                                legacyBehavior
                                href='/admin/consult-product'
                            >
                                <a
                                    className='noUnderline fillWidth'
                                >
                                    <button
                                        className={styles.buttonOption}
                                    >
                                        <FormatListBulletedRoundedIcon />
                                        Consult Product
                                    </button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}