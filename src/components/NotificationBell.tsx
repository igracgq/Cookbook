import React, { useEffect, useRef, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCookbook } from '../context/CookbookContext';
import { db } from '../services/firebase';
import { REACTIONS } from '../utils/emojis';
import { timeAgo } from '../utils/timeAgo';

interface Notice {
  id: string;
  type: 'comment' | 'reply' | 'reaction';
  photoId: string;
  label: string;
  fromName: string;
  text: string;
  reaction: string;
  read: boolean;
  at: number;
}

/** What the notice says, e.g. "Maria commented on your photo of Tiramisu". */
function describe(n: Notice) {
  const of = n.label ? ` of ${n.label}` : '';
  if (n.type === 'comment') return <><strong>{n.fromName}</strong> commented on your photo{of}</>;
  if (n.type === 'reply') return <><strong>{n.fromName}</strong> also commented on the photo{of}</>;
  const emoji = REACTIONS.find(r => r.type === n.reaction)?.emoji ?? '';
  return <><strong>{n.fromName}</strong> reacted {emoji} to your photo{of}</>;
}

/** The bell in the header: a red number for what is new, and a list of who commented or reacted. */
export const NotificationBell: React.FC = () => {
  const { cloudAvailable, user } = useAuth();
  const { navigateTo } = useCookbook();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const uid = user?.uid;

  useEffect(() => {
    setNotices([]);
    if (!db || !uid) return;
    return onSnapshot(
      query(collection(db, 'notifications', uid, 'items'), orderBy('createdAt', 'desc'), limit(30)),
      snap => setNotices(snap.docs.map(d => {
        const x = d.data();
        return {
          id: d.id,
          type: x.type,
          photoId: String(x.photoId ?? ''),
          label: String(x.label ?? ''),
          fromName: String(x.fromName ?? 'Someone'),
          text: String(x.text ?? ''),
          reaction: String(x.reaction ?? ''),
          read: x.read === true,
          // a notice just written has no server time yet
          at: typeof x.createdAt?.toMillis === 'function' ? x.createdAt.toMillis() : Date.now()
        } as Notice;
      })),
      () => {}
    );
  }, [uid]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!cloudAvailable || !db || !uid) return null;

  const unread = notices.filter(n => !n.read).length;

  const openNotice = (n: Notice) => {
    setOpen(false);
    if (!n.read) updateDoc(doc(db!, 'notifications', uid, 'items', n.id), { read: true }).catch(() => {});
    navigateTo({ type: 'photos', focusId: n.photoId });
  };

  const markAllRead = async () => {
    const batch = writeBatch(db!);
    notices.filter(n => !n.read).forEach(n => batch.update(doc(db!, 'notifications', uid, 'items', n.id), { read: true }));
    await batch.commit().catch(() => {});
  };

  return (
    <div ref={ref} className="relative">
      <button
        id="notification_bell"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} new` : 'Notifications'}
        title="Notifications"
        className="relative p-2 rounded-lg border border-[#D2C4B1] bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] transition-colors cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5" />
        {unread > 0 && (
          <span id="notification_badge" className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B8452D] text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div id="notification_panel" className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-full sm:mt-2 sm:w-80 max-h-[70vh] overflow-y-auto bg-[#FAF7F2] border border-[#D2C4B1] rounded-2xl shadow-lg z-50">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[#E4DBCF]">
            <p className="text-sm font-bold text-[#261D16]">Notifications</p>
            {unread > 0 && (
              <button id="notification_mark_read" type="button" onClick={markAllRead} className="text-xs font-semibold text-[#4A3B2C] underline cursor-pointer">
                Mark all as read
              </button>
            )}
          </div>
          {notices.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-[#7D6C5A]">
              Nothing yet. You will see it here when someone comments on or reacts to your photo, or replies where you commented.
            </p>
          ) : (
            <ul>
              {notices.map(n => (
                <li key={n.id}>
                  <button
                    type="button"
                    data-notification={n.type}
                    onClick={() => openNotice(n)}
                    className={`w-full text-left px-4 py-3 border-b border-[#E4DBCF] last:border-b-0 hover:bg-[#EBE3D6]/60 cursor-pointer flex items-start gap-2.5 ${n.read ? '' : 'bg-[#EBE3D6]/40'}`}
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-[#B8452D]'}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-[#261D16] leading-snug">{describe(n)}</span>
                      {n.text && <span className="block text-xs text-[#5C4E40] italic mt-0.5 break-words">“{n.text}”</span>}
                      <span className="block text-[11px] text-[#857566] mt-0.5">{timeAgo(n.at)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
