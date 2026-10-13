import React, { useEffect } from 'react';
import { ArrowDown, Compass, Download, Ellipsis, Share, Share2, SquarePlus, X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';
import type { InstallMode } from '../context/InstallContext';

interface InstallSheetProps {
  mode: InstallMode;
  installed: boolean;
  /** It opened by itself (then "Don't show again" is offered). */
  openedByItself: boolean;
  onInstall: () => void;
  onNotNow: () => void;
  onNever: () => void;
}

/** A small rounded picture of the button to tap, so the steps look like what is on the screen. */
const Key: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <span
    className="inline-flex items-center justify-center w-7 h-7 mx-0.5 align-middle rounded-lg bg-white border border-[#D2C4B1] text-[#0A84FF] shadow-sm"
    role="img"
    aria-label={label}
  >
    {children}
  </span>
);

const Step: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
  <li className="flex items-start gap-3">
    <span className="w-6 h-6 shrink-0 rounded-full bg-[#4A3B2C] text-[#FAF7F2] text-xs font-bold flex items-center justify-center mt-0.5">{n}</span>
    <span className="text-sm text-[#261D16] leading-relaxed">{children}</span>
  </li>
);

/** The "Add to Home Screen" pop-up: the taps for this phone and browser, slid up from the bottom near the browser's own buttons. */
export const InstallSheet: React.FC<InstallSheetProps> = ({ mode, installed, openedByItself, onInstall, onNotNow, onNever }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onNotNow(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onNotNow]);

  const ellipsis = <Key label="More (three dots)"><Ellipsis className="w-4 h-4" /></Key>;
  const share = <Key label="Share"><Share className="w-4 h-4" /></Key>;
  const add = <Key label="Add to Home Screen"><SquarePlus className="w-4 h-4" /></Key>;

  let body: React.ReactNode;
  if (installed) {
    body = <p className="text-sm text-[#5C4E40]">The cookbook is already on your Home Screen. Open it from its icon there.</p>;
  } else if (mode === 'native') {
    body = (
      <button
        id="install_app_btn"
        type="button"
        onClick={onInstall}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#4A3B2C] text-[#FAF7F2] text-sm font-bold hover:bg-[#382B1E] cursor-pointer"
      >
        <Download className="w-4 h-4" /> Install the cookbook
      </button>
    );
  } else if (mode === 'in-app') {
    body = (
      <>
        <p className="text-sm text-[#5C4E40]">
          You opened the cookbook inside another app (for example Facebook, Instagram or the Google app). Its browser cannot add it to
          your Home Screen, so open it in your phone's own browser first:
        </p>
        <ol className="space-y-3">
          <Step n={1}>Tap {ellipsis} or the <Key label="Safari (compass)"><Compass className="w-4 h-4" /></Key> button, and choose <strong>Open in Safari</strong> (on Android: <strong>Open in browser</strong> or <strong>Open in Chrome</strong>).</Step>
          <Step n={2}>Once the cookbook is open there, open any recipe and these steps come back for the last few taps. (Or tap the share button <Key label="Share Cookbook"><Share2 className="w-4 h-4" /></Key> at the top of the cookbook, then <strong>Add to Home Screen</strong>.)</Step>
        </ol>
      </>
    );
  } else if (mode === 'ios-other') {
    body = (
      <ol className="space-y-3">
        <Step n={1}>Tap the Share button {share}. It is in the address bar at the top, or in the {ellipsis} menu.</Step>
        <Step n={2}>Scroll down and tap {add} <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</Step>
        <li className="text-xs text-[#7D6C5A] pl-9">Not there? Open this page in Safari instead and follow the steps there.</li>
      </ol>
    );
  } else if (mode === 'ios-safari') {
    body = (
      <ol className="space-y-3">
        <Step n={1}>Tap {ellipsis} at the bottom of the screen. (On some iPhones you see the Share button {share} there instead. Then skip to step 3.)</Step>
        <Step n={2}>Tap {share} <strong>Share</strong>.</Step>
        <Step n={3}>Scroll down and tap {add} <strong>Add to Home Screen</strong>. If you see <strong>Open as Web App</strong>, leave it on. Then tap <strong>Add</strong>.</Step>
        <li className="text-xs text-[#7D6C5A] pl-9">On an iPad these buttons are at the top right of the screen.</li>
      </ol>
    );
  } else {
    body = (
      <p className="text-sm text-[#5C4E40]">
        Look in your browser's menu for <strong>Add to Home Screen</strong> or <strong>Install app</strong>. On a phone, it is easiest
        in Safari (iPhone) or Chrome (Android).
      </p>
    );
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[90] bg-[#261D16]/45 flex items-end sm:items-center justify-center"
        onMouseDown={e => { if (e.target === e.currentTarget) onNotNow(); }}
      >
        <div
          id="install_sheet"
          data-install-mode={installed ? 'installed' : mode}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install_sheet_title"
          className="install-sheet-in relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-[#FAF7F2] border border-[#D2C4B1] rounded-t-3xl sm:rounded-3xl shadow-2xl px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onNotNow}
            className="absolute top-3 right-3 p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#EBE3D6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="w-12 h-12 rounded-xl border border-[#D2C4B1] shrink-0" />
            <div>
              <h2 id="install_sheet_title" className="font-serif-heritage text-xl font-bold text-[#261D16] leading-tight">
                Add the cookbook to your Home Screen
              </h2>
              <p className="text-xs text-[#5C4E40] mt-0.5">It opens full screen like an app, works without internet, and is needed for phone alerts on iPhone.</p>
            </div>
          </div>

          {body}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <button id="install_not_now_btn" type="button" onClick={onNotNow} className="px-4 py-2 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-sm font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer">
              {openedByItself ? 'Not now' : 'Close'}
            </button>
            {openedByItself && (
              <button id="install_never_btn" type="button" onClick={onNever} className="text-xs text-[#7D6C5A] underline hover:text-[#261D16] cursor-pointer">
                Don't show this again
              </button>
            )}
          </div>

          {/* On an iPhone, Safari's buttons are just below the page (in other apps' browsers they are at the top, so no arrow there). */}
          {mode === 'ios-safari' && !installed && (
            <p className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#7D6C5A]">
              The buttons are just below <ArrowDown className="install-sheet-bounce w-3.5 h-3.5" />
            </p>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
