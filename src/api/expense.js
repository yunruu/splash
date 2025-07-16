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
import { db } from '../plugins/firebase.client';
import { currencies } from '@/utils/currency';

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

const settleDebts = (debts) => {
    // Step 1: Calculate net balances for each currency
    const netBalances = {};
    for (const user in debts) {
        for (const currency in debts[user]) {
            if (!netBalances[currency]) {
                netBalances[currency] = {};
            }
            netBalances[currency][user] =
                (netBalances[currency][user] || 0) + debts[user][currency];
        }
    }

    // Step 2: Determine payments
    const payments = [];
    for (const currency in netBalances) {
        const balances = netBalances[currency];
        const payers = Object.keys(balances).filter((user) => balances[user] > 0);
        const receivers = Object.keys(balances).filter((user) => balances[user] < 0);

        while (payers.length > 0 && receivers.length > 0) {
            const payer = payers[0];
            const receiver = receivers[0];
            const amountToPay = Math.min(balances[payer], -balances[receiver]);

            if (amountToPay > 0) {
                payments.push({
                    from: payer,
                    to: receiver,
                    amount: amountToPay,
                    currency: currency
                });
                balances[payer] -= amountToPay;
                balances[receiver] += amountToPay;

                // Update lists if any balances are zeroed out
                if (balances[payer] === 0) {
                    payers.shift();
                }
                if (balances[receiver] === 0) {
                    receivers.shift();
                }
            }
        }
    }
    return payments;
};

export const settleUp = async (groupId) => {
    try {
        const groupInfo = await getDoc(doc(db, 'groups', groupId));
        if (!groupInfo.exists()) {
            throw new Error('No group ID found');
        }

        // Initialise the owe array with members and initial value 0.0
        let debts = {};
        groupInfo.data().profiles.forEach((key) => {
            debts[key] = currencies.reduce((obj, item) => {
                obj[item.value] = 0.0;
                return obj;
            }, {});
        });

        // Retrieve the group expenses
        const res = await getAllExpensesOfGroup(groupId);
        if (!res.data) {
            throw new Error('No expenses found');
        }

        // For each expense, we populate who owes what
        res.data.forEach((obj) => {
            const totalPrice = obj.amount;
            const splitPrice = totalPrice / obj.splitBy.length;

            debts[obj.paidBy][obj.currency] += -1 * totalPrice;
            obj.splitBy.forEach((user) => {
                debts[user][obj.currency] += splitPrice;
            });
        });

        return { data: settleDebts(debts) };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};
