const jwt = require("jsonwebtoken")

// Função para verificar e decodificar um token JWT
export function isTokenValid(token, secretKey) {
    try {
        const decoded = jwt.verify(token.slice(7, token.length), secretKey);

        // Verifique a data de expiração se existir
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && now > decoded.exp) {
            return false
        }

        return true
    } catch (error) {
        console.error('Erro na verificação do token:', error);
        return false
    }
}