import { db } from '../plugins/firebase';
import { Timestamp, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

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

export const getProfile = async (username) => {
    try {
        const docRef = doc(db, 'profile', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        throw new Error('User not found');
    } catch (e) {
        console.error('Error getting profile: ', e);
    }
};

// Get all profiles that exist by ID
export const getAllProfiles = async () => {
    const profiles = [];
    try {
        const profilesSnapshot = await getDocs(collection(db, 'profile'));
        profilesSnapshot.forEach((doc) => {
            profiles.push(doc.id);
        });
        return profiles;
    } catch (e) {
        console.error('Error getting profiles: ', e);
    }
    return profiles;
};
