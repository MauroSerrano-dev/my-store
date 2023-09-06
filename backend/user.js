import {
    collection,
    doc,
    getDoc,
    setDoc,
    getFirestore,
    getDocs,
    where,
    query
} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseConfig } from "../firebase.config"
import { v4 as uuidv4 } from 'uuid';

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

async function getUserIdByEmail(email) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS);

        // Query the user with the provided email
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // If a document is returned, return the userId
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting userId by email:", error);
        throw error;
    }
}

async function createNewUser(user) {
    try {
        // Create a reference to the users collection
        const usersCollection = collection(db, process.env.COLL_USERS)

        // Add the new user to the collection with password encryption
        const newUserRef = doc(usersCollection)

        // Create a session for the new user and return the session ID
        const { user: authenticatedUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)
        const sessionID = authenticatedUser.uid;

        // Set the document for the new user
        await setDoc(newUserRef,
            {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                uid: authenticatedUser.uid
            })

        console.log(`${user.email} has been added as a new user, and a session has been created.`)

        return sessionID
    } catch (error) {
        console.error("Error creating a new user and session:", error)
        throw error;
    }
}

async function createNewUserWithGoogle(user) {
    try {
        // Verifique se o usuário com o mesmo e-mail já existe
        const userIdExists = await getUserIdByEmail(user.email);

        if (!userIdExists) {
            // Se o usuário não existir, crie um novo
            // Create a reference to the users collection
            const usersCollection = collection(db, process.env.COLL_USERS);

            // Add the new user to the collection with password encryption
            const newUserRef = doc(usersCollection);

            // Set the document for the new user
            await setDoc(newUserRef, user);

            console.log(`${user.email} has been added as a new user, and a session has been created.`);

            return await createSessionForUser(newUserRef.id);
        } else {
            console.log(`${user.email} already exists as a user.`);
            return await createSessionForUser(userIdExists);
        }
    } catch (error) {
        console.error("Error creating a new user and session:", error);
        throw error;
    }
}

async function createSessionForUser(userId) {
    try {
        // Create a reference to the sessions collection
        const sessionsCollection = collection(db, process.env.COLL_SESSIONS);

        // Create a new session document
        const newSessionRef = doc(sessionsCollection);

        // Generate a session token using uuid
        const sessionToken = uuidv4();

        // Calculate the expiration timestamp (1 month from now)
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        // Set the document for the new session
        const sessionData = {
            userId: userId,
            sessionToken: sessionToken,
            expiresAt: {
                text: expirationDate.toString(),
                ms: expirationDate.valueOf(),
            }
        }

        await setDoc(newSessionRef, sessionData);

        console.log(`A session has been created for the user with ID: ${userId}.`);

        // Return the sessionToken
        return sessionData.sessionToken;
    } catch (error) {
        console.error("Error creating a session for the user:", error);
        throw error;
    }
}

async function checkUserExistsByEmail(email) {
    try {
        const usersCollection = collection(db, process.env.COLL_USERS);

        // Crie uma consulta para verificar se há um documento com o mesmo email
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // Se algum documento for retornado, isso significa que o usuário já existe
        if (!querySnapshot.empty) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
}

async function removeEmailVerifiedField(userId) {
    try {
        const userRef = doc(db, process.env.COLL_USERS, userId); // Adjust the path accordingly

        // Get the existing user data
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
            const userData = userDoc.data()

            delete userData.emailVerified

            await setDoc(userRef, userData)

            console.log(`${userId} emailVerified field removed from the database`)
        } else {
            console.log(`${userId} User document not found`)
        }
    } catch (error) {
        console.error(`Error removing ${userId} emailVerified field from the database:`, error)
    }
}

export {
    createNewUser,
    createNewUserWithGoogle,
    removeEmailVerifiedField,
    checkUserExistsByEmail
}