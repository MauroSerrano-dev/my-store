import {
    collection,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    getDoc,
    startAfter,
} from "firebase/firestore"
import { db } from "../firebaseInit"
import MyError from "@/classes/MyError"

async function getOrderById(orderId) {
    try {
        const orderRef = doc(db, process.env.NEXT_PUBLIC_COLL_ORDERS, orderId)
        const orderDoc = await getDoc(orderRef)

        if (!orderDoc.exists())
            throw new MyError('order_not_found')

        const orderData = orderDoc.data()

        console.log("Order retrieved successfully")
        return { id: orderDoc.id, ...orderData }
    } catch (error) {
        console.error('Error getting order:', error);
        throw error
    }
}

async function getOrdersByUserId(userId, startDate, endDate) {
    try {
        const ordersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_ORDERS);
        let q = query(
            ordersCollection,
            where("user_id", "==", userId)
        );

        if (startDate) {
            const start = new Date(Number(startDate))
            q = query(q, where("create_at", ">=", start))
        }

        if (endDate) {
            const end = new Date(Number(endDate))
            q = query(q, where("create_at", "<=", end))
        }

        q = query(q, orderBy("create_at", "desc"))

        const querySnapshot = await getDocs(q)

        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        return orders
    } catch (error) {
        console.error('Error retrieving orders:', error);
        throw error
    }
}

async function getOrdersByQuery(queryParams) {
    try {
        const {
            limit = 10,
            page = 1,
            userId = null,
            startDate = null,
            endDate = null,
            orderByField = 'create_at',
            status = null,
        } = queryParams;

        const ordersCollection = collection(db, process.env.NEXT_PUBLIC_COLL_ORDERS);

        let q = query(ordersCollection);

        // Adiciona cláusula de filtragem por userId, se fornecido
        if (userId) {
            q = query(q, where('user_id', '==', userId));
        }

        // Adiciona cláusula de filtragem por status, se fornecido
        if (status) {
            q = query(q, where('status', '==', status));
        }

        // Adiciona cláusula de filtragem por data de início, se fornecido
        if (startDate) {
            const start = new Date(Number(startDate));
            q = query(q, where('create_at', '>=', start));
        }

        // Adiciona cláusula de filtragem por data de término, se fornecido
        if (endDate) {
            const end = new Date(Number(endDate));
            q = query(q, where('create_at', '<=', end));
        }

        // Adiciona cláusula de ordenação
        q = query(q, orderBy(orderByField, 'desc'));

        // Adiciona cláusula de paginação
        if (page > 1) {
            const lastVisibleOrder = await getLastVisibleOrder(q, limit * (page - 1));
            q = query(q, startAfter(lastVisibleOrder));
        }

        // Executa a consulta
        const querySnapshot = await getDocs(q);

        // Obtém os documentos da consulta
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return orders;
    } catch (error) {
        console.error('Error getting orders by query:', error);
        throw error;
    }
}

// Função auxiliar para obter o último documento visível
async function getLastVisibleOrder(query, offset) {
    const querySnapshot = await getDocs(query);
    return querySnapshot.docs[offset - 1];
}

export {
    getOrdersByUserId,
    getOrderById,
    getOrdersByQuery,
}