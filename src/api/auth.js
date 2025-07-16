import { db, firebaseApp } from '../plugins/firebase.client';
import {
    doc,
    deleteDoc,
    getDoc,
    getDocs,
    collection,
    setDoc,
    getFirestore
} from 'firebase/firestore';
import { hashPassword, isPasswordMatch } from '@/utils/encrypt';

export const resetPassword = async (username, password) => {
    try {
        const docRef = doc(db, 'profile', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profileData = docSnap.data();
            profileData.password = await hashPassword(password);
            if (profileData.password.error) {
                throw profileData.password.error;
            }
            await setDoc(docRef, profileData);
            return { data: { username } };
        }
        throw new Error('User not found');
    } catch (e) {
        return { error: e };
    }
};

export const deleteAccount = async (username) => {
    try {
        const docRef = doc(db, 'profile', username);
        await deleteDoc(docRef);
        return { data: { username } };
    } catch (e) {
        return { error: e };
    }
};

export const login = async (username, password) => {
    try {
        const db = getFirestore(firebaseApp);
        const docs = await getDocs(collection(db, 'profile'));
        docs.forEach((item) => console.log(item));

        const docRef = doc(db, 'profile', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profileData = docSnap.data();
            if (await isPasswordMatch(password, profileData.password)) {
                return { data: { username } };
            }
        }
        throw new Error('Invalid username or password');
    } catch (e) {
        console.log('ERR', e.message);
        return { error: e };
    }
};
