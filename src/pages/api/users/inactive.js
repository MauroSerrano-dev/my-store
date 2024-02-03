import { getUsersInactiveForMonths, deleteInactiveUsersForMonths } from "../../../../backend/user";
const admin = require('../../../../firebaseAdminInit');

export default async function handler(req, res) {
    const { authorization, limit, months } = req.headers;

    try {
        if (!authorization)
            return res.status(401).json({ message: 'Access denied: No token provided' });

        const decodedToken = await admin.auth().verifyIdToken(authorization);
        if (!decodedToken.admin) {
            return res.status(403).json({ message: 'Access denied: User is not an administrator' });
        }

        if (req.method === 'GET') {
            const inactiveUsers = await getUsersInactiveForMonths(Number(limit) || undefined, Number(months) || undefined);
            res.status(200).json({ users: inactiveUsers });
        }
        else if (req.method === 'DELETE') {
            await deleteInactiveUsersForMonths(Number(months) || undefined);
            res.status(200).json({ message: 'Inactive users deleted successfully' });
        }
        else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
