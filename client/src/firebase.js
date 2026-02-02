import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const getEnv = (key) => {
    return import.meta.env[`VITE_${key}`] || import.meta.env[key];
};

const firebaseConfig = {
    apiKey: getEnv('FIREBASE_API_KEY'),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('FIREBASE_APP_ID')
};

// Safety check for production
if (import.meta.env.PROD && !firebaseConfig.apiKey) {
    console.warn("Firebase API Key is missing! Please check your Vercel environment variables.");
}

// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Initialize Firebase Authentication
export const auth = app ? getAuth(app) : null;

export default app;
