import styles from '@/styles/admin.module.css'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Router from "next/router";

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
                            <button
                                className={styles.buttonOption}
                                onClick={() => Router.push('/admin/new-product')}
                            >
                                <AddCircleOutlineRoundedIcon />
                                Add New Product
                            </button>
                        </div>
                        <div>
                            <button
                                className={styles.buttonOption}
                                onClick={() => Router.push('/admin/edit-product')}
                            >
                                <EditNoteRoundedIcon />
                                Edit Product
                            </button>
                        </div>
                        <div>
                            <button
                                className={styles.buttonOption}
                                onClick={() => Router.push('/admin/consult-product')}
                            >
                                <FormatListBulletedRoundedIcon />
                                Consult Product
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
            </footer>
        </div>
    )
}