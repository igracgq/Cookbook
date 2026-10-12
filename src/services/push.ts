import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';

/**
 * Phone alerts (Web Push). A device subscribes through the browser; the subscription is saved in Firestore
 * (pushSubscriptions/{uid}_{hash of the device address}) where only that member can see it. A scheduled GitHub job
 * (tools/push) reads new notifications and sends the pop-ups. Switched on by VITE_VAPID_PUBLIC_KEY.
 */
const vapidKey: string | undefined = import.meta.env.VITE_VAPID_PUBLIC_KEY;
export const isPushConfigured = !!vapidKey;

const enabledFlag = (uid: string) => `heritage_cookbook_push_${uid}`;

/** This browser can show pop-ups from a server (not true for an iPhone until the cookbook is on the Home Screen). */
export const pushSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isInstalledApp = () =>
  (navigator as any).standalone === true || window.matchMedia?.('(display-mode: standalone)').matches === true;

const urlBase64ToBytes = (b64: string) => {
  const raw = atob((b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
};

const toBase64Url = (buf: ArrayBuffer | null) => {
  if (!buf) return '';
  let s = '';
  new Uint8Array(buf).forEach(b => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** A short fixed id for a device address, so turning alerts on twice does not make two records. */
async function endpointId(endpoint: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return toBase64Url(hash).slice(0, 40);
}

async function registration() {
  return (await navigator.serviceWorker.getRegistration()) ?? navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}

/** The browser's current subscription on this device, if any. */
export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  try { return await (await registration()).pushManager.getSubscription(); } catch { return null; }
}

async function saveSubscription(user: User, sub: PushSubscription) {
  if (!db) throw new Error('Sign-in is not set up.');
  const key = (name: 'p256dh' | 'auth') => toBase64Url(sub.getKey(name));
  await setDoc(doc(db, 'pushSubscriptions', `${user.uid}_${await endpointId(sub.endpoint)}`), {
    uid: user.uid,
    endpoint: sub.endpoint,
    p256dh: key('p256dh'),
    auth: key('auth'),
    createdAt: serverTimestamp()
  });
}

/** Ask permission, subscribe this device, and save the subscription. Throws an Error with a message for the person. */
export async function enablePush(user: User): Promise<void> {
  if (!isPushConfigured) throw new Error('Phone alerts are not switched on for this cookbook yet.');
  if (!pushSupported()) throw new Error('This browser cannot show phone alerts.');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Alerts are blocked. Allow notifications for this site in your browser or phone settings, then try again.');
  }
  const reg = await registration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(vapidKey!) });
    } catch {
      throw new Error('Your phone would not turn on alerts. Please try again in a moment.');
    }
  }
  await saveSubscription(user, sub);
  try { localStorage.setItem(enabledFlag(user.uid), '1'); } catch { /* private window */ }
}

/** Turn alerts off for this device: forget it in Firestore and unsubscribe the browser. */
export async function disablePush(user: User): Promise<void> {
  const sub = await currentSubscription();
  if (sub && db) await deleteDoc(doc(db, 'pushSubscriptions', `${user.uid}_${await endpointId(sub.endpoint)}`)).catch(() => {});
  try { await sub?.unsubscribe(); } catch { /* already gone */ }
  try { localStorage.removeItem(enabledFlag(user.uid)); } catch { /* ignore */ }
}

/**
 * Signing out stops alerts for that person on this device (so the next person who uses a shared phone does not
 * see their pop-ups), but remembers that they had them on.
 */
export async function pausePushForSignOut(user: User): Promise<void> {
  const sub = await currentSubscription();
  if (sub && db) await deleteDoc(doc(db, 'pushSubscriptions', `${user.uid}_${await endpointId(sub.endpoint)}`)).catch(() => {});
}

/** Signing in again: if this person had alerts on, and allowed them, switch them back on quietly. */
export async function resumePushOnSignIn(user: User): Promise<void> {
  try {
    if (!isPushConfigured || !pushSupported() || Notification.permission !== 'granted') return;
    if (localStorage.getItem(enabledFlag(user.uid)) !== '1') return;
    const sub = await currentSubscription();
    if (sub) await saveSubscription(user, sub);
    else await enablePush(user);
  } catch { /* alerts are a bonus */ }
}
