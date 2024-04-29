import {
    Timestamp,
    collection,
    addDoc,
    deleteDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../plugins/firebase';

// Create a new group with a name, description, and list of profiles added to the group
export const createGroup = async ({ name, description, profiles }) => {
    try {
        const validProfiles = [];
        for (const profile of profiles) {
            const docRef = await getDoc(doc(db, 'profile', profile));
            if (docRef.exists()) {
                validProfiles.push(profile);
            }
        }
        const groupData = {
            name,
            description,
            profiles: validProfiles,
            timestamp: Timestamp.fromDate(new Date())
        };
        const docRef = await addDoc(collection(db, 'groups'), groupData);
        return { id: docRef.id };
    } catch (e) {
        console.error('Error adding document: ', e);
        return { error: e };
    }
};

// Get all groups that a user is a part of by ID
export const getGroups = async (username, isOnlyIncludeId) => {
    const groups = [];
    try {
        const groupsSnapshot = await getDocs(collection(db, 'groups'));
        groupsSnapshot.forEach((doc) => {
            doc.data().profiles.forEach((profile) => {
                if (profile === username) {
                    if (isOnlyIncludeId) {
                        groups.push(doc.id);
                    } else {
                        groups.push({ id: doc.id, ...doc.data() });
                    }
                }
            });
        });
    } catch (e) {
        console.error('Error getting groups: ', e);
    }
    return groups;
};

// Retrieve group data by ID
export const getGroupData = async (groupId) => {
    try {
        const docRef = doc(db, 'groups', groupId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { data: docSnap.data() };
        }
        throw new Error('Group not found');
    } catch (e) {
        console.error('Error getting group: ', e);
        return {};
    }
};

export const updateGroup = async (groupId, data) => {
    try {
        const docRef = doc(db, 'groups', groupId);
        await updateDoc(docRef, data);
        return { id: docRef.id };
    } catch (e) {
        console.error('Error updating document: ', e);
        return { error: e };
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const docRef = doc(db, 'groups', groupId);
        await deleteDoc(docRef);
        return { id: docRef.id };
    } catch (e) {
        console.error('Error deleting document: ', e);
        return { error: e };
    }
};
