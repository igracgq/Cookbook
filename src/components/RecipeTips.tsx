import React, { useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { Loader2, LogIn, Trash2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { Recipe } from '../types';

const MAX_TIP = 1000;

interface Tip {
  id: string; // the author's uid: one tip per member per recipe
  text: string;
  authorName: string;
  updatedAt: Date | null;
}

/**
 * "Tips to share with others": every visitor can read the tips for a recipe, and signed-in members can
 * write one tip of their own (shared in recipeTips/{recipeId}/tips/{uid}).
 */
export const RecipeTips: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { cloudAvailable, user, signIn } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [text, setText] = useState('');
  const edited = useRef(false); // true while the box holds changes that are not shared yet
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!db) return;
    setLoadFailed(false);
    return onSnapshot(
      query(collection(db, 'recipeTips', recipe.id, 'tips'), orderBy('updatedAt', 'desc')),
      snap => setTips(
        snap.docs.map(d => ({
          id: d.id,
          text: String(d.data().text ?? ''),
          authorName: String(d.data().authorName ?? 'Family member'),
          updatedAt: d.data().updatedAt?.toDate?.() ?? null
        }))
      ),
      () => setLoadFailed(true)
    );
  }, [recipe.id]);

  const mine = user ? tips.find(t => t.id === user.uid) : undefined;
  const others = tips.filter(t => t.id !== user?.uid);

  // Show the member's saved tip in the box, unless they are in the middle of editing it.
  useEffect(() => {
    if (!edited.current) setText(mine?.text ?? '');
  }, [mine?.text]);

  if (!cloudAvailable || !db) return null;

  const share = async () => {
    const t = text.trim();
    if (!user || !t) return;
    setBusy(true); setMsg(null);
    try {
      await setDoc(doc(db!, 'recipeTips', recipe.id, 'tips', user.uid), {
        text: t,
        authorName: user.displayName ?? 'Family member',
        updatedAt: serverTimestamp()
      });
      edited.current = false;
      setText(t);
      setMsg({ ok: true, text: 'Your tip is shared. Everyone who opens this recipe can see it.' });
    } catch {
      setMsg({ ok: false, text: 'Your tip could not be shared. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setBusy(true); setMsg(null);
    try {
      await deleteDoc(doc(db!, 'recipeTips', recipe.id, 'tips', user.uid));
      edited.current = false;
      setText('');
      setMsg({ ok: true, text: 'Your tip was removed.' });
    } catch {
      setMsg({ ok: false, text: 'Your tip could not be removed. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="recipe_tips_box" className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-3">
      <div>
        <h3 className="font-serif-heritage text-base font-bold text-[#261D16] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#4A3B2C]" />
          <span>Tips to share with others</span>
        </h3>
        <p className="text-[11px] text-[#7D6C5A] mt-0.5">Everyone who opens this recipe can see the tips shared here.</p>
      </div>

      <textarea
        id="recipe_tip_textarea"
        rows={3}
        maxLength={MAX_TIP}
        value={text}
        disabled={!user}
        onChange={e => { edited.current = true; setText(e.target.value); setMsg(null); }}
        placeholder="Help others by including your own tips on this recipe preparation"
        className="w-full p-3 bg-white border border-[#D2C4B1] rounded-xl text-xs sm:text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C] disabled:opacity-70"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-[#857566]">{user ? `${text.length}/${MAX_TIP}` : ''}</span>
        <div className="flex items-center gap-2">
          {!user && (
            <button
              type="button"
              onClick={signIn}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#382B1E] transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign in to share a tip
            </button>
          )}
          {user && mine && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D2C4B1] text-xs text-[#7D6C5A] hover:text-[#B8452D] disabled:opacity-60 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove my tip
            </button>
          )}
          {user && (
            <button
              id="share_tip_btn"
              type="button"
              disabled={busy || !text.trim() || text.trim() === mine?.text}
              onClick={share}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#382B1E] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mine ? 'Update my tip' : 'Share tip'}
            </button>
          )}
        </div>
      </div>

      {msg && (
        <p role="status" className={`text-xs ${msg.ok ? 'text-[#2A441E]' : 'text-[#B8452D]'}`}>{msg.text}</p>
      )}
      {loadFailed && <p className="text-xs text-[#B8452D]">Tips could not be loaded right now.</p>}

      {others.length > 0 && (
        <div className="pt-3 border-t border-[#E4DBCF] space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">Tips from others</h4>
          <ul className="space-y-3">
            {others.map(t => (
              <li key={t.id} className="text-xs sm:text-sm text-[#261D16]">
                <p className="whitespace-pre-wrap break-words">{t.text}</p>
                <p className="mt-1 text-[11px] text-[#857566]">
                  {t.authorName}
                  {t.updatedAt && ` · ${t.updatedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
