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
let app = null;
let auth = null;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase API Key is missing! App will run in offline/limited mode.");
}

export { auth };
export default app;
