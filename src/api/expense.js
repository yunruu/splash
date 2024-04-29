import {
    Timestamp,
    collection,
    addDoc,
    deleteDoc,
    getDoc,
    getDocs,
    doc,
    query,
    orderBy,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../plugins/firebase';

export const createExpense = async ({
    name,
    description,
    amount,
    currency,
    groupId,
    paidBy,
    splitBy
}) => {
    const data = {
        name,
        description,
        amount,
        currency,
        groupId,
        paidBy,
        splitBy,
        timestamp: Timestamp.fromDate(new Date())
    };
    try {
        const docRef = await addDoc(collection(db, 'expenses'), data);
        return { data: { id: docRef.id } };
    } catch (e) {
        console.error('Error adding document: ', e);
        return { error: e };
    }
};

export const getExpense = async (id) => {
    try {
        const docSnap = await getDoc(doc(db, 'expenses', id));
        if (docSnap.exists()) {
            return { data: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { error: 'No such document!' };
        }
    } catch (e) {
        console.error('Error getting document: ', e);
        return { error: e };
    }
};

export const getAllExpensesOfGroup = async (groupId) => {
    try {
        const ref = collection(db, 'expenses');
        const q = query(ref, where('groupId', '==', groupId), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const expenses = [];
        querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        return { data: expenses };
    } catch (e) {
        console.error('Error getting documents: ', e);
        return { error: e };
    }
};

export const updateExpense = async (id, data) => {
    console.log('id: ', id);
    try {
        const ref = doc(db, 'expenses', id);
        await updateDoc(ref, data);
        return { data: { id } };
    } catch (e) {
        console.error('Error updating document: ', e);
        return { error: e };
    }
};

export const deleteExpense = async (id) => {
    try {
        await deleteDoc(doc(db, 'expenses', id));
        return { data: { id } };
    } catch (e) {
        console.error('Error deleting document: ', e);
        return { error: e };
    }
};
