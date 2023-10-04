import { useState } from "react"

function Error(props) {
    const {
        statusCode,
        supportsHoverAndPointer
    } = props

    const [hoverLink, setHoverLink] = useState(false)

    function handleHover() {
        if (supportsHoverAndPointer)
            setHoverLink(true)
    }

    function handleRemoveHover() {
        setHoverLink(false)
    }

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
                onMouseEnter={handleHover}
                onMouseOut={handleRemoveHover}
                style={{
                    fontWeight: 'bold',
                    color: hoverLink ? '#999999' : 'var(--link-color)',
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