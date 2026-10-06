import React from 'react';
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#857566] bg-[#EBE3D6]/60 border border-[#D2C4B1] rounded-lg cursor-not-allowed"
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#FAF7F2] bg-[#4A3B2C] rounded-lg hover:bg-[#382B1E] transition-colors cursor-pointer"
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

  return (
    <div className="flex items-center gap-2">
      {user.photoURL ? (
        <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-[#D2C4B1]" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#DECFC0] text-[#4A3B2C] text-xs font-bold flex items-center justify-center">
          {(user.displayName ?? '?').slice(0, 1).toUpperCase()}
        </div>
      )}
      <span className="hidden lg:inline text-xs text-[#5C4E40] max-w-[9rem] truncate" title={user.email ?? ''}>
        {user.displayName ?? 'Signed in'}
      </span>
      <button
        id="sign_out_btn"
        type="button"
        onClick={signOut}
        title="Sign out"
        className="p-1.5 rounded-lg text-[#5C4E40] bg-[#EBE3D6] border border-[#D2C4B1] hover:bg-[#E4DBCF] cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
