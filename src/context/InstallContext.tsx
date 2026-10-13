import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useCookbook } from './CookbookContext';
import { isInstalledApp, isIos } from '../services/push';
import { InstallSheet } from '../components/InstallSheet';

/**
 * "Add to Home Screen" help. Apple does not let a website open Safari's own add-to-home-screen screen, so on iPhone and
 * iPad the cookbook shows a pop-up with the taps to make. Android and desktop Chrome get a real Install button.
 *
 * On phones and tablets the pop-up opens by itself once someone has used the cookbook a little (their first recipe, or
 * 30 seconds), never while it is already installed, at most once per visit, and not again for 14 days after "Not now"
 * (never after "Don't show again"). On a computer it never opens by itself. Anyone can open it any time from Share
 * Cookbook, or from the phone-alerts hint in the bell.
 */

/** What to show: the Safari steps, the steps for another iPhone browser, "open this in Safari first", a real Install button, or general advice. */
export type InstallMode = 'ios-safari' | 'ios-other' | 'in-app' | 'native' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallContextType {
  installed: boolean;
  mode: InstallMode;
  openInstallHelp: () => void;
}

const InstallContext = createContext<InstallContextType | null>(null);

const SNOOZE_KEY = 'heritage_cookbook_install_snooze_until';
const NEVER_KEY = 'heritage_cookbook_install_never';
const SNOOZE_DAYS = 14;
const AUTO_DELAY_MS = 30_000;

/** Links opened inside Facebook, Instagram, the Google app and similar open in a mini browser that cannot add to the Home Screen. */
const isInAppBrowser = () => /FBAN|FBAV|FB_IAB|Instagram|Line\/|LinkedInApp|Twitter|MicroMessenger|Snapchat|musical_ly|TikTok|Pinterest|GSA\//.test(navigator.userAgent);
/** Chrome, Firefox, Edge or Opera on an iPhone: they can add to the Home Screen too, from their own Share button. */
const isOtherIosBrowser = () => /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
/** Only phones and tablets get the pop-up by itself; on a computer it would be in the way. */
const isPhoneOrTablet = () => isIos() || /Android|Mobi/i.test(navigator.userAgent);

const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* private window */ } };

export const InstallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScreen } = useCookbook();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isInstalledApp);
  const [open, setOpen] = useState(false);
  const [openedByItself, setOpenedByItself] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const shownThisVisit = useRef(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the browser's own mini-bar out of the way; the pop-up has the Install button
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); setOpen(false); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    const timer = window.setTimeout(() => setTimeUp(true), AUTO_DELAY_MS);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const mode: InstallMode = isInAppBrowser()
    ? 'in-app'
    : deferred
      ? 'native'
      : isIos()
        ? (isOtherIosBrowser() ? 'ios-other' : 'ios-safari')
        : 'other';

  // Open by itself once the person has used the cookbook a little.
  const engaged = timeUp || currentScreen.type === 'detail';
  useEffect(() => {
    if (!engaged || installed || open || shownThisVisit.current || mode === 'other' || !isPhoneOrTablet()) return;
    if (read(NEVER_KEY) === '1') return;
    if (Number(read(SNOOZE_KEY) ?? 0) > Date.now()) return;
    shownThisVisit.current = true;
    setOpenedByItself(true);
    setOpen(true);
  }, [engaged, installed, open, mode]);

  const openInstallHelp = useCallback(() => {
    shownThisVisit.current = true;
    setOpenedByItself(false);
    setOpen(true);
  }, []);

  const notNow = () => {
    // Only a pop-up that opened by itself is put off for two weeks; closing one you opened yourself just closes it.
    if (openedByItself) write(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
    setOpen(false);
  };
  const never = () => { write(NEVER_KEY, '1'); setOpen(false); };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === 'accepted') { setInstalled(true); setOpen(false); }
  };

  return (
    <InstallContext.Provider value={{ installed, mode, openInstallHelp }}>
      {children}
      {open && (
        <InstallSheet mode={mode} installed={installed} openedByItself={openedByItself} onInstall={install} onNotNow={notNow} onNever={never} />
      )}
    </InstallContext.Provider>
  );
};

export const useInstall = (): InstallContextType => {
  const ctx = useContext(InstallContext);
  if (!ctx) throw new Error('useInstall must be used inside InstallProvider');
  return ctx;
};
