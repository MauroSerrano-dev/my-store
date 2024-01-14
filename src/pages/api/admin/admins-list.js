import { getAdminUsers } from "../../../../backend/admin"
const admin = require('../../../../firebaseAdminInit')

export default async function handler(req, res) {
    const { authorization, page, limit } = req.headers

    if (!authorization)
        res.status(401).send('Access denied: No token provided')

    if (req.method === 'GET') {
        try {
            const decodedToken = await admin.auth().verifyIdToken(authorization)
            if (decodedToken.admin) {
                const adminUsers = await getAdminUsers(Number(limit) || undefined, Number(page) || undefined)
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