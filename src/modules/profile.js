import { db } from './plugins/firebase';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';

export const createProfile = async ({ username, profileData }) => {
    try {
        const docRef = doc(db, 'profile', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            throw new Error('Username already exists');
        }
        profileData = {
            ...profileData,
            timestamp: Timestamp.fromDate(new Date())
        };
        await setDoc(docRef, profileData);
        console.log('Document written with ID: ', username);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};
