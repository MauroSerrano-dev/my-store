import { getAdminUsers } from "../../../../backend/admin"
const admin = require('../../../../firebaseAdminInit')

export default async function handler(req, res) {
    const token = req.headers.authorization

    if (!token)
        res.status(401).send('Access denied: No token provided')

    if (req.method === 'GET') {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token)
            if (decodedToken.admin) {
                const adminUsers = await getAdminUsers()
                res.status(200).json(adminUsers)
            } else {
                res.status(403).send('Access denied: User is not an administrator')
            }
        } catch (error) {
            console.error('Error verifying token:', error)
            res.status(500).send('Internal server error')
        }
    }
}