import { addDoc, collection, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';
import type { ReactionType } from '../utils/emojis';

/**
 * In-app notifications (the bell). When someone comments on or reacts to a photo, a small notice is written
 * under the person it is for: notifications/{recipientUid}/items/{id}. Failing to send one never blocks the
 * comment or reaction itself, so every function here swallows its errors.
 */

const snippet = (t: string) => (t.length > 120 ? `${t.slice(0, 117)}...` : t);
const who = (user: User) => user.displayName ?? 'Someone';

/** Tell the photo's owner about a new comment, and everyone else who commented earlier about it too. */
export async function notifyAboutComment(opts: {
  user: User;
  photoId: string;
  label: string;
  text: string;
  ownerUid?: string;
  earlierCommenterUids: string[];
}) {
  if (!db) return;
  const { user, photoId, label, text, ownerUid, earlierCommenterUids } = opts;
  const send = (to: string, type: 'comment' | 'reply') =>
    addDoc(collection(db!, 'notifications', to, 'items'), {
      type, photoId, label, fromUid: user.uid, fromName: who(user), text: snippet(text), createdAt: serverTimestamp(), read: false
    }).catch(() => {});
  const jobs: Promise<unknown>[] = [];
  if (ownerUid && ownerUid !== user.uid) jobs.push(send(ownerUid, 'comment'));
  for (const uid of new Set(earlierCommenterUids)) {
    if (uid && uid !== user.uid && uid !== ownerUid) jobs.push(send(uid, 'reply'));
  }
  await Promise.all(jobs);
}

const reactionNoticeId = (photoId: string, fromUid: string) => `reaction_${photoId}_${fromUid}`;

/** Tell the photo's owner about a reaction. One notice per person per photo, so switching emoji just updates it. */
export async function notifyAboutReaction(opts: { user: User; photoId: string; label: string; ownerUid?: string; reaction: ReactionType }) {
  const { user, photoId, label, ownerUid, reaction } = opts;
  if (!db || !ownerUid || ownerUid === user.uid) return;
  try {
    await setDoc(doc(db, 'notifications', ownerUid, 'items', reactionNoticeId(photoId, user.uid)), {
      type: 'reaction', photoId, label, fromUid: user.uid, fromName: who(user), reaction, createdAt: serverTimestamp(), read: false
    });
  } catch { /* the reaction itself was saved; the notice is a bonus */ }
}

/** Taking a reaction back also takes the notice back. */
export async function withdrawReactionNotice(opts: { user: User; photoId: string; ownerUid?: string }) {
  const { user, photoId, ownerUid } = opts;
  if (!db || !ownerUid || ownerUid === user.uid) return;
  try { await deleteDoc(doc(db, 'notifications', ownerUid, 'items', reactionNoticeId(photoId, user.uid))); } catch { /* nothing to withdraw */ }
}
