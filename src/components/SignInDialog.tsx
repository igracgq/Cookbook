import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'signin' | 'signup' | 'reset';

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-[#D2C4B1] bg-white text-sm text-[#261D16] placeholder:text-[#A69480] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]';
const primaryBtn =
  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] text-sm font-semibold hover:bg-[#382B1E] disabled:opacity-60 cursor-pointer';
const secondaryBtn =
  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-[#4A3B2C] text-sm font-semibold hover:bg-[#E4DBCF] disabled:opacity-60 cursor-pointer';
const linkBtn = 'underline text-[#4A3B2C] hover:text-[#B8452D] cursor-pointer';

/** The sign-in window: Google, or email and password (with a name when creating an account). */
export const SignInDialog: React.FC = () => {
  const {
    closeSignIn, authError, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword,
    pendingVerification, resendVerification, confirmVerification, signOut
  } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSignIn(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeSignIn]);

  useEffect(() => { firstField.current?.focus(); }, [mode, !!pendingVerification]);

  const switchMode = (m: Mode) => { setMode(m); setError(null); setNotice(null); };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setError(null); setNotice(null);
    try { await fn(); }
    catch (e: any) { setError(e?.message || 'That did not work. Please try again.'); }
    finally { setBusy(false); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') run(() => signInWithEmail(email, password));
    else if (mode === 'signup') run(() => signUpWithEmail(name, email, password));
    else run(async () => {
      await resetPassword(email);
      setNotice('If that email has an account, we have sent a link to choose a new password. Check your inbox (and spam folder).');
    });
  };

  const checkConfirmed = () => run(async () => {
    const ok = await confirmVerification();
    if (!ok) setError('We cannot see the confirmation yet. Click the link in the email first, then try again.');
  });

  const title = pendingVerification ? 'Confirm your email' : mode === 'reset' ? 'Reset your password' : 'Sign in to the cookbook';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) closeSignIn(); }}
    >
      <div
        id="sign_in_dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-sm max-h-[92vh] overflow-y-auto bg-[#FAF7F2] border border-[#D2C4B1] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={closeSignIn}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#EBE3D6] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="font-serif-heritage text-2xl font-bold text-[#261D16] pr-8">{title}</h2>

        {pendingVerification ? (
          <div className="space-y-3 text-sm text-[#5C4E40]">
            <p>
              We sent an email to <strong className="break-all">{pendingVerification.email}</strong>. Click the link in it to confirm
              that this is your address, then come back here. If you cannot find it, look in your spam folder.
            </p>
            {error && <p role="alert" className="text-xs text-[#B8452D]">{error}</p>}
            {notice && <p role="status" className="text-xs text-[#2A441E]">{notice}</p>}
            <button id="auth_confirm_btn" type="button" disabled={busy} onClick={checkConfirmed} className={primaryBtn}>
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} I have confirmed my email
            </button>
            <button
              id="auth_resend_btn"
              type="button"
              disabled={busy}
              onClick={() => run(async () => { await resendVerification(); setNotice('Sent again. Please check your inbox.'); })}
              className={secondaryBtn}
            >
              Send the email again
            </button>
            <p className="text-xs text-center">
              Wrong address?{' '}
              <button type="button" onClick={() => { setMode('signup'); signOut(); }} className={linkBtn}>Start again</button>
            </p>
          </div>
        ) : (
          <>
            {mode !== 'reset' && (
              <>
                <button id="signin_google_btn" type="button" onClick={signInWithGoogle} className={secondaryBtn}>
                  <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
                    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                  </svg>
                  Continue with Google
                </button>
                {authError && <p role="alert" className="text-xs text-[#B8452D]">{authError}</p>}
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-[#857566]">
                  <span className="flex-1 h-px bg-[#D2C4B1]" /> or use your email <span className="flex-1 h-px bg-[#D2C4B1]" />
                </div>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EBE3D6]" role="tablist">
                  {(['signin', 'signup'] as const).map(m => (
                    <button
                      key={m}
                      id={`auth_tab_${m}`}
                      type="button"
                      role="tab"
                      aria-selected={mode === m}
                      onClick={() => switchMode(m)}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${mode === m ? 'bg-[#FAF7F2] text-[#261D16] shadow-sm' : 'text-[#7D6C5A]'}`}
                    >
                      {m === 'signin' ? 'Sign in' : 'Create account'}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mode === 'reset' && (
              <p className="text-sm text-[#5C4E40]">Type the email you signed up with and we will send you a link to choose a new password.</p>
            )}

            <form onSubmit={submit} className="space-y-3">
              {mode === 'signup' && (
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-[#5C4E40]">Your name</span>
                  <input
                    id="auth_name"
                    ref={firstField}
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="How your name should appear, e.g. Zia Ann"
                    className={inputClass}
                  />
                </label>
              )}
              <label className="block space-y-1">
                <span className="text-xs font-semibold text-[#5C4E40]">Email</span>
                <input
                  id="auth_email"
                  ref={mode === 'signup' ? undefined : firstField}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                />
              </label>
              {mode !== 'reset' && (
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-[#5C4E40]">
                    Password{mode === 'signup' && ' (at least 6 characters)'}
                  </span>
                  <input
                    id="auth_password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
              )}
              {mode !== 'reset' && (
                <label className="flex items-center gap-2 text-xs text-[#5C4E40] cursor-pointer">
                  <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> Show password
                </label>
              )}

              {error && <p role="alert" className="text-xs text-[#B8452D]">{error}</p>}
              {notice && <p role="status" className="text-xs text-[#2A441E]">{notice}</p>}

              <button id="auth_submit_btn" type="submit" disabled={busy} className={primaryBtn}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create my account' : 'Send me a link'}
              </button>
            </form>

            {mode === 'signin' && (
              <p className="text-xs text-center">
                <button id="auth_forgot_btn" type="button" onClick={() => switchMode('reset')} className={linkBtn}>Forgot your password?</button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-xs text-center">
                <button type="button" onClick={() => switchMode('signin')} className={linkBtn}>Back to sign in</button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-[11px] text-[#857566] text-center">We will email you a link to confirm your address. Your email is never shown to other members.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
