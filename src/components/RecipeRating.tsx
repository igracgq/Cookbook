import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRatings } from '../context/RatingsContext';

interface RecipeRatingProps {
  recipeId: string;
  /** 'sm' for the recipe cards, 'md' on the recipe page. */
  size?: 'sm' | 'md';
}

/**
 * Five stars to rate a recipe (tap your star count; tap the same count again to take it back) and, beside them,
 * the average of everyone's ratings. Signed-out visitors see the average and are asked to sign in to rate.
 */
export const RecipeRating: React.FC<RecipeRatingProps> = ({ recipeId, size = 'md' }) => {
  const { cloudAvailable, user, signIn } = useAuth();
  const { summaryFor, myRating, rate } = useRatings();
  const [hover, setHover] = useState(0);
  const [error, setError] = useState(false);

  if (!cloudAvailable) return null;

  const { average, count } = summaryFor(recipeId);
  const mine = myRating(recipeId);
  const shown = hover || mine;
  const px = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  const choose = async (n: number) => {
    if (!user) return signIn();
    setError(false);
    try { await rate(recipeId, mine === n ? 0 : n); }
    catch { setError(true); }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-x-2.5 gap-y-1"
      data-recipe-rating={recipeId}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center" role="group" aria-label="Rate this recipe" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            data-star={n}
            aria-label={`${n} star${n === 1 ? '' : 's'}${mine === n ? ' (your rating, tap to take back)' : ''}`}
            aria-pressed={mine === n}
            title={user ? (mine === n ? 'Tap to take back your rating' : `Rate ${n} star${n === 1 ? '' : 's'}`) : 'Sign in to rate'}
            onMouseEnter={() => setHover(n)}
            onClick={() => choose(n)}
            className={`${size === 'sm' ? 'p-0.5' : 'p-1'} cursor-pointer`}
          >
            <Star className={`${px} ${n <= shown ? 'fill-[#D9A323] text-[#D9A323]' : 'text-[#B9A892]'} transition-colors`} />
          </button>
        ))}
      </div>
      <span className={`${size === 'sm' ? 'text-[11px]' : 'text-sm'} text-[#5C4E40]`} data-rating-summary>
        {count > 0 ? (
          <>
            <strong className="text-[#261D16]">{average.toFixed(1)}</strong> average
            <span className="text-[#857566]"> · {count} rating{count === 1 ? '' : 's'}</span>
          </>
        ) : (
          <span className="text-[#857566]">No ratings yet</span>
        )}
      </span>
      {mine > 0 && size === 'md' && <span className="text-xs text-[#5C7250] font-semibold">You gave it {mine}</span>}
      {error && <span role="alert" className="text-xs text-[#B8452D]">Your rating could not be saved.</span>}
    </div>
  );
};
