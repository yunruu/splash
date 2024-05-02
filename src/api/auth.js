import { db } from '../plugins/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { hashPassword } from '@/utils/encrypt';

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
