import { getFirestore, collection, query, where, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore"

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

async function deleteSession(sessionToken) {
    try {
        // Consulte a coleção de sessões para encontrar a sessão com o token fornecido
        const sessionsCollection = collection(db, process.env.COLL_SESSIONS);
        const q = query(sessionsCollection, where("sessionToken", "==", sessionToken))
        const querySnapshot = await getDocs(q)

        // Verifique se a sessão existe
        if (querySnapshot.size === 1) {
            const sessionDoc = querySnapshot.docs[0];
            
            // Exclua o documento da sessão
            await deleteDoc(sessionDoc.ref);

            console.log(`Session with sessionToken ${sessionToken} deleted successfully.`);

            return true; // Indica que a sessão foi encontrada e excluída
        } else {
            console.log(`Session with sessionToken ${sessionToken} not found.`);
            return false; // Indica que a sessão não foi encontrada
        }
    } catch (error) {
        console.error(`Error deleting session with sessionToken ${sessionToken}:`, error);
        throw error;
    }
}

export {
    getSession,
    deleteSession
}