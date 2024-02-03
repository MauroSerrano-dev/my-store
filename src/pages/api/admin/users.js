import { getAllUsers } from "../../../../backend/admin"
const admin = require('../../../../firebaseAdminInit')

export default async function handler(req, res) {
    const { authorization, page, limit } = req.headers

    if (!authorization)
        res.status(401).json({ message: 'Access denied: No token provided' })

    if (req.method === 'GET') {
        try {
            const decodedToken = await admin.auth().verifyIdToken(authorization)
            if (decodedToken.admin) {
                const users = await getAllUsers(Number(limit) || undefined, Number(page) || undefined)
                res.status(200).json({ users: users })
            } else {
                res.status(403).json({ message: 'Access denied: User is not an administrator' })
            }
        }
        catch (error) {
            console.error('Error verifying token:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}