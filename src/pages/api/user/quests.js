import { isTokenValid } from "@/utils/auth";
import { completeQuest } from "../../../../backend/user";

export default async function handler(req, res) {
    const { authorization, user_id, quest_id } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "POST") {
        try {
            const quests = await completeQuest(user_id, quest_id)
            return res.status(200).json({ data: quests, message: `User ${user_id} completed quest ${quest_id}` })
        } catch {
            return res.status(500).json({ message: `Error user ${user_id} completing quest ${quest_id}` })
        }
    }
}