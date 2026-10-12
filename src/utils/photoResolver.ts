import { Recipe } from '../types';

// Photos come from the original cookbook PDF (files named cook_p<page>_<n>.jpg).
// Each recipe lists its own photos in recipes.json; recipes without one show a
// neutral placeholder instead of a borrowed picture.
export const photoUrl = (name: string, ext = 'jpg') => `${import.meta.env.BASE_URL}images/${name}.${ext}`;

/** A photo a member put on a recipe. `id` is its id in the Photos section (comments and reactions are stored under it). */
export interface MemberPhoto {
  id: string;
  url: string;
  by: string;
  uid?: string;
  /** When it was shared (milliseconds). */
  at: number;
  /** 'photo': added to a recipe (any number). 'legacy': the older single shared photo on a cookbook recipe. 'recipe': the photo of a recipe a member added. */
  source: 'photo' | 'legacy' | 'recipe';
}

/** Every photo members have put on this recipe, newest first. */
export function memberPhotosOf(recipe: Recipe): MemberPhoto[] {
  const out: MemberPhoto[] = [];
  if (isSharedPhotoUrl(recipe.imageUrl)) {
    out.push(recipe.community
      ? { id: `recipe_${recipe.id}`, url: recipe.imageUrl!, by: recipe.imageBy || recipe.contributor, uid: recipe.authorUid, at: recipe.addedAt ?? 0, source: 'recipe' }
      : { id: `shared_${recipe.id}`, url: recipe.imageUrl!, by: recipe.imageBy || recipe.contributor, uid: recipe.imageUid, at: recipe.imageAt ?? 0, source: 'legacy' });
  }
  for (const p of recipe.memberPhotos ?? []) out.push({ id: `photo_${p.id}`, url: p.url, by: p.by, uid: p.uid, at: p.at, source: 'photo' });
  return out.sort((a, b) => b.at - a.at);
}

/** All photos for a recipe, in display order (may be empty). */
export function getRecipePhotoUrls(recipe: Recipe): string[] {
  const own = (recipe.photos ?? []).map(n => photoUrl(n));
  const shared = memberPhotosOf(recipe).map(p => p.url);
  if (shared.length === 0) return own;
  // Members' photos replace the illustrative stock photo, newest first, in front of the cookbook's own photos.
  return [...shared, ...own.filter(u => !isStockPhotoUrl(u))];
}

/** A photo hosted online (a family member's upload) rather than one of the bundled files. */
export const isSharedPhotoUrl = (url?: string | null) => !!url && /^https:\/\//.test(url);

/** Family photos used on the Heritage Notes screen. */
export const FAMILY_PHOTO_URL = photoUrl('cook_family');
/** Pen-and-ink cookbook sketch (transparent background), cut in two so the search bar sits between the halves. */
export const COOKBOOK_COVER_TOP_URL = photoUrl('cook_cover_top', 'png');
export const COOKBOOK_COVER_BOTTOM_URL = photoUrl('cook_cover_bottom', 'png');
export const FAMILY_GALLERY_URLS = [photoUrl('cook_p2_1')];

// Stock photos (file names start with "stock_") are free-to-use pictures from
// Pixabay (or Wikimedia Commons) used to illustrate recipes that have no photo in the book.
import credits from '../data/photoCredits.json';

export interface PhotoCredit {
  title: string;
  artist: string;
  license: string;
  url: string;
}

const fileName = (url: string) => url.split('/').pop()?.replace(/\.jpg$/, '') ?? '';
export const isStockPhotoUrl = (url?: string | null) => !!url && fileName(url).startsWith('stock_');
export const getPhotoCredit = (url?: string | null): PhotoCredit | null =>
  url ? (credits as Record<string, PhotoCredit>)[fileName(url)] ?? null : null;
export const allPhotoCredits = (): Array<PhotoCredit & { file: string }> =>
  Object.entries(credits as Record<string, PhotoCredit>)
    .map(([file, c]) => ({ file, ...c }))
    .sort((a, b) => a.title.localeCompare(b.title));
