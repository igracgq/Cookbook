import { Recipe, RecipeCategory } from '../types';

// Photos come from the original cookbook PDF (named cook_p<page>_<n>.jpg).
// A recipe uses its own photo when the book has one on its page; otherwise it
// falls back to a representative photo for its chapter.
const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`;

const RECIPE_PHOTOS: Record<string, string> = {
  franks_wine_making: 'cook_p26_1',
  tomato_canning_tradition: 'cook_p75_7',
  gnocchi_alla_rosina: 'cook_p107_1',
  calabrese_homemade_sausage_salami: 'cook_p146_1',
  homemade_capicollo_pancetta: 'cook_p149_1',
  bacalhau_a_rosa: 'cook_p176_1',
  aidens_first_communion_bread: 'cook_p195_1',
  rosina_taralle_2008: 'cook_p202_1',
  glazed_egg_taralli: 'cook_p203_1',
  rosina_pizza_dough: 'cook_p204_1',
  samanthas_s_cookies: 'cook_p234_1',
  pizzelle_della_nonna: 'cook_p242_2',
  cuddruriaddri_calabresi: 'cook_p278_1',
  scalille_calabresi: 'cook_p282_7',
  turdilli_calabresi: 'cook_p285_1',
  easter_pie_pasqualina: 'cook_p293_1',
  fiadone_easter: 'cook_p292_1',
};

const CATEGORY_PHOTOS: Partial<Record<RecipeCategory, string>> = {
  [RecipeCategory.APPETIZERS]: 'cook_p74_1',
  [RecipeCategory.SOUPS]: 'cook_p50_1',
  [RecipeCategory.SALADS]: 'cook_p49_1',
  [RecipeCategory.VEGETABLES]: 'cook_p72_1',
  [RecipeCategory.PICKLING]: 'cook_p71_1',
  [RecipeCategory.RICE_AND_RISOTTO]: 'cook_p49_1',
  [RecipeCategory.PASTA_AND_SAUCES]: 'cook_p76_1',
  [RecipeCategory.BAKED_PASTA]: 'cook_p107_2',
  [RecipeCategory.MEATS]: 'cook_p148_1',
  [RecipeCategory.SEAFOOD]: 'cook_p176_1',
  [RecipeCategory.EGGS]: 'cook_p289_1',
  [RecipeCategory.BREADS_AND_PIZZA]: 'cook_p206_1',
  [RecipeCategory.COOKIES_AND_BISCOTTI]: 'cook_p236_1',
  [RecipeCategory.CAKES_AND_DESSERTS]: 'cook_p301_1',
  [RecipeCategory.HOLIDAY_TRADITIONS]: 'cook_p288_1',
  [RecipeCategory.TARTS_AND_PIES]: 'cook_p293_1',
  [RecipeCategory.DIETS]: 'cook_p49_1',
};

const DEFAULT_PHOTO = 'cook_p2_1';

export const FAMILY_PHOTO_URL = img('cook_p1_1');

export function getHeritagePhotoUrl(recipe: Recipe): string {
  return img(RECIPE_PHOTOS[recipe.id] ?? CATEGORY_PHOTOS[recipe.category] ?? DEFAULT_PHOTO);
}
