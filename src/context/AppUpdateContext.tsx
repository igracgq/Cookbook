import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Knows whether a newer version of the app has been published.
 *
 * Every build gets a new hashed script name (assets/index-XXXX.js). The running page remembers its own script
 * name; a check fetches the published index.html (bypassing every cache) and compares. Checks run shortly after
 * opening, whenever the app comes back to the foreground, when the connection returns, and every 30 minutes.
 */
export type UpdateStatus = 'idle' | 'checking' | 'latest' | 'available' | 'error';

interface AppUpdateContextType {
  /** False while developing locally, where there is nothing to compare. */
  supported: boolean;
  status: UpdateStatus;
  checkForUpdate: () => Promise<void>;
  /** Load the new version. */
  applyUpdate: () => void;
}

const SCRIPT_RE = /\/assets\/index-[^/"'\s]+\.js/;

const fileName = (path: string) => path.split('/').pop() ?? path;

const runningScript = (): string | null => {
  for (const s of Array.from(document.scripts)) {
    if (!s.src) continue;
    const path = new URL(s.src).pathname;
    if (SCRIPT_RE.test(path)) return fileName(path);
  }
  return null;
};

const AppUpdateContext = createContext<AppUpdateContextType | null>(null);

export const AppUpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [running] = useState(runningScript);
  const [status, setStatus] = useState<UpdateStatus>('idle');

  const checkForUpdate = useCallback(async () => {
    if (!running) return;
    setStatus(prev => (prev === 'available' ? prev : 'checking'));
    try {
      // "__v" makes the address unique, and the service worker lets such requests go straight to the network.
      const res = await fetch(`${import.meta.env.BASE_URL}index.html?__v=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const match = (await res.text()).match(SCRIPT_RE)?.[0];
      if (!match) throw new Error('no script found');
      const published = fileName(match);
      setStatus(published === running ? 'latest' : 'available');
    } catch {
      setStatus(prev => (prev === 'available' ? prev : navigator.onLine ? 'error' : 'idle'));
    }
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const first = setTimeout(checkForUpdate, 4000);
    const onVisible = () => { if (document.visibilityState === 'visible') checkForUpdate(); };
    const timer = setInterval(checkForUpdate, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', checkForUpdate);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', checkForUpdate);
    };
  }, [running, checkForUpdate]);

  const applyUpdate = useCallback(() => {
    // Ask the service worker to look for its own update too, then reload: a reload revalidates the page.
    const reload = () => window.location.reload();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => Promise.all(regs.map(r => r.update()))).catch(() => {}).finally(reload);
    } else {
      reload();
    }
  }, []);

  return (
    <AppUpdateContext.Provider value={{ supported: !!running, status, checkForUpdate, applyUpdate }}>
      {children}
    </AppUpdateContext.Provider>
  );
};

export const useAppUpdate = (): AppUpdateContextType => {
  const ctx = useContext(AppUpdateContext);
  if (!ctx) throw new Error('useAppUpdate must be used inside AppUpdateProvider');
  return ctx;
};
