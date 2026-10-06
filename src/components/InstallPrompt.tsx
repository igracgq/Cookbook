import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

const DISMISSED_KEY = 'heritage_cookbook_install_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isInstalled = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;

const isIos = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac but has a touch screen
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * A small bar offering to put the cookbook on the home screen.
 * Android and desktop Chrome: a real Install button. iPhone and iPad: Safari has no install button, so it
 * shows the two taps (Share, then Add to Home Screen). Hidden once installed or dismissed.
 */
export const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISSED_KEY) === '1'; } catch { return false; }
  });
  const [installed, setInstalled] = useState(isInstalled);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the browser's own mini-bar out of the way; we show our own button
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch { /* ignore */ }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === 'accepted') setInstalled(true);
  };

  if (installed || dismissed) return null;
  const ios = isIos();
  if (!deferred && !ios) return null; // other browsers: nothing to offer

  return (
    <div id="install_prompt" className="print:hidden bg-[#EBE3D6] border-b border-[#D2C4B1] px-4 py-2 text-xs text-[#4A3B2C]">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Download className="w-4 h-4 shrink-0" />
        {deferred ? (
          <>
            <span className="flex-1 min-w-0">Put the cookbook on your home screen. It opens like an app and works offline.</span>
            <button
              id="install_app_btn"
              type="button"
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-[#4A3B2C] text-[#FAF7F2] font-bold hover:bg-[#382B1E] transition-colors cursor-pointer shrink-0"
            >
              Install
            </button>
          </>
        ) : (
          <span className="flex-1 min-w-0">
            Put the cookbook on your home screen: tap <Share className="inline w-3.5 h-3.5 -mt-0.5" aria-label="Share" /> <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
          </span>
        )}
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="p-1 text-[#7D6C5A] hover:text-[#261D16] cursor-pointer shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
