import { getUserProvidersByEmail } from "../../../backend/user";
import { isTokenValid } from "@/utils/auth";

export default async function handler(req, res) {
    const { authorization, email } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const providers = await getUserProvidersByEmail(email)
            res.status(200).json({ data: providers })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }
}