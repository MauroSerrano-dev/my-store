import { withRouter } from 'next/router'
import styles from '../../styles/product.module.css'
import Head from 'next/head'

export default withRouter(props => {
    const {
    } = props


    return (
        <div className={styles.container}>
            <Head>
            </Head>
            <div className={styles.productContainer}>
            </div>
        </div>
    )
})