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
                style={{
                    fontWeight: 'bold',
                    color: 'var(--link-color)', //'#999999'
                    transition: 'all ease-in-out 150ms',
                }}
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