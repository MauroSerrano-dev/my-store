import { getUsersInactiveForMonths, deleteInactiveUsersForMonths } from "../../../../backend/user";
const admin = require('../../../../firebaseAdminInit');

export default async function handler(req, res) {
    const { authorization, limit, months } = req.headers;

    try {
        if (!authorization)
            return res.status(401).send('Access denied: No token provided');

        const decodedToken = await admin.auth().verifyIdToken(authorization);
        if (!decodedToken.admin) {
            return res.status(403).send('Access denied: User is not an administrator');
        }

        if (req.method === 'GET') {
            const adminUsers = await getUsersInactiveForMonths(Number(limit) || undefined, Number(months) || undefined);
            res.status(200).json(adminUsers);
        } else if (req.method === 'DELETE') {
            await deleteInactiveUsersForMonths(Number(months) || undefined);
            res.status(200).send('Inactive users deleted successfully');
        } else {
            res.status(405).send('Method not allowed');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal server error');
    }
}
