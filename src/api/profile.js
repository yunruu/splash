import { db } from '../plugins/firebase';
import { Timestamp, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { getGroupData } from './group';

export const createProfile = async (username, profileData) => {
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
        return { data: { username } };
    } catch (e) {
        return { error: e };
    }
};

export const loginProfile = async (username, password) => {
    try {
        const docRef = doc(db, 'profile', username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profileData = docSnap.data();
            if (profileData.password === password) {
                return { data: { username } };
            }
        }
        throw new Error('Invalid username or password');
    } catch (e) {
        return { error: e };
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

// Get all members in a group
export const getMembers = async (groupId) => {
    const members = [];
    try {
        const res = await getGroupData(groupId);
        if (!res.data) {
            throw new Error('Group not found');
        }
        const members = res.data.profiles;
        return members;
    } catch (e) {
        console.error('Error getting members: ', e);
    }
    return members;
};
