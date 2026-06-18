import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config is fully provided
export const isMockEnabled = !firebaseConfig.apiKey;

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (!isMockEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize real Firebase, switching to Mock Mode:', error);
  }
} else {
  console.warn(
    'Firebase environment variables missing (VITE_FIREBASE_API_KEY is not defined). ' +
    'The application will run in Mock Mode, persisting data to LocalStorage.'
  );
}

export { app, auth, db, storage };
