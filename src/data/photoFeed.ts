import { cookbookRecipes, allRecipes } from './cookbookDataSource';
import { Recipe } from '../types';
import { FAMILY_PHOTO_URL, FAMILY_GALLERY_URLS, memberPhotosOf, photoUrl } from '../utils/photoResolver';

/** One photo in the Photos section. */
export interface PhotoPost {
  /** Stable id: comments are stored under it, so it must not change when the photo list does. */
  id: string;
  url: string;
  /** 'cookbook': a photo from the original family cookbook. 'shared': a photo a member shared on a cookbook recipe. 'recipe': the photo of a recipe a member added. */
  kind: 'cookbook' | 'shared' | 'recipe';
  recipeId?: string;
  recipeTitle?: string;
  /** Who shared it (shared photos and added recipes). */
  by?: string;
  /** Firebase uid of the member who shared it (decides who may remove it). */
  uid?: string;
  /** Where a member's photo is stored, so it can be removed: 'photo' (sharedPhotos), 'legacy' (recipePhotos) or 'recipe' (the recipe's own document). */
  source?: 'photo' | 'legacy' | 'recipe';
  /** When it was shared (milliseconds). */
  at?: number;
  /** Page in the original cookbook. */
  page?: number;
  /** Text for photos that belong to no recipe. */
  caption?: string;
}

/**
 * Everything the Photos section shows, newest first:
 * every photo members added (on any recipe, or as part of a recipe they added), then the photos from the
 * original family cookbook. Illustrative stock photos are never included.
 */
export function buildPhotoFeed(): PhotoPost[] {
  const shared: PhotoPost[] = [];
  for (const r of allRecipes) {
    for (const p of memberPhotosOf(r)) {
      shared.push({
        id: p.id,
        url: p.url,
        kind: p.source === 'recipe' ? 'recipe' : 'shared',
        recipeId: r.id,
        recipeTitle: r.title,
        by: p.by,
        uid: p.uid,
        source: p.source,
        at: p.at
      });
    }
  }
  shared.sort((a, b) => (b.at ?? 0) - (a.at ?? 0));

  const original: PhotoPost[] = [
    { id: 'cook_family', url: FAMILY_PHOTO_URL, kind: 'cookbook', page: 1, caption: 'The Ruffolo-Vitale family, together' },
    ...FAMILY_GALLERY_URLS.map((url, i) => ({
      id: i === 0 ? 'cook_p2_1' : `cook_p2_${i + 1}`,
      url,
      kind: 'cookbook' as const,
      page: 2,
      caption: 'Family members in the kitchen'
    }))
  ];
  const byPage: Recipe[] = [...cookbookRecipes].sort((a, b) => (a.originalPhotoPage ?? a.cookbookPage) - (b.originalPhotoPage ?? b.cookbookPage));
  for (const r of byPage) {
    for (const name of r.photos ?? []) {
      if (!name.startsWith('cook_')) continue; // stock photos are not family photos
      original.push({
        id: name,
        url: photoUrl(name),
        kind: 'cookbook',
        recipeId: r.id,
        recipeTitle: r.title,
        page: r.originalPhotoPage ?? r.cookbookPage
      });
    }
  }
  return [...shared, ...original];
}

/**
 * The Photos-section id for a photo shown on a recipe page, or null when it has none (illustrative stock photos
 * are not family photos, so they cannot be commented on).
 */
export function photoPostIdForUrl(recipe: Recipe, url?: string | null): string | null {
  if (!url) return null;
  const member = memberPhotosOf(recipe).find(p => p.url === url);
  if (member) return member.id;
  const m = url.match(/\/images\/(cook_[A-Za-z0-9_]+)\.jpg(?:$|\?)/);
  return m ? m[1] : null;
}
