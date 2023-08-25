import styles from '@/styles/admin.module.css'
import Link from 'next/link'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';

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
                        <Link legacyBehavior href={'/admin/new-product'}>
                            <a className={styles.linkOption}>
                                <AddCircleOutlineRoundedIcon />
                                Add New Product
                            </a>
                        </Link>
                        <Link legacyBehavior href={'/admin/edit-product'}>
                            <a className={styles.linkOption}>
                                <EditNoteRoundedIcon />
                                Edit Product
                            </a>
                        </Link>
                        <Link legacyBehavior href={'/admin/consult-product'}>
                            <a className={styles.linkOption}>
                                <FormatListBulletedRoundedIcon />
                                Consult Product
                            </a>
                        </Link>
                    </div>
                </div>
            </main>
            <footer>
            </footer>
        </div>
    )
}