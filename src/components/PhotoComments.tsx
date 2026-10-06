import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { Loader2, LogIn, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { timeAgo } from '../utils/timeAgo';

const MAX_COMMENT = 1000;
const SHOWN_FIRST = 5;

interface Comment {
  id: string;
  text: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  at: number | null;
}

const Avatar: React.FC<{ name: string; photo?: string }> = ({ name, photo }) => {
  const [failed, setFailed] = useState(false);
  return photo && !failed ? (
    <img src={photo} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#D2C4B1]" />
  ) : (
    <span className="w-8 h-8 rounded-full bg-[#DECFC0] text-[#4A3B2C] text-xs font-bold flex items-center justify-center shrink-0">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
};

/**
 * The comments under one photo: everyone sees them, signed-in members add their own, and can remove their own.
 * They live in photoComments/{photoId}/comments, so a photo always shows the same conversation.
 */
export const PhotoComments: React.FC<{ photoId: string; onCount?: (n: number) => void }> = ({ photoId, onCount }) => {
  const { cloudAvailable, user, signIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!db) return;
    setLoadFailed(false);
    return onSnapshot(
      // newest 100, shown oldest first like a conversation
      query(collection(db, 'photoComments', photoId, 'comments'), orderBy('createdAt', 'desc'), limit(100)),
      snap => {
        const list = snap.docs
          .map(d => {
            const x = d.data();
            return {
              id: d.id,
              text: String(x.text ?? ''),
              authorUid: String(x.authorUid ?? ''),
              authorName: String(x.authorName ?? 'Family member'),
              authorPhoto: String(x.authorPhoto ?? ''),
              // a comment just posted has no server time yet
              at: typeof x.createdAt?.toMillis === 'function' ? x.createdAt.toMillis() : null
            } as Comment;
          })
          .reverse();
        setComments(list);
        onCount?.(list.length);
      },
      () => setLoadFailed(true)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId]);

  if (!cloudAvailable || !db) return null;

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!user || !t || busy) return;
    setBusy(true); setError(null);
    try {
      const data: Record<string, unknown> = {
        text: t,
        authorUid: user.uid,
        authorName: user.displayName ?? 'Family member',
        createdAt: serverTimestamp()
      };
      if (user.photoURL) data.authorPhoto = user.photoURL;
      await addDoc(collection(db!, 'photoComments', photoId, 'comments'), data);
      setText('');
    } catch {
      setError('Your comment could not be posted. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try { await deleteDoc(doc(db!, 'photoComments', photoId, 'comments', id)); }
    catch { setError('That comment could not be removed. Please try again.'); }
  };

  const hidden = showAll ? 0 : Math.max(0, comments.length - SHOWN_FIRST);
  const visible = comments.slice(hidden);

  return (
    <div className="space-y-3" data-photo-comments={photoId}>
      {hidden > 0 && (
        <button type="button" onClick={() => setShowAll(true)} className="text-xs font-semibold text-[#7D6C5A] hover:text-[#261D16] underline cursor-pointer">
          View {hidden} earlier comment{hidden === 1 ? '' : 's'}
        </button>
      )}

      {visible.length > 0 && (
        <ul className="space-y-3">
          {visible.map(c => (
            <li key={c.id} className="flex items-start gap-2.5" data-comment>
              <Avatar name={c.authorName} photo={c.authorPhoto} />
              <div className="min-w-0 flex-1">
                <div className="inline-block max-w-full bg-[#EBE3D6]/70 rounded-2xl px-3.5 py-2">
                  <p className="text-xs font-bold text-[#261D16]">{c.authorName}</p>
                  <p className="text-sm text-[#261D16] whitespace-pre-wrap break-words">{c.text}</p>
                </div>
                <p className="mt-0.5 ml-3 text-[11px] text-[#857566] flex items-center gap-3">
                  <span>{c.at ? timeAgo(c.at) : 'just now'}</span>
                  {user?.uid === c.authorUid && (
                    <button type="button" onClick={() => remove(c.id)} className="hover:text-[#B8452D] cursor-pointer">Delete</button>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {loadFailed && <p className="text-xs text-[#B8452D]">Comments could not be loaded right now.</p>}

      {user ? (
        <form onSubmit={post} className="flex items-start gap-2.5">
          <Avatar name={user.displayName ?? '?'} photo={user.photoURL ?? undefined} />
          <div className="flex-1 min-w-0 flex items-end gap-2">
            <textarea
              rows={1}
              value={text}
              maxLength={MAX_COMMENT}
              onChange={e => { setText(e.target.value); setError(null); }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); (e.currentTarget.form as HTMLFormElement).requestSubmit(); } }}
              placeholder="Write a comment..."
              aria-label="Write a comment"
              className="comment-input flex-1 min-w-0 resize-none px-3.5 py-2 bg-white border border-[#D2C4B1] rounded-2xl text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              aria-label="Post comment"
              className="comment-post p-2.5 rounded-full bg-[#4A3B2C] text-[#FAF7F2] hover:bg-[#382B1E] disabled:opacity-40 transition-colors cursor-pointer"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={signIn} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer">
          <LogIn className="w-3.5 h-3.5" /> Sign in to comment
        </button>
      )}
      {error && <p role="alert" className="text-xs text-[#B8452D]">{error}</p>}
    </div>
  );
};
