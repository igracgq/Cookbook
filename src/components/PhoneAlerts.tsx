import React, { useEffect, useState } from 'react';
import { BellRing, Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useInstall } from '../context/InstallContext';
import { currentSubscription, disablePush, enablePush, isInstalledApp, isIos, isPushConfigured, pushSupported } from '../services/push';

/** In the bell panel: turn phone pop-ups on or off for this device. */
export const PhoneAlerts: React.FC<{ user: User }> = ({ user }) => {
  const { openInstallHelp } = useInstall();
  const [on, setOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isPushConfigured || !pushSupported()) return;
    currentSubscription().then(sub => { if (!cancelled) setOn(!!sub && Notification.permission === 'granted'); });
    return () => { cancelled = true; };
  }, [user.uid]);

  if (!isPushConfigured) return null;

  const box = 'px-4 py-3 border-t border-[#E4DBCF] text-[11px] leading-snug text-[#5C4E40] space-y-2';

  if (isIos() && !isInstalledApp()) {
    return (
      <div id="phone_alerts" className={box}>
        <p><strong>Pop-ups on your iPhone:</strong> first add the cookbook to your Home Screen. Open the cookbook from that icon, then come back here to turn them on.</p>
        <button id="phone_alerts_how_btn" type="button" onClick={openInstallHelp} className="font-semibold text-[#4A3B2C] underline cursor-pointer">
          Show me how
        </button>
      </div>
    );
  }
  if (!pushSupported()) return null;
  if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
    return (
      <div id="phone_alerts" className={box}>
        <p><strong>Phone alerts are blocked</strong> for this site. To use them, allow notifications for the cookbook in your browser or phone settings.</p>
      </div>
    );
  }

  const toggle = async () => {
    setBusy(true); setError(null);
    try {
      if (on) { await disablePush(user); setOn(false); }
      else { await enablePush(user); setOn(true); }
    } catch (e: any) {
      setError(e?.message || 'That did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="phone_alerts" className={box}>
      <p>
        {on
          ? <><strong>Phone alerts are on</strong> for this device. A pop-up can arrive a few minutes after someone comments or reacts.</>
          : <>Get a pop-up on this device when someone comments on or reacts to your photo. It can arrive a few minutes after.</>}
      </p>
      <button
        id="phone_alerts_btn"
        type="button"
        disabled={busy || on === null}
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] disabled:opacity-60 cursor-pointer"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BellRing className="w-3.5 h-3.5" />}
        {on ? 'Turn off phone alerts' : 'Turn on phone alerts'}
      </button>
      {error && <p role="alert" className="text-[#B8452D]">{error}</p>}
    </div>
  );
};
