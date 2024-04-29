import { Timestamp, collection, addDoc, getDoc, getDocs, doc } from 'firebase/firestore';
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
        const docRef = await addDoc(collection(db, 'users'), groupData);
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

// Get all groups that a user is a part of by ID
export const getGroups = async (username, isOnlyIncludeId) => {
    const groups = [];
    try {
        const groupsSnapshot = await getDocs(collection(db, 'group'));
        groupsSnapshot.forEach((doc) => {
            doc.data().profiles.forEach((profile) => {
                if (profile.id === username) {
                    if (isOnlyIncludeId) {
                        groups.push(doc.id);
                    } else {
                        groups.push(doc.data());
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
        const docRef = doc(db, 'group', groupId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        throw new Error('Group not found');
    } catch (e) {
        console.error('Error getting group: ', e);
        return {};
    }
};
