import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export const firebaseApp = initializeApp({
  // your application settings
  apiKey: import.meta.env.VITE_FIREBASE_apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_appId
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)
