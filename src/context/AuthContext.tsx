import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut as fbSignOut, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isCloudConfigured } from '../services/firebase';

interface AuthContextType {
  /** False when Firebase is not set up (see docs/SHARING_SETUP.md); the cookbook then works as before. */
  cloudAvailable: boolean;
  user: User | null;
  /** True for the owner(s) of the cookbook (a document admins/{uid} exists in Firestore). Shows the moderation buttons. */
  isAdmin: boolean;
  /** True until Firebase has told us whether someone is already signed in. */
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isCloudConfigured);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
      setIsAdmin(false);
      if (u && db) {
        // The rules let a person read only their own admins document; it simply does not exist for ordinary members.
        getDoc(doc(db, 'admins', u.uid)).then(snap => setIsAdmin(snap.exists())).catch(() => setIsAdmin(false));
      }
      if (u && db) {
        // Keep a small profile document for each member (users/{uid}); favorites live in the same document.
        setDoc(
          doc(db, 'users', u.uid),
          { displayName: u.displayName ?? '', photoURL: u.photoURL ?? '', lastSignIn: serverTimestamp() },
          { merge: true }
        ).catch(() => {});
      }
    });
  }, []);

  const signIn = async () => {
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

  const signOut = async () => {
    if (auth) await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ cloudAvailable: isCloudConfigured, user, isAdmin, loading, signIn, signOut, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
