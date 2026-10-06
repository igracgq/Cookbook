import { Recipe } from '../types';

// Photos come from the original cookbook PDF (files named cook_p<page>_<n>.jpg).
// Each recipe lists its own photos in recipes.json; recipes without one show a
// neutral placeholder instead of a borrowed picture.
export const photoUrl = (name: string, ext = 'jpg') => `${import.meta.env.BASE_URL}images/${name}.${ext}`;

/** All cookbook photos for a recipe, in display order (may be empty). */
export function getRecipePhotoUrls(recipe: Recipe): string[] {
  const own = (recipe.photos ?? []).map(n => photoUrl(n));
  if (!recipe.imageUrl) return own;
  // A real shared photo replaces the illustrative stock photo but sits in front of the cookbook's own photos.
  return [recipe.imageUrl, ...own.filter(u => !isStockPhotoUrl(u))];
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
