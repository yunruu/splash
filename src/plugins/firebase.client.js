import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_authDomain,
    projectId: import.meta.env.VITE_FIREBASE_projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_appId
};

const missingVars = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => `VITE_FIREBASE_${key}`);

if (missingVars.length > 0) {
    throw new Error(
        `Missing Firebase environment variables: ${missingVars.join(', ')}. Please check your .env file.`
    );
}

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(firebaseApp);

export { firebaseApp, db };
