import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { REACTIONS, ReactionType } from '../utils/emojis';

interface Reaction {
  uid: string;
  type: ReactionType;
  name: string;
}

/** "You, Frank and 3 others" */
function whoReacted(list: Reaction[], myUid?: string): string {
  const names = list.map(r => (r.uid === myUid ? 'You' : r.name || 'Someone'));
  names.sort((a, b) => (a === 'You' ? -1 : b === 'You' ? 1 : 0));
  if (names.length <= 2) return names.join(' and ');
  return `${names[0]}, ${names[1]} and ${names.length - 2} other${names.length - 2 === 1 ? '' : 's'}`;
}

/**
 * Four reactions under a photo. Everyone sees the counts; a signed-in member picks one (tap another to switch,
 * tap the same one again to take it back). One reaction per member per photo, stored in
 * photoReactions/{photoId}/reactions/{uid}.
 */
export const PhotoReactions: React.FC<{ photoId: string }> = ({ photoId }) => {
  const { cloudAvailable, user, signIn } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, 'photoReactions', photoId, 'reactions'),
      snap => setReactions(
        snap.docs
          .map(d => ({ uid: d.id, type: d.data().type as ReactionType, name: String(d.data().authorName ?? '') }))
          .filter(r => REACTIONS.some(x => x.type === r.type))
      ),
      () => {}
    );
  }, [photoId]);

  if (!cloudAvailable || !db) return null;

  const mine = user ? reactions.find(r => r.uid === user.uid)?.type : undefined;

  const choose = async (type: ReactionType) => {
    if (!user) return signIn();
    setError(false);
    const ref = doc(db!, 'photoReactions', photoId, 'reactions', user.uid);
    try {
      if (mine === type) await deleteDoc(ref);
      else await setDoc(ref, { type, authorName: user.displayName ?? 'Family member', updatedAt: serverTimestamp() });
    } catch {
      setError(true);
    }
  };

  return (
    <div className="px-4 py-2.5 border-t border-[#E4DBCF] space-y-1.5" data-photo-reactions={photoId}>
      <div className="flex flex-wrap items-center gap-1.5">
        {REACTIONS.map(r => {
          const count = reactions.filter(x => x.type === r.type).length;
          const selected = mine === r.type;
          return (
            <button
              key={r.type}
              type="button"
              data-reaction={r.type}
              aria-pressed={selected}
              aria-label={`${r.label}${count ? `, ${count}` : ''}`}
              title={user ? (selected ? `Take back your ${r.label}` : r.label) : `${r.label} (sign in to react)`}
              onClick={() => choose(r.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
                selected
                  ? 'bg-[#4A3B2C] border-[#4A3B2C] text-[#FAF7F2]'
                  : 'bg-[#EBE3D6]/60 border-[#D2C4B1] text-[#4A3B2C] hover:bg-[#E4DBCF]'
              }`}
            >
              <span aria-hidden="true">{r.emoji}</span>
              {count > 0 && <span className="text-xs font-semibold" data-reaction-count>{count}</span>}
            </button>
          );
        })}
      </div>
      {reactions.length > 0 && (
        <p className="text-[11px] text-[#7D6C5A]" data-reaction-who>{whoReacted(reactions, user?.uid)}</p>
      )}
      {error && <p role="alert" className="text-xs text-[#B8452D]">Your reaction could not be saved. Please try again.</p>}
    </div>
  );
};
