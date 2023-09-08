import { updateField } from "../../../backend/user";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id } = req.body

        await updateField(id, 'introduction_complete', true)
        res.status(200).json({ message: `${id} Introduction Complete` })
    }
}