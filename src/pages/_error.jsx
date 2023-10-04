import styles from '@/styles/_error.module.css'

function Error({ statusCode }) {
    return (
        <div
            className="fillWidth flex center"
            style={{
                '--text-color': 'var(--text-white)'
            }}
        >
            <p style={{ fontWeight: 'bold', fontSize: '24px' }}>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'
                }
            </p>
            <Link
                href="/"
                className={styles.link}
            >
                Back to homepage
            </Link>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error