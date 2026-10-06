import React, { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/** Google sign-in / sign-out for the header. */
export const AuthButton: React.FC = () => {
  const { cloudAvailable, user, loading, signIn, signOut, authError } = useAuth();

  if (!cloudAvailable) {
    return (
      <button
        id="auth_btn"
        type="button"
        disabled
        title="Sign-in is not set up for this copy of the cookbook yet"
        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#857566] bg-[#EBE3D6]/60 border border-[#D2C4B1] rounded-lg cursor-not-allowed"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Sign in</span>
      </button>
    );
  }

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-[#EBE3D6] animate-pulse" aria-label="Checking sign-in" />;
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          id="auth_btn"
          type="button"
          onClick={signIn}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#FAF7F2] bg-[#4A3B2C] rounded-lg hover:bg-[#382B1E] transition-colors cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign in<span className="hidden md:inline"> with Google</span></span>
        </button>
        {authError && (
          <p role="alert" className="absolute right-0 top-full mt-2 w-64 text-[11px] leading-snug bg-[#FAF7F2] border border-[#B8452D] text-[#B8452D] rounded-xl p-2.5 shadow-lg z-50">
            {authError}
          </p>
        )}
      </div>
    );
  }

  return <AccountMenu />;
};

/** Signed in: the member's Google photo. Tapping it opens a small menu with the name and Sign out. */
const AccountMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = user.displayName ?? 'Signed in';

  return (
    <div ref={ref} className="relative">
      <button
        id="account_btn"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`${name}: tap for sign out`}
        className="block w-8 h-8 rounded-full overflow-hidden border border-[#D2C4B1] bg-[#DECFC0] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
      >
        {user.photoURL && !photoFailed ? (
          <img
            src={user.photoURL}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setPhotoFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-xs font-bold text-[#4A3B2C]">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-56 bg-[#FAF7F2] border border-[#D2C4B1] rounded-xl shadow-lg p-3 z-50 space-y-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#261D16] truncate">{name}</p>
            {user.email && <p className="text-[11px] text-[#7D6C5A] truncate">{user.email}</p>}
          </div>
          <button
            id="sign_out_btn"
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); signOut(); }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};
