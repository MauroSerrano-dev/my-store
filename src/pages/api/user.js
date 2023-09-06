import { createNewUser, checkUserExistsByEmail } from "../../../backend/user";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user } = req.body;

        // Verifique se o usuário com o mesmo email já existe
        const userExists = await checkUserExistsByEmail(user.email);

        if (userExists) {
            res.status(400).json({ error: "User with this email already exists." });
        } else {
            // Crie um novo usuário apenas se não existir
            const sessionID = await createNewUser(user);
            res.status(201).json({ sessionID: sessionID });
        }
    }
}