import React, { useRef, useState } from 'react';
import { Camera, Loader2, LogIn, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useCookbook } from '../context/CookbookContext';
import { isUploadConfigured, validateImageFile } from '../services/cloudinary';
import { Recipe } from '../types';

/**
 * Under the title of a recipe: who shared the photo, and (for signed-in members) share or replace the
 * one shared photo, or delete a recipe you added.
 */
export const SharedPhotoPanel: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { cloudAvailable, user, isAdmin, signIn } = useAuth();
  const { shareRecipePhoto, removeSharedPhoto, deleteRecipe, photoOwners } = useCommunity();
  const { navigateTo } = useCookbook();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!cloudAvailable) return null;

  const mine = !!user && (recipe.community ? recipe.authorUid === user.uid : photoOwners[recipe.id] === user.uid);
  const hasShared = !!recipe.imageUrl;
  // Rules: a shared photo can only be replaced or removed by the person who shared it, and the photo on a
  // shared recipe belongs to the person who added the recipe.
  const canShare = !!user && isUploadConfigured && (recipe.community ? recipe.authorUid === user.uid : !hasShared || mine);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const problem = validateImageFile(f);
    if (problem) return setMsg(problem);
    setBusy(true); setMsg(null);
    try {
      await shareRecipePhoto(recipe, f);
      setMsg('Photo shared. Everyone can see it now.');
    } catch (err: any) {
      setMsg(err?.message || 'The photo could not be shared. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true); setMsg(null);
    try { await removeSharedPhoto(recipe); setMsg('Your photo was removed.'); }
    catch { setMsg('The photo could not be removed. Please try again.'); }
    finally { setBusy(false); }
  };

  const del = async () => {
    setBusy(true);
    try { await deleteRecipe(recipe.id); navigateTo({ type: 'explore' }); }
    catch { setMsg('The recipe could not be deleted. Please try again.'); setBusy(false); setConfirmDelete(false); }
  };

  return (
    <div id="shared_photo_panel" className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D2C4B1] text-xs text-[#5C4E40] space-y-2">
      {recipe.community && (
        <p><strong>Shared recipe</strong> from {recipe.contributor}.</p>
      )}
      {hasShared && !recipe.community && recipe.imageBy && (
        <p>Photo shared by <strong>{recipe.imageBy}</strong>.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!user && (
          <button type="button" onClick={signIn} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer">
            <LogIn className="w-3.5 h-3.5" /> Sign in to share a photo
          </button>
        )}
        {canShare && (
          <>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={onFile} />
            <button id="share_photo_btn" type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] disabled:opacity-60 cursor-pointer">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              {hasShared && mine ? 'Replace shared photo' : 'Share a photo of this dish'}
            </button>
          </>
        )}
        {mine && hasShared && (
          <button type="button" disabled={busy} onClick={remove} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D2C4B1] text-[#7D6C5A] hover:text-[#B8452D] disabled:opacity-60 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Remove my photo
          </button>
        )}
        {user && !canShare && hasShared && !mine && (
          <span className="text-[#857566]">Only {recipe.imageBy || 'the person who shared it'} can change this photo.</span>
        )}
      </div>

      {recipe.community && mine && (
        <div className="pt-1">
          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-[#7D6C5A] underline hover:text-[#B8452D] cursor-pointer">Delete my recipe</button>
          ) : (
            <span className="flex flex-wrap items-center gap-2">
              Delete this recipe for everyone?
              <button type="button" disabled={busy} onClick={del} className="px-2.5 py-1 rounded-lg bg-[#B8452D] text-white font-semibold cursor-pointer">Yes, delete</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] cursor-pointer">Keep it</button>
            </span>
          )}
        </div>
      )}

      {isAdmin && !mine && (recipe.community || hasShared) && (
        <div id="owner_controls" className="pt-2 border-t border-[#E4DBCF] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">Owner</span>
          {recipe.community ? (
            !confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)} className="underline hover:text-[#B8452D] cursor-pointer">Delete this shared recipe</button>
            ) : (
              <span className="flex flex-wrap items-center gap-2">
                Delete this recipe for everyone?
                <button type="button" disabled={busy} onClick={del} className="px-2.5 py-1 rounded-lg bg-[#B8452D] text-white font-semibold cursor-pointer">Yes, delete</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] cursor-pointer">Keep it</button>
              </span>
            )
          ) : (
            <button type="button" disabled={busy} onClick={remove} className="underline hover:text-[#B8452D] disabled:opacity-60 cursor-pointer">Remove this shared photo</button>
          )}
        </div>
      )}

      {msg && <p role="status" className="text-[#2A441E]">{msg}</p>}
    </div>
  );
};
