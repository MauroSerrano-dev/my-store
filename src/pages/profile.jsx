import styles from '@/styles/pages/profile.module.css'
import Head from 'next/head'
import NoFound404 from './404'

export default function Profile(props) {
    const {
        session
    } = props

    return (
        session === undefined
            ? <div></div>
            : session === null
                ? <NoFound404 />
                : <div className={styles.container}>
                    <Head>
                    </Head>
                    <div className={styles.productContainer}>
                    </div>
                </div>
    )
}