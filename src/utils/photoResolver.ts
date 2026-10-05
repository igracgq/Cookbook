import { Recipe } from '../types';

// Photos come from the original cookbook PDF (files named cook_p<page>_<n>.jpg).
// Each recipe lists its own photos in recipes.json; recipes without one show a
// neutral placeholder instead of a borrowed picture.
export const photoUrl = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`;

/** All cookbook photos for a recipe, in display order (may be empty). */
export function getRecipePhotoUrls(recipe: Recipe): string[] {
  return (recipe.photos ?? []).map(photoUrl);
}

/** Family photos used on the Heritage Notes screen. */
export const FAMILY_PHOTO_URL = photoUrl('cook_family');
export const FAMILY_GALLERY_URLS = [photoUrl('cook_p2_1')];
