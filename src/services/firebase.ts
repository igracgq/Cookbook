import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithCredential, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase is optional: the cookbook works without it. Sign-in, shared recipes, shared photos and
 * favorites sync switch on once the VITE_FIREBASE_* values are set (see docs/SHARING_SETUP.md).
 * Firebase Cloud Storage is deliberately not used; photos go to Cloudinary (see cloudinary.ts).
 */
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isCloudConfigured = !!(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;

if (isCloudConfigured) {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  // Local testing only: `VITE_FIREBASE_EMULATOR=true` points the app at the Firebase emulators.
  if (import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    // The emulator accepts a fake Google credential, which lets automated tests sign in without a popup.
    (window as any).__cookbookTestSignIn = (sub: string, email: string) =>
      signInWithCredential(auth!, GoogleAuthProvider.credential(JSON.stringify({ sub, email, email_verified: true })));
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
