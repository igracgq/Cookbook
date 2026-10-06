import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Images } from 'lucide-react';
import { useCookbook } from '../context/CookbookContext';
import { useAuth } from '../context/AuthContext';
import { buildPhotoFeed } from '../data/photoFeed';
import { PhotoPostCard } from '../components/PhotoPostCard';

const PAGE = 6;

export const PhotosScreen: React.FC = () => {
  const { navigateTo, contentVersion, currentScreen } = useCookbook();
  const { cloudAvailable, user } = useAuth();
  // contentVersion changes whenever members share a photo or add a recipe, so the feed picks them up live
  const feed = useMemo(() => buildPhotoFeed(), [contentVersion]);
  const [shown, setShown] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement | null>(null);

  // Load more photos as the end of the list comes into view. Each photo only listens for its comments once it is on screen.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= feed.length) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) setShown(n => n + PAGE);
    }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, feed.length]);

  // Opened from a recipe: show just that photo, full size, with its comments, and a way back to the recipe.
  if (currentScreen.type === 'photos' && currentScreen.focusId) {
    const { focusId, fromRecipeId } = currentScreen;
    const post = feed.find(p => p.id === focusId);
    return (
      <div id="photo_focus_screen" className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-4">
        <div className="flex items-center justify-between gap-3">
          {fromRecipeId ? (
            <button
              id="back_to_recipe_btn"
              type="button"
              onClick={() => navigateTo({ type: 'detail', recipeId: fromRecipeId })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] text-xs font-bold border border-[#D2C4B1] cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to recipe</span>
            </button>
          ) : <span />}
          <button
            id="see_all_photos_btn"
            type="button"
            onClick={() => navigateTo({ type: 'photos' })}
            className="text-xs font-semibold text-[#4A3B2C] underline cursor-pointer"
          >
            See all photos
          </button>
        </div>
        {post ? (
          <PhotoPostCard post={post} onOpenRecipe={id => navigateTo({ type: 'detail', recipeId: id })} />
        ) : (
          <p className="text-center text-sm text-[#7D6C5A] py-10">This photo is not available any more.</p>
        )}
      </div>
    );
  }

  return (
    <div id="photos_screen" className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-5">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <Images className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Photos
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold text-[#261D16]">Family Photos</h2>
        <p className="text-xs sm:text-sm text-[#5C4E40]">
          Every photo from the family cookbook, and every photo members share. Say something about a dish, ask a question, or swap a tip.
        </p>
        {cloudAvailable && !user && (
          <p className="text-[11px] text-[#7D6C5A]">Everyone can read the comments. Sign in to join in.</p>
        )}
        <p className="text-[11px] text-[#857566]">{feed.length} photos</p>
      </div>

      {feed.slice(0, shown).map(post => (
        <PhotoPostCard key={post.id} post={post} onOpenRecipe={id => navigateTo({ type: 'detail', recipeId: id })} />
      ))}

      {shown < feed.length && (
        <div ref={sentinel} className="text-center py-4">
          <button
            type="button"
            onClick={() => setShown(n => n + PAGE)}
            className="px-4 py-2 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer"
          >
            Show more photos
          </button>
        </div>
      )}
    </div>
  );
};
