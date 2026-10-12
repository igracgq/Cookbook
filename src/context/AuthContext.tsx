import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut as fbSignOut, updateProfile, type User
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isCloudConfigured } from '../services/firebase';
import { SignInDialog } from '../components/SignInDialog';

interface AuthContextType {
  /** False when Firebase is not set up (see docs/SHARING_SETUP.md); the cookbook then works as before. */
  cloudAvailable: boolean;
  user: User | null;
  /** True for the owner(s) of the cookbook (a document admins/{uid} exists in Firestore). Shows the moderation buttons. */
  isAdmin: boolean;
  /** True until Firebase has told us whether someone is already signed in. */
  loading: boolean;
  /** Opens the sign-in window (Google, or email and password). Every "Sign in" button in the app calls this. */
  signIn: () => void;
  signOut: () => Promise<void>;
  /** Shown in the sign-in window when Google sign-in fails. */
  authError: string | null;
  signInDialogOpen: boolean;
  closeSignIn: () => void;
  signInWithGoogle: () => Promise<void>;
  /** The email functions throw an Error whose message is ready to show to the person. */
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** Someone who signed up with email but has not yet clicked the link in the confirmation email. */
  pendingVerification: User | null;
  resendVerification: () => Promise<void>;
  /** Checks whether the confirmation link was clicked; true once the person is fully signed in. */
  confirmVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Email accounts must confirm their address (Google accounts arrive already confirmed). */
const needsConfirmation = (u: User) => !u.emailVerified && u.providerData.length > 0 && u.providerData.every(p => p.providerId === 'password');

const emailError = (e: any): Error => {
  switch (e?.code) {
    case 'auth/email-already-in-use': return new Error('That email already has an account. Use Sign in instead. If you normally use Google, tap "Continue with Google".');
    case 'auth/invalid-email': return new Error('That email address does not look right.');
    case 'auth/weak-password': return new Error('Please choose a password with at least 6 characters.');
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return new Error('That email and password do not match. If you usually use Google, tap "Continue with Google". Forgot your password? Use the link below.');
    case 'auth/too-many-requests': return new Error('Too many tries. Please wait a few minutes and try again.');
    case 'auth/network-request-failed': return new Error('No connection. Please check your internet and try again.');
    case 'auth/operation-not-allowed': return new Error('Email sign-in is not switched on yet. Turn on Email/Password under Firebase > Authentication > Sign-in method.');
    default: return new Error('That did not work. Please try again.');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingVerification, setPending] = useState<User | null>(null);
  const [loading, setLoading] = useState(isCloudConfigured);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signInDialogOpen, setDialogOpen] = useState(false);

  /** Someone is fully signed in: remember them, check whether they are an owner, and keep their small profile document. */
  const startSession = (u: User) => {
    setUser(u);
    setPending(null);
    setDialogOpen(false);
    if (!db) return;
    // The rules let a person read only their own admins document; it simply does not exist for ordinary members.
    getDoc(doc(db, 'admins', u.uid)).then(snap => setIsAdmin(snap.exists())).catch(() => setIsAdmin(false));
    // Keep a small profile document for each member (users/{uid}); favorites live in the same document.
    setDoc(
      doc(db, 'users', u.uid),
      { displayName: u.displayName ?? '', photoURL: u.photoURL ?? '', lastSignIn: serverTimestamp() },
      { merge: true }
    ).catch(() => {});
  };

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, u => {
      setLoading(false);
      setIsAdmin(false);
      if (!u) { setUser(null); setPending(null); return; }
      if (needsConfirmation(u)) { setUser(null); setPending(u); return; }
      startSession(u);
    });
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      const code: string = e?.code ?? '';
      if (code === 'auth/popup-blocked') {
        // Some phone browsers block popups; a full-page redirect works everywhere.
        await signInWithRedirect(auth, googleProvider);
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // The person closed the window: not an error worth showing.
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError('This website address is not authorised for sign-in yet. Add it under Firebase > Authentication > Settings > Authorised domains.');
      } else {
        setAuthError('Sign-in did not work. Please try again.');
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (e) { throw emailError(e); }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    if (!auth) return;
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Please type your name. It is shown on your photos and comments.');
    let cred;
    try { cred = await createUserWithEmailAndPassword(auth, email.trim(), password); }
    catch (e) { throw emailError(e); }
    try {
      await updateProfile(cred.user, { displayName: cleanName.slice(0, 80) });
      await sendEmailVerification(cred.user);
    } catch (e) { throw emailError(e); }
    setPending(cred.user);
  };

  const resetPassword = async (email: string) => {
    if (!auth) return;
    try { await sendPasswordResetEmail(auth, email.trim()); }
    catch (e: any) {
      // Say nothing about whether an account exists for this address.
      if (e?.code === 'auth/user-not-found') return;
      throw emailError(e);
    }
  };

  const resendVerification = async () => {
    if (!pendingVerification) return;
    try { await sendEmailVerification(pendingVerification); }
    catch (e) { throw emailError(e); }
  };

  const confirmVerification = async () => {
    const u = pendingVerification;
    if (!u) return false;
    await u.reload();
    if (!u.emailVerified) return false;
    await u.getIdToken(true); // so the security rules see the confirmed address
    startSession(u);
    return true;
  };

  const signOut = async () => {
    setPending(null);
    if (auth) await fbSignOut(auth);
  };

  const signIn = () => { setAuthError(null); setDialogOpen(true); };

  return (
    <AuthContext.Provider value={{
      cloudAvailable: isCloudConfigured, user, isAdmin, loading, signIn, signOut, authError,
      signInDialogOpen, closeSignIn: () => setDialogOpen(false),
      signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword,
      pendingVerification, resendVerification, confirmVerification
    }}>
      {children}
      {signInDialogOpen && <SignInDialog />}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
