const admin = require('../../../../firebaseAdminInit')

export default async function handler(req, res) {
    const token = req.headers.authorization

    if (!token)
        res.status(401).send('Access denied: No token provided')

    if (req.method === 'GET') {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token)
            if (decodedToken.admin)
                res.status(200).json({ message: 'User is an administrator', isAdmin: true })
            else
            res.status(200).json({ message: 'User is not an administrator', isAdmin: false })
        } catch (error) {
            console.error('Error verifying token:', error)
            res.status(500).send('Internal server error')
        }
    }
}