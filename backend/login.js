import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../firebase.config"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getUserIdByUid } from "./user";
import { createSessionForUser } from "./sessions";

initializeApp(firebaseConfig)

async function authenticateUser(email, password) {
    try {
        const auth = getAuth();

        // Autentica o usuário com email e senha
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Retorna a session
        const userId = await getUserIdByUid(userCredential.user.uid);

        return await createSessionForUser(userId)
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}

export {
    authenticateUser,
}