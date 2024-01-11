const admin = require('../../../../firebaseAdminInit')

export default async function handler(req, res) {
    const token = req.headers.authorization

    if (!token)
        return res.status(401).send('Access denied: No token provided')

    if (req.method === 'GET') {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token)
            if (decodedToken.admin)
                res.status(200).json('User is an administrator')
            else
                return
        } catch (error) {
            console.error('Error verifying token:', error)
            return res.status(500).send('Internal server error')
        }
    }
}