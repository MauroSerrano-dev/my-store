import { addQuestForAllUsers, deleteQuestForAllUsers } from "../../../../backend/user";
const admin = require('../../../../firebaseAdminInit');

export default async function handler(req, res) {
    try {
        const { authorization, quest_id } = req.headers
        const { questId } = req.body

        if (!authorization)
            return res.status(401).send('Access denied: No token provided');

        const decodedToken = await admin.auth().verifyIdToken(authorization);
        if (!decodedToken.admin)
            return res.status(403).send('Access denied: User is not an administrator');

        if (req.method === "POST") {
            await addQuestForAllUsers(questId)
            res.status(201).json({ status: 201, message: 'quest_created-for-all-users' })
        }
        else if (req.method === "DELETE") {
            await deleteQuestForAllUsers(quest_id)
            res.status(200).json({ status: 200, message: 'quest_deleted-for-all-users' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: 'default_error' })
    }
}