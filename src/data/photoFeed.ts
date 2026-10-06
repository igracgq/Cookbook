import { cookbookRecipes, allRecipes } from './cookbookDataSource';
import { Recipe } from '../types';
import { FAMILY_PHOTO_URL, FAMILY_GALLERY_URLS, isSharedPhotoUrl, photoUrl } from '../utils/photoResolver';

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
  /** When it was shared (milliseconds). */
  at?: number;
  /** Page in the original cookbook. */
  page?: number;
  /** Text for photos that belong to no recipe. */
  caption?: string;
}

/**
 * Everything the Photos section shows, newest first:
 * photos members shared (on cookbook recipes, or as part of a recipe they added), then the photos from the
 * original family cookbook. Illustrative stock photos are never included.
 */
export function buildPhotoFeed(): PhotoPost[] {
  const shared: PhotoPost[] = [];
  for (const r of allRecipes) {
    if (!isSharedPhotoUrl(r.imageUrl)) continue;
    shared.push({
      id: r.community ? `recipe_${r.id}` : `shared_${r.id}`,
      url: r.imageUrl!,
      kind: r.community ? 'recipe' : 'shared',
      recipeId: r.id,
      recipeTitle: r.title,
      by: r.imageBy || r.contributor,
      at: r.community ? r.addedAt : r.imageAt
    });
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
