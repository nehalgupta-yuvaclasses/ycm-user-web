import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

if (!hasConfig) {
  console.warn('Missing Firebase environment variables. Configure VITE_FIREBASE_* values before using auth.');
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth | null = hasConfig ? getAuth(firebaseApp) : null;

export function getFirebaseAuth() {
  if (!auth) {
    throw new Error('Missing Firebase environment variables. Configure VITE_FIREBASE_* values before using auth.');
  }

  return auth;
}

export const authPersistenceReady = auth
  ? setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Failed to configure Firebase auth persistence.', error);
      return undefined;
    })
  : Promise.resolve(undefined);
