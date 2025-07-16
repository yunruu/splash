import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let firebaseApp;

function checkEnvVariables() {
    const requiredEnvVars = [
        'VITE_FIREBASE_apiKey',
        'VITE_FIREBASE_authDomain',
        'VITE_FIREBASE_projectId',
        'VITE_FIREBASE_storageBucket',
        'VITE_FIREBASE_messagingSenderId',
        'VITE_FIREBASE_appId'
    ];

    const missingVars = requiredEnvVars.filter((key) => !import.meta.env[key]);
    if (missingVars.length) {
        console.error('Missing Firebase environment variables:', missingVars);
        return false;
    }
    return true;
}

if (checkEnvVariables()) {
    firebaseApp = initializeApp({
        // your application settings
        apiKey: import.meta.env.VITE_FIREBASE_apiKey,
        authDomain: import.meta.env.VITE_FIREBASE_authDomain,
        projectId: import.meta.env.VITE_FIREBASE_projectId,
        storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
        messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
        appId: import.meta.env.VITE_FIREBASE_appId
    });
} else {
    console.error('Environment Keys Missing');
}

const db = firebaseApp
    ? getFirestore(firebaseApp, {
          experimentalForceLongPolling: true
      })
    : undefined;

// Exports
export { firebaseApp, db };
