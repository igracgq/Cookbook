import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useCookbook } from '../context/CookbookContext';
import { Recipe } from '../types';

/**
 * Under the photos of a recipe a member added: who shared the recipe, and the buttons to delete it
 * (its author, or the cookbook owner). Adding photos is done from the "Dish Photo" bar further down the page;
 * removing a photo is done from the photo itself in the Photos section.
 */
export const SharedPhotoPanel: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { cloudAvailable, user, isAdmin } = useAuth();
  const { deleteRecipe } = useCommunity();
  const { navigateTo } = useCookbook();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!cloudAvailable || !recipe.community) return null;

  const mine = !!user && recipe.authorUid === user.uid;

  const del = async () => {
    setBusy(true);
    try { await deleteRecipe(recipe.id); navigateTo({ type: 'explore' }); }
    catch { setMsg('The recipe could not be deleted. Please try again.'); setBusy(false); setConfirmDelete(false); }
  };

  const confirmButtons = (
    <span className="flex flex-wrap items-center gap-2">
      Delete this recipe for everyone?
      <button type="button" disabled={busy} onClick={del} className="px-2.5 py-1 rounded-lg bg-[#B8452D] text-white font-semibold cursor-pointer">Yes, delete</button>
      <button type="button" onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] cursor-pointer">Keep it</button>
    </span>
  );

  return (
    <div id="shared_photo_panel" className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D2C4B1] text-xs text-[#5C4E40] space-y-2">
      <p><strong>Shared recipe</strong> from {recipe.contributor}.</p>

      {mine && (
        <div>
          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-[#7D6C5A] underline hover:text-[#B8452D] cursor-pointer">Delete my recipe</button>
          ) : confirmButtons}
        </div>
      )}

      {isAdmin && !mine && (
        <div id="owner_controls" className="pt-2 border-t border-[#E4DBCF] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">Owner</span>
          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="underline hover:text-[#B8452D] cursor-pointer">Delete this shared recipe</button>
          ) : confirmButtons}
        </div>
      )}

      {msg && <p role="status" className="text-[#2A441E]">{msg}</p>}
    </div>
  );
};
