import { authenticateUser } from "../../../backend/login"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        try {
            // Autentica o usuário
            const user = await authenticateUser(email, password);
            
            // Se a autenticação for bem-sucedida, você pode retornar uma resposta JSON com os detalhes do usuário ou qualquer outra informação necessária
            res.status(200).json({ user: user });
        } catch (error) {
            // Se a autenticação falhar, você pode retornar uma resposta de erro com uma mensagem apropriada
            res.status(401).json({ message: "Authentication failed" });
        }
    }
}