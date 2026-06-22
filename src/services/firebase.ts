import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Explicitly disable mock mode as requested by user
export const isMockEnabled = false;

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error(
    `[Firebase Initialization Error]: Missing environment variables: ${missingKeys.join(', ')}.\n` +
    'Please ensure all VITE_FIREBASE_* environment variables are set in your .env file (for local development) ' +
    'or in your hosting provider\'s settings (like Vercel Project Settings -> Environment Variables) and rebuild the deployment.'
  );
}

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Safe async initialization for analytics
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized.');
      }
    }).catch(err => console.warn('Analytics not supported in this environment:', err));

    console.log('Firebase initialized successfully.');
  } else {
    console.warn('Firebase app initialization skipped due to missing config.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

export { app, auth, db, storage, analytics };
