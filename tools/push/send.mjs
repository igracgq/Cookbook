// Sends phone pop-ups for new notifications (comments and reactions on a member's photos).
//
// Run every few minutes by .github/workflows/send-push-notifications.yml. For each member who has switched phone alerts
// on, it looks at their newest notifications, sends one pop-up for the ones that are still unread and not yet sent, and
// marks them as sent. A device that no longer exists (the person removed the app or turned alerts off) is forgotten.
// Setup: docs/PHONE_ALERTS_SETUP.md
import { pathToFileURL } from 'node:url';

const EMOJI = { like: '👍', love: '❤️', yum: '😋', haha: '😂', celebrate: '🙌', clap: '👏' };
const DAY = 24 * 60 * 60 * 1000;
const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

/** The sentence for one notification, e.g. "Maria commented on your photo of Tiramisu". */
export function describe(n) {
  const of = n.label ? ` of ${n.label}` : '';
  const who = n.fromName || 'Someone';
  if (n.type === 'comment') return `${who} commented on your photo${of}${n.text ? `: “${clip(n.text, 80)}”` : ''}`;
  if (n.type === 'reply') return `${who} also commented on the photo${of}${n.text ? `: “${clip(n.text, 80)}”` : ''}`;
  return `${who} reacted ${EMOJI[n.reaction] ?? ''} to your photo${of}`.replace('  ', ' ');
}

/** One pop-up for everything that is new for a person. `pending` is newest first. */
export function buildMessage(pending) {
  if (pending.length === 1) return { title: 'Heritage Cookbook', body: describe(pending[0]), tag: 'cookbook-notice' };
  return {
    title: 'Heritage Cookbook',
    body: `${pending.length} new comments and reactions. Latest: ${describe(pending[0])}`,
    tag: 'cookbook-notice'
  };
}

/**
 * @param db   Firestore (firebase-admin)
 * @param send async (subscription, payloadString) => void; throws an error with .statusCode when the push service refuses
 */
export async function run({ db, send, now = Date.now(), maxAgeMs = DAY, log = () => {} }) {
  const subs = new Map(); // uid -> [{ ref, subscription }]
  for (const d of (await db.collection('pushSubscriptions').get()).docs) {
    const x = d.data();
    if (!x.uid || !x.endpoint) continue;
    if (!subs.has(x.uid)) subs.set(x.uid, []);
    subs.get(x.uid).push({ ref: d.ref, subscription: { endpoint: x.endpoint, keys: { p256dh: x.p256dh, auth: x.auth } } });
  }

  const stats = { people: subs.size, popups: 0, notices: 0, devicesRemoved: 0, failures: 0 };
  for (const [uid, devices] of subs) {
    const snap = await db.collection('notifications').doc(uid).collection('items').orderBy('createdAt', 'desc').limit(10).get();
    const pending = snap.docs.filter(d => {
      const x = d.data();
      const at = x.createdAt?.toMillis?.() ?? 0;
      return x.read !== true && !x.pushedAt && at > now - maxAgeMs;
    });
    if (pending.length === 0) continue;

    const payload = JSON.stringify(buildMessage(pending.map(d => d.data())));
    let delivered = 0;
    let gone = 0;
    for (const dev of devices) {
      try {
        await send(dev.subscription, payload);
        delivered++;
      } catch (e) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          gone++;
          stats.devicesRemoved++;
          await dev.ref.delete();
        } else {
          stats.failures++;
          log(`could not reach a device of ${uid}: ${e?.statusCode ?? ''} ${e?.message ?? e}`);
        }
      }
    }
    // Done with these notices if somebody received them, or if there is nobody left to receive them.
    if (delivered > 0 || gone === devices.length) {
      const stamp = new Date(now);
      await Promise.all(pending.map(d => d.ref.update({ pushedAt: stamp })));
      stats.notices += pending.length;
      if (delivered > 0) stats.popups++;
    }
  }
  return stats;
}

async function main() {
  const { FIREBASE_SERVICE_ACCOUNT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!FIREBASE_SERVICE_ACCOUNT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log('Phone alerts are not set up yet (missing secrets). Nothing to do. See docs/PHONE_ALERTS_SETUP.md.');
    return;
  }
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const webpush = (await import('web-push')).default;

  let account;
  try { account = JSON.parse(FIREBASE_SERVICE_ACCOUNT); }
  catch { throw new Error('The FIREBASE_SERVICE_ACCOUNT secret is not valid JSON. Paste the whole contents of the downloaded key file.'); }
  initializeApp({ credential: cert(account) });
  webpush.setVapidDetails(VAPID_SUBJECT || 'https://igracgq.github.io/Cookbook/', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const stats = await run({
    db: getFirestore(),
    send: (subscription, payload) => webpush.sendNotification(subscription, payload, { TTL: 6 * 60 * 60, urgency: 'normal' }),
    log: console.log
  });
  console.log('Done:', JSON.stringify(stats));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error(e); process.exit(1); });
}
