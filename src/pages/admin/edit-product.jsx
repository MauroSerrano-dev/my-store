import TextInput from '@/components/material-ui/TextInput'
import styles from '@/styles/admin/edit-product.module.css'
import { Button } from '@mui/material'

export default function EditProduct(props) {

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <TextInput
                    label='Product ID'
                />
                <Button>
                    Search
                </Button>
            </main>
        </div>
    )
}