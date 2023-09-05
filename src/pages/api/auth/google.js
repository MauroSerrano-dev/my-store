import { authenticateWithGoogle } from "../../../backend/auth"; // Importe a função de autenticação com o Google

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { idToken } = req.body; // Token enviado pelo frontend
        const result = await authenticateWithGoogle(idToken);

        if (result.success) {
            // Autenticação bem-sucedida, retorne os dados do usuário
            res.status(200).json({ user: result.user });
        } else {
            // Autenticação falhou, retorne um erro
            res.status(401).json({ error: 'Autenticação falhou' });
        }
    } else {
        // Método HTTP não suportado
        res.status(405).json({ error: 'Método não suportado' });
    }
}