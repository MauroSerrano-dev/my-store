import { isTokenValid } from "@/utils/auth";
import { getShippingInfos } from "../../../../backend/app-settings";

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { products, country } = req.query

    if (!authorization)
        res.status(401).json({ error: "Invalid authentication" })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        res.status(401).json({ error: "Invalid authentication" })

    if (req.method === "GET") {
        try {
            const response = await getShippingInfos(JSON.parse(products), country)
            res.status(200).json({ data: response })
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
}