import React, { useState } from 'react';
import { BookOpen, MessageCircle, Trash2 } from 'lucide-react';
import { PhotoPost } from '../data/photoFeed';
import { PhotoComments } from './PhotoComments';
import { PhotoReactions } from './PhotoReactions';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { timeAgo } from '../utils/timeAgo';

interface PhotoPostCardProps {
  post: PhotoPost;
  onOpenRecipe: (recipeId: string) => void;
}

/** One photo with its caption and, underneath, the conversation about it. */
export const PhotoPostCard: React.FC<PhotoPostCardProps> = ({ post, onOpenRecipe }) => {
  const { cloudAvailable, user, isAdmin } = useAuth();
  const { removeMemberPhoto } = useCommunity();
  const [count, setCount] = useState(0);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const original = post.kind === 'cookbook';
  const noticeLabel = post.recipeTitle || post.caption || 'a family photo';
  const mine = !!user && !!post.uid && post.uid === user.uid;
  // The cookbook owner can remove any member photo, except the photo of a recipe (remove the recipe itself instead).
  const canRemove = !original && !!post.source && (mine || (isAdmin && post.source !== 'recipe'));

  const remove = async () => {
    setRemoving(true); setRemoveError(false);
    try { await removeMemberPhoto({ id: post.id, source: post.source!, recipeId: post.recipeId }); }
    catch { setRemoveError(true); setRemoving(false); setConfirmRemove(false); }
  };

  const heading =
    post.kind === 'recipe' ? <><strong>{post.by}</strong> added a new recipe</>
    : post.kind === 'shared' ? <><strong>{post.by}</strong> shared a photo</>
    : <strong>Original family cookbook</strong>;
  const subline = original
    ? `From the cookbook${post.page ? `, page ${post.page}` : ''}`
    : post.at ? timeAgo(post.at) : 'just now';

  return (
    <article
      id={`photo_post_${post.id}`}
      data-photo-id={post.id}
      className="bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] shadow-sm overflow-hidden"
    >
      <header className="flex items-center gap-3 px-4 pt-4 pb-3">
        {original ? (
          <span className="w-10 h-10 rounded-full bg-[#4A3B2C] text-[#FAF7F2] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </span>
        ) : (
          <span className="w-10 h-10 rounded-full bg-[#DECFC0] text-[#4A3B2C] font-bold flex items-center justify-center shrink-0">
            {(post.by || '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm text-[#261D16] truncate">{heading}</p>
          <p className="text-[11px] text-[#857566]">{subline}</p>
        </div>
      </header>

      {(post.recipeTitle || post.caption) && (
        <div className="px-4 pb-3">
          {post.recipeId && post.recipeTitle ? (
            <button
              type="button"
              onClick={() => onOpenRecipe(post.recipeId!)}
              className="font-serif-heritage text-lg font-bold text-[#261D16] hover:text-[#4A3B2C] hover:underline text-left cursor-pointer"
            >
              {post.recipeTitle}
            </button>
          ) : (
            <p className="font-serif-heritage text-lg font-bold text-[#261D16]">{post.caption}</p>
          )}
        </div>
      )}

      <div className="bg-[#F1EADF]">
        <img
          src={post.url}
          alt={post.recipeTitle || post.caption || 'Family photo'}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="block w-full h-auto max-h-[75vh] object-contain"
        />
      </div>

      <PhotoReactions photoId={post.id} ownerUid={post.uid} label={noticeLabel} />

      {canRemove && (
        <div className="px-4 py-2 border-t border-[#E4DBCF] text-xs text-[#7D6C5A] flex flex-wrap items-center gap-2">
          {!confirmRemove ? (
            <button type="button" data-remove-photo onClick={() => setConfirmRemove(true)} className="flex items-center gap-1.5 hover:text-[#B8452D] cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> {mine ? 'Remove my photo' : 'Remove this photo (owner)'}
            </button>
          ) : (
            <>
              Remove this photo for everyone?
              <button type="button" disabled={removing} onClick={remove} className="px-2.5 py-1 rounded-lg bg-[#B8452D] text-white font-semibold cursor-pointer">Yes, remove</button>
              <button type="button" onClick={() => setConfirmRemove(false)} className="px-2.5 py-1 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] cursor-pointer">Keep it</button>
            </>
          )}
          {removeError && <span role="status" className="text-[#B8452D]">The photo could not be removed. Please try again.</span>}
        </div>
      )}

      {cloudAvailable && (
        <div className="px-4 py-2 border-y border-[#E4DBCF] text-xs text-[#7D6C5A] flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" />
          <span data-comment-count>{count === 0 ? 'No comments yet' : `${count} comment${count === 1 ? '' : 's'}`}</span>
        </div>
      )}

      <div className="px-4 py-4">
        <PhotoComments photoId={post.id} onCount={setCount} ownerUid={post.uid} label={noticeLabel} />
      </div>
    </article>
  );
};
