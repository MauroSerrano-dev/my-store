import { isTokenValid } from "../../../../auth";
import { getAllCurrencies } from "../../../../backend/app-settings";

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).json({ error: "Invalid authentication." })

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY))
        return res.status(401).json({ error: "Invalid authentication." })

    if (req.method === "GET") {
        const currencies = await getAllCurrencies()
        res.status(200).json(currencies)
    }
}