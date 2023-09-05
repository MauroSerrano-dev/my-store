import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "firebase/firestore"

const db = getFirestore()

async function getSession(sessionToken) {
    try {
        // Consulte a coleção de sessões para encontrar a sessão com o token fornecido
        const sessionsCollection = collection(db, process.env.COLL_SESSIONS);
        const q = query(sessionsCollection, where("sessionToken", "==", sessionToken))
        const querySnapshot = await getDocs(q)

        // Verifique se a sessão existe
        if (querySnapshot.size === 1) {
            // Obtenha os dados da sessão
            const sessionData = querySnapshot.docs[0].data()

            // Obtenha o ID do usuário associado à sessão
            const userId = sessionData.userId

            // Consulte a coleção de usuários para obter os dados do usuário
            const usersCollection = collection(db, process.env.COLL_USERS)
            const userDoc = await getDoc(doc(usersCollection, userId))

            if (userDoc.exists()) {
                // Retorna um objeto contendo o campo "user" com os dados do usuário
                return {
                    session: {
                        session: {
                            token: sessionData.sessionToken,
                        },
                        user: {
                            id: userId,
                            ...userDoc.data()
                        }
                    }
                }
            }
        }

        // Retorna null se a sessão não for encontrada ou se o usuário não existir
        return null;
    } catch (error) {
        console.error("Error getting session:", error)
        throw error
    }
}

export {
    getSession
}